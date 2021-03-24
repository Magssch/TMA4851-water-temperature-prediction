const tf = require("@tensorflow/tfjs-node");

function add_hours(date, dt) {
    return new Date(date.setHours(date.getHours() + dt));
}

function interpolate_forecast(forecast) {
    function _interpolate(from, to, key, dt) {
        return (to[key] - from[key]) * dt + from[key];
    }

    let new_forecast = [];
    for (let i = 1; i < forecast.length; ++i) {
        let date_diff = parseInt(
            (new Date(forecast[i].time) - new Date(forecast[i - 1].time)) /
                3600000
        );
        new_forecast.push(forecast[i - 1]);

        for (let h = 1; h < date_diff; ++h) {
            new_forecast.push({
                time: add_hours(new Date(forecast[i - 1].time), h),
                air_temperature: _interpolate(
                    forecast[i - 1],
                    forecast[i],
                    "air_temperature",
                    h / date_diff
                ),
                relative_humidity: _interpolate(
                    forecast[i - 1],
                    forecast[i],
                    "relative_humidity",
                    h / date_diff
                ),
                wind_speed: _interpolate(
                    forecast[i - 1],
                    forecast[i],
                    "wind_speed",
                    h / date_diff
                ),
                wind_direction: _interpolate(
                    forecast[i - 1],
                    forecast[i],
                    "wind_direction",
                    h / date_diff
                ),
                windx: _interpolate(
                    forecast[i - 1],
                    forecast[i],
                    "windx",
                    h / date_diff
                ),
                windy: _interpolate(
                    forecast[i - 1],
                    forecast[i],
                    "windy",
                    h / date_diff
                ),
            });
        }
    }
    new_forecast.push(forecast[forecast.length - 1]);
    return new_forecast;
}

function merge_data(forecast_arr, tide_arr) {
    return forecast_arr.map((el_1) =>
        Object.assign(
            el_1,
            tide_arr.find(
                (el_2) =>
                    new Date(el_2.time).toISOString() ===
                    new Date(el_1.time).toISOString()
            )
        )
    );
}

function format_time(data) {
    data.forEach((el, idx) => {
        data[idx].timestamp = new Date(el.time).getTime() / 1e3;
        data[idx].hour = Math.sin(
            (2 * Math.PI * data[idx].timestamp) / (24 * 60 * 60)
        );
        data[idx].year = Math.sin(
            (2 * Math.PI * data[idx].timestamp) / (365 * 24 * 60 * 60)
        );
    });
    return data;
}

module.exports = async function (
    forecast,
    tide,
    historic_wind,
    historic_temp_hum,
    keys
) {
    let time_now = new Date();
    console.log("Started parsing");
    function parse_tide_date(date) {
        return new Date(date.split("+")[0] + "Z").toISOString();
    }

    let forecast_arr = await forecast.properties.timeseries.map((el) => {
        return {
            time: el.time,
            air_temperature: el.data.instant.details.air_temperature,
            relative_humidity: el.data.instant.details.relative_humidity,
            wind_speed: el.data.instant.details.wind_speed,
            wind_direction: el.data.instant.details.wind_from_direction,
            windx:
                el.data.instant.details.wind_speed *
                Math.sin(
                    (2 *
                        Math.PI *
                        el.data.instant.details.wind_from_direction) /
                        360
                ),
            windy:
                el.data.instant.details.wind_speed *
                Math.cos(
                    (2 *
                        Math.PI *
                        el.data.instant.details.wind_from_direction) /
                        360
                ),
        };
    });

    let tide_arr = await tide.tide.locationdata.data.waterlevel.map((el) => {
        return {
            time: parse_tide_date(el.time),
            tide_pred: parseFloat(el.value),
        };
    });

    let historic_wind_arr = await historic_wind.data.map((el) => {
        let wind_speed = (el.observations[0] || {}).value;
        let wind_direction = (el.observations[1] || {}).value;
        return {
            time: el.referenceTime,
            wind_speed: wind_speed,
            wind_direction: wind_direction,
            windx: wind_speed * Math.sin((2 * Math.PI * wind_direction) / 360),
            windy: wind_speed * Math.cos((2 * Math.PI * wind_direction) / 360),
        };
    });
    let historic_temp_hum_arr = await historic_temp_hum.data.map((el) => {
        return {
            time: el.referenceTime,
            air_temperature: el.observations[0].value,
            relative_humidity: el.observations[1].value,
        };
    });

    forecast_arr = interpolate_forecast(forecast_arr);
    forecast_arr.shift();

    historic_arr = merge_data(historic_temp_hum_arr, historic_wind_arr);

    let weather_data = merge_data(tide_arr, forecast_arr);

    let data = merge_data(weather_data, historic_arr);

    data = await format_time(data).filter(
        (el) =>
            el.tide_pred &&
            el.time &&
            el.air_temperature &&
            el.relative_humidity &&
            el.wind_speed &&
            el.wind_direction
    );
    let dates = data.map((el) => el.time);
    console.log(
        "Finished! Took ",
        (new Date() - time_now) / 10 ** 3,
        "seconds"
    );
    return [
        data.map((el) => {
            return keys.map((key) => el[key]);
        }),
        dates,
    ];
};

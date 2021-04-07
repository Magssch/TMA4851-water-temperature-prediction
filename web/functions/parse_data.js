function add_hours(date, dt) {
  return new Date(date.setHours(date.getHours() + dt));
}

function parse_tide_date(date) {
  return new Date(date.split("+")[0] + "Z").toISOString();
}

function interpolate_forecast(forecast) {
  function _interpolate(from, to, key, dt) {
    return (to[key] - from[key]) * dt + from[key];
  }

  let new_forecast = [];
  for (let i = 1; i < forecast.length; ++i) {
    let date_diff = parseInt(
      (new Date(forecast[i].time) - new Date(forecast[i - 1].time)) / 3600000
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
      });
    }
  }
  new_forecast.push(forecast[forecast.length - 1]);
  return new_forecast;
}

function merge_data(forecast_arr, tide_arr) {
  return forecast_arr.map((row_1) =>
    Object.assign(
      row_1,
      tide_arr.find(
        (row_2) =>
          new Date(row_2.time).toISOString() ===
          new Date(row_1.time).toISOString()
      )
    )
  );
}

function add_processed_columns(data) {
  data.forEach((row, idx) => {
    data[idx].timestamp = new Date(row.time).getTime() / 1e3;
    data[idx].hour = Math.sin(
      (2 * Math.PI * data[idx].timestamp) / (24 * 60 * 60)
    );
    data[idx].year = Math.sin(
      (2 * Math.PI * data[idx].timestamp) / (365 * 24 * 60 * 60)
    );
    data[idx].month = new Date(row.time).getMonth() / 1e9
    data[idx].windx = row.wind_speed * Math.sin((2 * Math.PI * row.wind_direction) / 360);
    data[idx].windy = row.wind_speed * Math.cos((2 * Math.PI * row.wind_direction) / 360);
  });
  return data;
}

function objects_to_arrays(data, keys) {
  return data.map((row) => {
    return keys.map((key) => row[key]);
  })
}

function keys_in_object(data, keys) {
  return keys.every(key => Object.keys(data).includes(key))
}

module.exports = async function (
  forecast,
  tide,
  historic_wind,
  historic_temp_hum,
  keys
) {
  // Extract values from forecast
  let forecast_arr = await forecast.properties.timeseries.map((row) => {
    return {
      time: row.time,
      air_temperature: row.data.instant.details.air_temperature,
      relative_humidity: row.data.instant.details.relative_humidity,
      wind_speed: row.data.instant.details.wind_speed,
      wind_direction: row.data.instant.details.wind_from_direction,
    };
  });

  forecast_arr = interpolate_forecast(forecast_arr);
  forecast_arr.shift();

  // Extract values from tide
  let tide_arr = await tide.tide.locationdata.data.waterlevel.map((row) => {
    return {
      time: parse_tide_date(row.time),
      tide_pred: parseFloat(row.value),
    };
  });

  // Extract values from historic wind data
  let historic_wind_arr = await historic_wind.data.map((row) => {
    let wind_speed = (row.observations[0] || {}).value;
    let wind_direction = (row.observations[1] || {}).value;
    return {
      time: row.referenceTime,
      wind_speed: wind_speed,
      wind_direction: wind_direction,
    };
  });

  // Extract values from historic air temperature and humidity data
  let historic_temp_hum_arr = await historic_temp_hum.data.map((row) => {
    return {
      time: row.referenceTime,
      air_temperature: row.observations[0].value,
      relative_humidity: row.observations[1].value,
    };
  });

  // Merge all weather data into one array of objects
  let historic_arr = merge_data(historic_temp_hum_arr, historic_wind_arr);
  let data = merge_data(tide_arr, forecast_arr);
  data = merge_data(data, historic_arr);

  // Add processed columns and filter out rows with missing values
  data = await add_processed_columns(data).filter(
    (row) => keys_in_object(row, keys)
  );

  let dates = data.map((row) => row.time);

  return [objects_to_arrays(data, keys), dates];
};

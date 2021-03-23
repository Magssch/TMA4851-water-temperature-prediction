const functions = require("firebase-functions");
const get_data = require("./get_data.js");
const parse_data = require("./parse_data.js");

exports.getData = functions.https.onRequest(async (request, response) => {
    let forecast = get_data.location_forecast();

    let tide = get_data.tidevann();

    let wind_historic_data = get_data.historic_data(
        "SN68010",
        "wind_speed,wind_from_direction"
    );
    let temp_hum_historic_data = get_data.historic_data(
        "SN68050",
        "air_temperature,relative_humidity"
    );

    let weather_data = await parse_data(
        await forecast,
        await tide,
        await wind_historic_data,
        await temp_hum_historic_data
    );

    // TODO: Format data to tensor notation.
    //

    response.send(weather_data);
});

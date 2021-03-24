const functions = require("firebase-functions");
const cors = require("cors")({
    origin: true,
    methods: "POST,GET,OPTIONS",
});
const tf = require("@tensorflow/tfjs-node");
const get_data = require("./get_data.js");
const parse_data = require("./parse_data.js");

let objectDetectionModel;
async function loadModel(input) {
    // Warm up the model
    if (!objectDetectionModel) {
        // Load the TensorFlow SavedModel through tfjs-node API. You can find more
        // details in the API documentation:
        // https://js.tensorflow.org/api_node/1.3.1/#node.loadSavedModel
        objectDetectionModel = await tf.node.loadSavedModel(
            "model",
            ["serve"],
            "serving_default"
        );
    }
    var res = null;
    try {
        var input_data = tf.tensor(input);
        var predictions = objectDetectionModel.predict(input_data);
        res = predictions
            .array()
            .then((array) => array.map((arr) => arr[arr.length - 1][0]));
        console.log(res);
    } catch (err) {
        console.log(err);
    }
    return res;
}

exports.getPred = functions.https.onRequest(async (request, response) => {
    console.log("Fetching data");
    const number_of_predictions = 220;
    const look_back = 15;

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

    let keys = [
        "air_temperature",
        "hour",
        "relative_humidity",
        "year",
        "windx",
        "windy",
    ];

    let values = await parse_data(
        await forecast,
        await tide,
        await wind_historic_data,
        await temp_hum_historic_data,
        keys
    );

    let weather_data = values[0];
    let dates = values[1];

    let input = [];
    let outputted_dates = [];

    for (let i = 0; i < number_of_predictions; ++i) {
        input.push([]);
        outputted_dates.push(dates[dates.length - i - 1]);
        for (
            let j = weather_data.length - look_back - i;
            j < weather_data.length - i;
            ++j
        ) {
            input[i].push(weather_data[j]);
        }
    }
    console.log("Predicting data");

    loadModel(input.reverse(), dates)
        .then((r) => {
            console.log("Prediction done");
            return response.send(JSON.stringify({ water: r, weather: r }));
        })
        .catch((e) => {
            response.sendStatus(e);
        });
});

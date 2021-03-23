const functions = require("firebase-functions");
const cors = require("cors")({
    origin: true,
    methods: "POST,GET,OPTIONS",
});
const tf = require("@tensorflow/tfjs-node");
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

    let keys = [
        "air_temperature",
        "hour",
        "relative_humidity",
        "year",
        "windx",
        "windy",
    ];

    let weather_data = await parse_data(
        await forecast,
        await tide,
        await wind_historic_data,
        await temp_hum_historic_data,
        keys
    );

    // TODO: Format data to tensor notation.
    //

    response.send(weather_data);
});


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
    var input_data = tf.tensor([input]);
    var predictions = objectDetectionModel.predict(input_data);
    res = predictions.array().then((array) =>
      JSON.stringify({
        data: array,
      })
    );
    console.log(res);
  } catch (err) {
    console.log(err);
  }
  return res;
}

exports.getPred = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    return loadModel(request.body.data)
      .then((r) => response.send(r))
      .catch((e) => {
        response.sendStatus(e);
      });
  });
});

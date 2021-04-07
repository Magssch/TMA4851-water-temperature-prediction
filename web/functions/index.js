const functions = require("firebase-functions");
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
  const look_back = 15;

  let forecast = get_data.location_forecast();

  let tide = get_data.tidevann(look_back);

  let wind_historic_data = get_data.historic_data(
    "SN68010",
    "wind_speed,wind_from_direction",
    look_back
  );

  let temp_hum_historic_data = get_data.historic_data(
    "SN68050",
    "air_temperature,relative_humidity",
    look_back
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
  let outputted_air_temps = [];

  for (let i = 0; i < weather_data.length - look_back; ++i) {
    input.push([]);
    outputted_dates.push(dates[i + look_back]);
    outputted_air_temps.push(weather_data[i + look_back][0]);
    for (let j = i; j < i + look_back; ++j) {
      input[i].push(weather_data[j]);
    }
  }

  loadModel(input)
    .then((r) => {
      console.log("Prediction done");
      return response.send(
        JSON.stringify({
          water: r,
          air: outputted_air_temps,
          dates: outputted_dates,
        })
      );
    })
    .catch((e) => {
      response.sendStatus(e);
    });
});

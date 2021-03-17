const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });
const axios = require("axios");
const tf = require("@tensorflow/tfjs-node");
/*
var admin = require("firebase-admin");

var serviceAccount = require("./tma4851-bathing-temp-pred-firebase-adminsdk-ebzkm-e941943124.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'tma4851-bathing-temp-pred.appspot.com'
});

var bucket =admin.storage().bucket();
*/
/*exports.getWeatherForecast = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    return axios
      .get(
        "https://api.met.no/weatherapi/locationforecast/2.0/compact.json?lat=63.435770&lon=10.390610"
      )
      .then((r) => {
        response.send(r.data);
        console.log(r.data);
        return res.status(200).json({
          message: response.data.ip,
        });
      })
      .catch((e) => {
        response.sendStatus(e);
      });
  });
});*/

let objectDetectionModel;
async function loadModel() {
  // Warm up the model
  if (!objectDetectionModel) {
    // Load the TensorFlow SavedModel through tfjs-node API. You can find more
    // details in the API documentation:
    // https://js.tensorflow.org/api_node/1.3.1/#node.loadSavedModel
    //file = bucket.ref("saved_model-3.pb");
    objectDetectionModel = await tf.node.loadSavedModel(
      "saved_model-3.pb",
      ["serve"],
      "serving_default"
    );
  }
  var res = null;
  try {
    var input_data = Array([
      [11, -0.6, 0.13, -0.6, 1.7],
      [12, 0.4, 0.12, -1.9, -1.9],
    ]);
    var list = objectDetectionModel.predict(input_data);
    var predictedList = list.toString().split(",");
    res = predictedList;
  } catch (err) {
    console.log(err);
  }
  return res;
}

exports.getPred = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    return loadModel()
      .then((r) => response.send(r.data))
      .catch((e) => response.sendStatus(e));
  });
});

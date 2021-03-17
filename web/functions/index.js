const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });
const axios = require("axios");
const tf = require("@tensorflow/tfjs-node");

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
    /*var input_data = tf.tensor([
      [
        [11, -0.6, 0.13, -0.6, 1.7],
        [12, 0.4, 0.12, -1.9, -1.9],
      ],
    ]);*/
    var input_data = tf.tensor(input);
    console.log(input_data.shape);
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
    return loadModel(JSON.parse(request).data)
      .then((r) => response.send(r))
      .catch((e) => {
        response.sendStatus(e);
      });
  });
});

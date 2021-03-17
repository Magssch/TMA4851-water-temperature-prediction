// const functions = require('firebase-functions');
// const path = require('path');
// const fs = require('fs');

// const tf = require('@tensorflow/tfjs-node');
// const tfCore = require('@tensorflow/tfjs');

// const app = express();


// let objectDetectionModel;
// async function loadModel() {
//     // Warm up the model
//     if (!objectDetectionModel) {
//       // Load the TensorFlow SavedModel through tfjs-node API. You can find more
//       // details in the API documentation:
//       // https://js.tensorflow.org/api_node/1.3.1/#node.loadSavedModel
//       objectDetectionModel = await tf.node.loadSavedModel(
//         'https://firebasestorage.googleapis.com/v0/b/tma4851-bathing-temp-pred.appspot.com/o/saved_model-3.pb?alt=media&token=7e969114-f299-42f7-a055-28c8f9406e4f', ['serve'], 'serving_default');
//     }
//     var res=0;
    
//    try {
//     var input_data = Array([[11, -0.6, 0.13, -0.6, 1.7], [12, 0.4, 0.12, -1.9, -1.9]]);
//     var list = objectDetectionModel.predict(input_data)
//     var predictedList = list.toString().split(",")
//     res=predictedList

//    } catch(err) {
//         console.log(err);
//    }
//    return res
// }

// exports.getPred = functions.https.onRequest( (request, response) => {
//     cors(request, response, () => {
//       return loadModel()
//       .then(r => {
//         response.send(r.data);
//         console.log(r.data)
//         return res.status(200).json({
//           message: response.data.ip
//         })
//       })
//       .catch( e => {
//         response.sendStatus(e);
//       });
//     });
//   });

const functions = require('firebase-functions');
const cors = require("cors")({ origin: true });
const axios = require("axios");

exports.getWeatherForecast = functions.https.onRequest( (request, response) => {
  cors(request, response, () => {
    return axios.get("https://api.met.no/weatherapi/locationforecast/2.0/compact.json?lat=63.435770&lon=10.390610")
    .then(r => {
      response.send(r.data);
      console.log(r.data)
      return res.status(200).json({
        message: response.data.ip
      })
    })
    .catch( e => {
      response.sendStatus(e);
    });
  });
});

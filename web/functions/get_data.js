const axios = require("axios");
var xml_parser = require("xml2json");

const forecast_url =
  "https://api.met.no/weatherapi/locationforecast/2.0/complete.json";

const tide_url = "http://api.sehavniva.no/tideapi.php";

const frost_url = "https://frost.met.no/observations/v0.jsonld";

module.exports = {
  location_forecast: async function () {
    try {
      const { data } = await axios.get(forecast_url, {
        params: {
          lat: 63.4,
          lon: 10.4,
          altitude: 0,
        },
      });
      return data;
    } catch (error) {
      console.log("error", error);
      return false;
    }
  },
  tidevann: async function (look_back = 15) {
    try {
      const from_date = new Date(
        new Date().setHours(new Date().getHours() - look_back)
      );
      const to_date = new Date(new Date().setDate(new Date().getDate() + 10));
      const { data } = await axios.get(tide_url, {
        params: {
          tide_request: "locationdata",
          lat: 63.45039,
          lon: 10.43387,
          datatype: "PRE",
          lang: "nb",
          place: "TRD",
          dst: 1,
          refcode: "CD",
          fromtime: from_date,
          totime: to_date,
          interval: 60,
        },
      });
      return JSON.parse(xml_parser.toJson(data));
    } catch (error) {
      console.log("error", error);
      return false;
    }
  },
  historic_data: async function (station, elements, look_back = 15) {
    try {
      const { data } = await axios.get(frost_url, {
        params: {
          sources: station, // "SN68010",
          referencetime:
            new Date(
              new Date().setHours(new Date().getHours() - look_back)
            ).toISOString() +
            "/" +
            new Date().toISOString(),
          elements: elements, // "air_temperature,relative_humidity,wind_speed,wind_from_direction",
          timeresolutions: "PT1H",
        },
        headers: {
          authorization:
            "Basic YzM1MGRlYWMtYjE0My00ZjJjLWE0YWYtMDdlYjFiMTg3OGIzOjljZjk5OWMyLTE1MTAtNGE5ZS1hZDEwLTI4ODYzZGIwM2E0ZA==",
        },
      });
      return data;
    } catch (error) {
      console.log("error", error);
      return error;
    }
  },
};

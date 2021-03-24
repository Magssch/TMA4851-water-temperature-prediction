import Graph from "./graph";
import "./App.css";
import React, { useState } from "react";
import Button from "@bit/mui-org.material-ui.button";
import Fade from "react-reveal/Fade";

function App() {
  const requestPred = () => {
    fetch("/api/getPrediction", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      mode: "cors",
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setPredictedWaterTemp(response.water[0]);
        setPredictedWeatherTemps(response.weather);
        setPredictionsLoaded(true);
      })
      .catch((err) => console.log(err));
  };
  //useEffect(() => requestPred(), []);
  const [predictionsLoaded, setPredictionsLoaded] = useState(false);
  const [predictedWaterTemp, setPredictedWaterTemp] = useState(0);
  const [predictedWeatherTemps, setPredictedWeatherTemps] = useState([]);

  return (
    <div className="App">
      <div className="predGraph">
        {predictionsLoaded ? (
          <Fade bottom>
            <h1>BadHer</h1>
            <br />
            <Graph weather={predictedWeatherTemps} water={predictedWaterTemp} />
          </Fade>
        ) : (
          <Fade bottom>
            <h1>BadHer</h1>
            <br />
            <h2>Er det digg å bade i Korsvika imorgen?</h2>
            <br />
            <Button
              variant="contained"
              color="primary"
              onClick={() => requestPred()}
            >
              Få svaret
            </Button>
          </Fade>
        )}
      </div>
    </div>
  );
}

export default App;

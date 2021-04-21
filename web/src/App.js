import Graph from "./graph";
import "./App.css";
import React, { useState } from "react";
import Button from "@bit/mui-org.material-ui.button";
import CircularProgress from "@bit/mui-org.material-ui.circular-progress";
import Fade from "react-reveal/Fade";

function App() {
  const requestPred = () => {
    setLoading(true);
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
        setPredictedWaterTemps(response.water);
        setPredictedAirTemps(response.air);
        setPredictionsLoaded(true);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };
  const [loading, setLoading] = useState(false);
  const [predictionsLoaded, setPredictionsLoaded] = useState(false);
  const [predictedWaterTemps, setPredictedWaterTemps] = useState([]);
  const [predictedAirTemps, setPredictedAirTemps] = useState([]);

  return (
    <div className="App">
      <div className="predGraph">
        <Fade top appear={true}>
          <h1>BadHer BETA 💧</h1>
        </Fade>
        {predictionsLoaded ? (
          <Fade bottom>
            <Graph air={predictedAirTemps} water={predictedWaterTemps} />
          </Fade>
        ) : (
          <>
            <br />
            <br />
            <Fade left when={!loading} appear={true}>
              <h2>
                Hvilken badetemperatur er det i Korsvika de neste 72 timene? 🌡️
              </h2>
            </Fade>
            <br />
            <br />
            <Fade right when={!loading} appear={true}>
              <Button
                variant="contained"
                style={{ backgroundColor: "#2196f3", color: "white" }}
                onClick={() => requestPred()}
              >
                Få svaret
              </Button>
            </Fade>
          </>
        )}
        {loading && (
          <Fade bottom when={loading} appear={true}>
            <CircularProgress
              style={{ color: "#2196f3" }}
              variant={"indeterminate"}
            />
          </Fade>
        )}
      </div>
    </div>
  );
}

export default App;

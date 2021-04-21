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
  const [showGraph, setShowGraph] = useState(false);
  const [predictedWaterTemps, setPredictedWaterTemps] = useState([]);
  const [predictedAirTemps, setPredictedAirTemps] = useState([]);

  const getTempMessage = () => {
    if (!predictionsLoaded) return "";
    const avgTemp =
      predictedWaterTemps.reduce((sum, temp) => sum + temp) /
      predictedWaterTemps.length;

    setTimeout(() => setShowGraph(true), 5000);

    if (avgTemp < 10) {
      return "Det er ganske kaldt i vannet nå! 🥶";
    } else if (avgTemp < 17) {
      return "Helt OK temperatur 👍";
    } else {
      return "Veldig varmt, løp ut og bad! 🥵";
    }
  };

  return (
    <div className="App">
      <div className="predGraph">
        <Fade top appear={true}>
          <h1>BadHer BETA</h1>
        </Fade>
        {predictionsLoaded ? (
          <>
            <Fade bottom when={!showGraph} appear={true} opposite={true}>
              <p>
                <br />
                <br style={{ fontSize: "2rem" }}>{getTempMessage()}</br>
                <br />
                <br />
                <b style={{ fontSize: "1rem" }}>Finn ut hvorfor ⬇️</b>
              </p>
            </Fade>
            {showGraph && (
              <Fade bottom when={showGraph} appear={true}>
                <Graph air={predictedAirTemps} water={predictedWaterTemps} />
              </Fade>
            )}
          </>
        ) : (
          <>
            <br />
            <br />
            <Fade left when={!loading} appear={true}>
              <h2>Hvordan er badetemperaturen i Korsvika i morgen?</h2>
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

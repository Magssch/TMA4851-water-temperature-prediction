import Graph from "./graph";
import "./App.css";
import React, { useState } from "react";
import Button from "@bit/mui-org.material-ui.button";
import CircularProgress from "@bit/mui-org.material-ui.circular-progress";
import Fade from "react-reveal/Fade";
import "@fontsource/playfair-display/900-italic.css";

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
        setPredictedWaterTemp(response.water);
        setPredictedAirTemps(response.air);
        setPredictionsLoaded(true);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };
  //useEffect(() => requestPred(), []);
  const [loading, setLoading] = useState(false);
  const [predictionsLoaded, setPredictionsLoaded] = useState(false);
  const [predictedWaterTemp, setPredictedWaterTemp] = useState(0);
  const [predictedAirTemps, setPredictedAirTemps] = useState([]);

  return (
    <div className="App">
      <div className="predGraph">
        <Fade top appear={true}>
          <h1>BadHer BETA</h1>
        </Fade>
        {predictionsLoaded ? (
          <Fade bottom>
            <Graph air={predictedAirTemps} water={predictedWaterTemp} />
          </Fade>
        ) : (
          <>
            <br />
            <br />
            <Fade left when={!loading} appear={true}>
              <h2>Er det digg å bade i Korsvika imorgen?</h2>
            </Fade>
            <br />
            <br />
            <Fade right when={!loading} appear={true}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => requestPred()}
              >
                Få svaret
              </Button>
            </Fade>
          </>
        )}
        {loading && (
          <Fade bottom when={loading} appear={true}>
            <CircularProgress variant={"indeterminate"} />
          </Fade>
        )}
      </div>
    </div>
  );
}

export default App;

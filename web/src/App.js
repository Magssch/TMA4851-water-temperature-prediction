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
  const [removeMiddleNode, setRemoveMiddleNode] = useState(false);
  const [predictedWaterTemps, setPredictedWaterTemps] = useState([]);
  const [predictedAirTemps, setPredictedAirTemps] = useState([]);

  const getTempMessage = () => {
    if (!predictionsLoaded) return "";
    const avgTemp =
      predictedWaterTemps.reduce((sum, temp) => sum + temp) /
      predictedWaterTemps.length;

    setTimeout(() => setShowGraph(true), 4000);
    setTimeout(() => setRemoveMiddleNode(true), 5500);

    if (avgTemp < 10) {
      return "Det vil være ganske kaldt i vannet... 🥶";
    } else if (avgTemp < 17) {
      return "Det blir helt OK vanntemperatur... 👍";
    } else {
      return "Fremover er det veldig varmt, løp ut og bad... 🥵";
    }
  };

  return (
    <div className="App">
      <Fade top>
        <h1
          style={{
            justifySelf: "flex-start",
            margin: "3rem auto 2rem auto",
            maxWidth: "80%",
          }}
        >
          BadHer BETA
        </h1>
      </Fade>
      <div className="predGraph">
        {predictionsLoaded ? (
          <>
            {!removeMiddleNode && (
              <Fade right when={!showGraph} appear={true} opposite={true}>
                <div className={"absolute"}>
                  <p
                    style={{
                      fontSize: "2.5rem",
                      fontWeight: "bold",
                      margin: "auto 2rem",
                    }}
                  >
                    {getTempMessage()}
                  </p>
                  <p
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                      cursor: "pointer",
                      margin: "auto 2rem",
                    }}
                    onClick={() => setShowGraph(true)}
                  >
                    ⬅{" "}
                    <span
                      style={{
                        textDecoration: "underline",
                      }}
                    >
                      Se temperatur for de neste 72 timene
                    </span>
                  </p>
                </div>
              </Fade>
            )}
            <Fade right when={showGraph} appear={true}>
              <Graph air={predictedAirTemps} water={predictedWaterTemps} />
            </Fade>
          </>
        ) : (
          <>
            <br />
            <br />
            <Fade left when={!loading} appear={true}>
              <h2>
                Hvordan er badetemperaturen i Korsvika de neste 72 timene?
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
      <Fade bottom>
        <div
          style={{
            justifySelf: "flex-end",
            margin: "auto auto 2.5rem auto",
            maxWidth: "80%",
          }}
        >
          <p style={{ fontFamily: "Playfair Display", fontWeight: 200 }}>
            Made for the Experts in Teamwork course TMA4851 at NTNU in spring
            2021
          </p>
          <p
            style={{
              fontFamily: "Playfair Display",
              fontWeight: 100,
              fontSize: "0.75rem",
            }}
          >
            <a href={"https://github.com/AndersHoel"}>Anders Hoel</a>,{" "}
            <a href={"https://github.com/henrilia"}>Henrik Lia</a>,{" "}
            <a href={"https://github.com/hersle"}>Hermann Sletmoen</a>,{" "}
            <a href={"https://github.com/hersle"}>Kaja Sofie Lundgaard</a>,{" "}
            <a href={"https://github.com/Magssch"}>Magnus Eide Schjølberg</a>,{" "}
            <a href={"https://github.com/Nora139"}>Nora Høve Erevik</a>,{" "}
          </p>
        </div>
      </Fade>
    </div>
  );
}

export default App;

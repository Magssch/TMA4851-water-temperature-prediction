import { Line } from "react-chartjs-2";
import "./App.css";

const Graph = ({ weather, water }) => {
  const labels = [];
  for (var i = 0; i < weather[0].length; i++) {
    labels[i] = i + "h";
  }
  console.log(weather);
  const airTemp = weather[0].map((row) => row[0]);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Badetemperatur",
        data: [water],
        backgroundColor: "rgb(255, 160, 122)",
        borderColor: "rgb(255, 160, 122)",
        fill: false,
      },
      {
        label: "Lufttemperatur",
        data: airTemp,
        backgroundColor: "rgb(176, 196, 222)",
        borderColor: "rgb(176, 196, 222)",
        fill: false,
      },
    ],
  };

  return (
    <div className="graph">
      <Line data={data} />
    </div>
  );
};

export default Graph;

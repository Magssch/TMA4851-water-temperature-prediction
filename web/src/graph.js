import { Line } from "react-chartjs-2";
import "./App.css";

const Graph = ({ air, water }) => {
  const labels = [];
  for (var i = 0; i < water.length; i++) {
    labels[i] = i + "h";
  }

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Badetemperatur",
        data: water.map(num => num.toFixed(2)),
        backgroundColor: "rgb(255, 160, 122)",
        borderColor: "rgb(255, 160, 122)",
        fill: false,
      },
      {
        label: "Lufttemperatur",
        data: air.map(num => num.toFixed(2)),
        backgroundColor: "rgb(176, 196, 222)",
        borderColor: "rgb(176, 196, 222)",
        fill: false,
      },
    ],
  };

  return (
    <div className="graph">
      <Line
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: false,
        }}
      />
    </div>
  );
};

export default Graph;

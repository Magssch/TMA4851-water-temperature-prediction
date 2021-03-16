import {Line} from 'react-chartjs-2';
import './App.css';


const water = [13.8, 12.7, 12.6, 15.3, 13.4, 13.3];
const weather = [15.6, 13.9, 13.2, 16.4, 14.5, 14.1];
var labels = []
for (var i =0; i<water.length; i++){
    labels[i] =i+'h';
}
console.log(labels)


function Graph (){

    var data = {
        labels: labels,
        datasets:[{
            label: 'Badetemperatur',
            data: water,
            backgroundColor: 'rgb(255, 160, 122)',
            borderColor: 'rgb(255, 160, 122)',
            fill: false,
        },{
            label: 'Lufttemperatur',
            data: weather,
            backgroundColor: 'rgb(176, 196, 222)',
            borderColor: 'rgb(176, 196, 222)',
            fill: false,
        }
    ]} 

    return (
        <div className="graph">
        <Line
            data={data}
        />
    </div>
    );
};

export default Graph;
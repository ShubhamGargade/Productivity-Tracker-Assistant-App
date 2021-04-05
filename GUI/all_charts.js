
var current_theme = settings.getSync("current_theme");
var gridColor = "#fafafa";
if(current_theme=="dark"){
  gridColor = "#455a64"
}
else{
  gridColor = "#eeeeee"
}

class AllCharts {

  constructor(ctx, chartLabel, datasetLabels,bgColor, data, graphType="bar"){

    this.ctx = ctx;
    this.chartLabel = chartLabel;
    this.datasetLabels = datasetLabels;
    this.datasets =  [{
        label: this.chartLabel,
        backgroundColor: bgColor,
        borderColor: 'transparent', //'rgb(255, 99, 132)',
        // barPercentage: 0.5,
        // barThickness: 6,
        // maxBarThickness: 8,
        // minBarLength: 8,
        data: data
    }];
    this.setChart(graphType, data);
  }

  destroyChart(){
    try {
      this.stackedLine.destroy();
      console.log("Destryoed")
    } catch (e) {
      console.log(e);
    }
  }

  setChart(graphType, data, options={}){

    this.destroyChart();
    this.options = {};
    if (graphType == "bar")
    {
      this.options = {
        scales: {
          xAxes: [{
            display: true,
            gridLines: {
              // display: false,
              color: gridColor,
            },
            scaleLabel: {
              // display: true,
              // labelString: 'Month',
            }
          }],
          yAxes: [{
            display: true,
            gridLines: {
              // display: false,
              color: gridColor,
            },
            scaleLabel: {
              // display: true,
              // labelString: 'Value'
            },
            ticks: {
                beginAtZero: true
            }
          }]
        }
      }
      // console.log('inside to show from 0');
    }
    else {
      this.options = {

      }
    }


    this.datasets[0].data = data;
    console.log(data)
    this.stackedLine = new Chart(this.ctx, {
      type: graphType,
      data: {
        labels: this.datasetLabels,
        datasets: this.datasets,
      },
      // options: options
      options: $.extend(this.options, options)
    });
  }
}


module.exports = { AllCharts };

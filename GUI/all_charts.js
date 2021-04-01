
class AllCharts {

  constructor(ctx, chartLabel, datasetLabels,bgColor, data, graphType="bar"){

    this.ctx = ctx;
    this.chartLabel = chartLabel;
    this.datasetLabels = datasetLabels;
    this.datasets =  [{
        label: this.chartLabel,
        backgroundColor: bgColor,
        borderColor: 'rgb(255, 99, 132)',
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

    if (graphType == "bar")
    {
      this.options = {
        scales: {
          yAxes: [{
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
      options: this.options
    });
  }
}


module.exports = { AllCharts };

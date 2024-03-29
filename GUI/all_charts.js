
const Chart = require('chart.js')

class AllCharts {

  constructor(ctx, chartLabel, datasetLabels, datasets, graphType){

    this.ctx = ctx;
    this.chartLabel = chartLabel;
    this.datasetLabels = datasetLabels;
    this.data =  [{
        label: this.chartLabel,
        backgroundColor: ['#27ae60', '#27ae60', '#27ae60', '#27ae60', '#27ae60', '#27ae60', '#27ae60'],
        pointBackgroundColor: 'purple',
        pointRadius: 5,
        borderColor: 'transparent', //'rgb(255, 99, 132)',
        // barPercentage: 0.5,
        // barThickness: 6,
        // maxBarThickness: 8,
        // minBarLength: 8,
        datasets: datasets
    }];

    this.config = {};

    this.setChart(graphType, datasets);
  }

  destroyChart(){
    try {
      this.chart.destroy();
      console.log("Destryoed")
    } catch (e) {
      console.log(e);
    }
  }

  initOptions(){

    this.options = {
      scales: {
        x: {
            min: 0,
            max: 100,
            display: true,
            grid: {
            // display: false,
            color: gridColor,
          },
          scaleLabel: {
            // display: true,
            // labelString: 'Month',
          },
          ticks: {
            minRotation: 45,
            color: textColor,
            font: {
              size: textSize
            }
          }
        },
        y: {
          min: 0,
          max: 100,
          display: true,
          grid: {
            // display: false,
            color: gridColor,
          },
          scaleLabel: {
            // display: true,
            // labelString: 'Value'
          },
          ticks: {
            beginAtZero: true,
            color: textColor,
            font: {
              size: textSize
            }
          }
        },
      },

      interaction: {
        mode: 'nearest',
        intersect: false
      },

      plugins: {
        legend: {
          // display: true,
          labels: {
            color: textColor,
            font: {
              size: textSize
            }
          }
        },
        
        title: {
          // display: false,
          // text: 'Custom Chart Title',
          color: textColor,
          font: {
            size: textSize
          }
        },
      },
    }

  }

  setChartOptions(graphType){

    if (graphType == "bar")
    {
      
      this.options.scales.x.display = true;
      this.options.scales.y.display = true;

    }
    else if(graphType == "line"){
      this.options.showLine = true;
      // this.options.scales.x.grid.display = false;
      // this.options.scales.y.grid.display = false;
    }
    else if(graphType == "pie" || graphType== "doughnut"){
      this.options.scales.x.display = false;
      this.options.scales.y.display = false;
    }
  }

  setCustomOptions(customOpt){

    if(customOpt == null){
      return;
    }

    if(customOpt['displayLegend'] != null){
      this.options.plugins.legend.display = customOpt['displayLegend'];
    }

    if(customOpt['title'] != null){
      this.options.plugins.title.text = customOpt['title'];
      this.options.plugins.title.display = true;
    }
  }

  setConfig(chartInfoObj){

    var options = chartInfoObj.options;
    if (options==null) {
      options = {};
    }

    this.config = {
      type: chartInfoObj.graphType,
      data: {
        labels: this.datasetLabels,
        datasets: chartInfoObj.datasets,
      },
      options: $.extend(this.options, options)
    }
  }

  setChart(chartInfoObj){

    try{
      this.destroyChart();
    }catch(e){}

    try{
      this.initOptions();
      this.setChartOptions(chartInfoObj.graphType);
      this.setCustomOptions(chartInfoObj.customOpt)
      this.setConfig(chartInfoObj);

      this.chart = new Chart(this.ctx, this.config);

    }catch(e){
      console.log(e);
    }    
  }
}


module.exports = { AllCharts };

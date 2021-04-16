
const time_arith = require("./time_arith");
var timeArith = new time_arith.TimeArith();
all_charts = require("./all_charts");
var Chart = require('chart.js');
// const settings = require('electron-settings');
var currentUserId = settings.getSync('user.uid');

class showClassReport{
  constructor(webOrSoft){
    this.webOrSoft = webOrSoft;
    console.log("inside classreport");

    this.ctxP = document.getElementById('canvas-'+this.webOrSoft+'-Prod').getContext('2d');
    this.ctxUnP = document.getElementById('canvas-'+this.webOrSoft+'-Unprod').getContext('2d');

    this.htmlClassProdTable = document.getElementById(this.webOrSoft+'-class-p-table');
    this.htmlClassUnprodTable = document.getElementById(this.webOrSoft+'-class-up-table');

    this.labelForDashboardProd = ["Business", "Computers", "Health", "News", "Recreation", "Science", "Sports"];
    this.labelForDashboardUnprod = ["Arts", "Games", "Home", "Reference", "Shopping", "Society"];
    this.graphType = "bar";
    this.showClassBar = document.getElementById('show-'+this.webOrSoft+'-bar-graph');
    this.showClassPie = document.getElementById('show-'+this.webOrSoft+'-pie-chart');
    this.drawChartProd = new all_charts.AllCharts(this.ctxP, 'Productive Class', this.labelForDashboardProd, this.getDatasets(this.dataProd), this.graphType);
    this.drawChartUnprod = new all_charts.AllCharts(this.ctxUnP, 'Unproductive Class', this.labelForDashboardUnprod, this.getDatasets(this.dataUnprod), this.graphType);
    
    this.listenUserChoice();

    this.updateData();
    this.initTableData();
  }

  updateData(){

    this.totalWTT = settings.getSync('Dic.dataDic.'+currentUserId+'.twtt');
    this.totalSTT = settings.getSync('Dic.dataDic.'+currentUserId+'.tstt');
    console.log(this.totalWTT);
    console.log(this.totalSTT);

    this.getClassData();

    console.log("dataProd:", this.dataProd);
    console.log("dataUnprod:", this.dataUnprod);

    this.showReport();

  }

  listenUserChoice(){
    this.showClassBar.addEventListener('click', (e) => {
      this.graphType = "bar";
      this.showReport();
    });
    this.showClassPie.addEventListener('click', (e) => {
      this.graphType = "pie";
      this.showReport();
    });
  }


  getDatasets(data, label){

    var datasets = [];

    datasets = [
      {
        label: label,
        fill: '+1',
        data: data,
        backgroundColor: ["rgba(233, 30, 99, 0.5)","rgba(75, 192, 192, 0.5)","rgba(255, 99, 132, 0.5)",
                          "rgba(255, 159, 64, 0.5)", "rgba(255, 205, 86, 0.5)",
                          "rgb(54, 162, 235, 0.5)", "rgb(153, 102, 255, 0.5)"],
        borderColor: ["rgb(233, 30, 99)", "rgb(75, 192, 192)", "rgb(255, 99, 132)", 
                      "rgb(255, 159, 64)", "rgb(255, 205, 86)", 
                      "rgb(54, 162, 235)", "rgb(153, 102, 255)"],
        borderWidth: 1
      },
      
    ]

    return datasets;

  }

  getOptions(){
    var options = {
      indexAxis: 'y',
    };

    return options;
  }

  showReport(){

    var label = 'Productive Category %';
    this.drawChartProd.setChart({graphType: this.graphType, datasets: this.getDatasets(this.dataProd, label), options: this.getOptions()});

    label = 'Unroductive Category %';
    this.drawChartUnprod.setChart({graphType: this.graphType, datasets: this.getDatasets(this.dataUnprod, label), options: this.getOptions()});
  }


  getClassData(){

    this.dataProd = [];
    this.dataUnprod = [];

    var c;
    var prodClass = settings.getSync('setClassTime.dataClass.'+currentUserId+'.'+this.webOrSoft+'.Productive');
    console.log("prodClass Dict: ", prodClass);

    var totalTime = '0-h 0-m 1-s';

    if(this.webOrSoft=='w'){
      totalTime = timeArith.calTime(this.totalWTT);
    }
    else if(this.webOrSoft=='s'){
      totalTime = timeArith.calTime(this.totalSTT);
    }
    else{
      totalTime = timeArith.calTime(this.totalWTT)+timeArith.calTime(this.totalSTT);
    }

    for(c in prodClass){
      if(prodClass[c] != ""){
        console.log((timeArith.calTime(prodClass[c])/totalTime)*100);
        this.dataProd.push(((timeArith.calTime(prodClass[c])/totalTime)*100).toFixed(2));
        // this.dataProd.push(timeArith.calTime(prodClass[c]));
      }
      else{
        this.dataProd.push("");
      }
    }

    var UnprodClass = settings.getSync('setClassTime.dataClass.'+currentUserId+'.'+this.webOrSoft+'.Unproductive');
    console.log("UnprodClass Dict: ", UnprodClass);
    for(c in UnprodClass){
      if(UnprodClass[c] != ""){
        this.dataUnprod.push(((timeArith.calTime(UnprodClass[c])/totalTime)*100).toFixed(2));
        // this.dataUnprod.push(timeArith.calTime(UnprodClass[c]));
      }
      else{
        this.dataUnprod.push("");
      }
    }
  }

  initTableData(){

    var classLabel;

    var prodClass = settings.getSync('setClassTime.dataClass.'+currentUserId+'.'+this.webOrSoft+'.Productive');

    for(classLabel in prodClass){
      if(prodClass[classLabel] != ""){
        this.insertDataInTable('p', classLabel, prodClass[classLabel]);
      }
      else{
        this.insertDataInTable('p', classLabel, "0h 0m 0s");
      }
    }

    var unprodClass = settings.getSync('setClassTime.dataClass.'+currentUserId+'.'+this.webOrSoft+'.Unproductive');

    for(classLabel in unprodClass){
      if(unprodClass[classLabel] != ""){
        this.insertDataInTable('up', classLabel, unprodClass[classLabel]);
      }
      else{
        this.insertDataInTable('up', classLabel, "0h 0m 0s");
      }
    }
    
  }

  insertDataInTable(category, subCategory, timeSpent){

    var tableBodyProd = document.getElementById('tb-'+this.webOrSoft+'-p');
    var tableBodyUnprod = document.getElementById('tb-'+this.webOrSoft+'-up');

    // check if row alread exists or not
    if(document.getElementById(subCategory) == null){

      var row;
      if(category=='p'){
        row = tableBodyProd.insertRow(this.htmlClassProdTable.rows.length-1);
      }
      else{
        row = tableBodyUnprod.insertRow(this.htmlClassUnprodTable.rows.length-1);
      }

      row.setAttribute('id', subCategory);

      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);

      cell1.innerHTML = row.rowIndex;
      cell2.innerHTML = subCategory;
      cell3.innerHTML = timeArith.removeDashesFromTimeStr(timeSpent);

      cell1.style.fontWeight = 'bold';
    }
    else {
      document.getElementById(subCategory).cells[2].innerHTML = timeArith.removeDashesFromTimeStr(timeSpent);
    }
  }


  // Live Update
  updateTableData(category, subCategory){

    var timeSpent;

    if(category=='p'){
        timeSpent = settings.getSync('setClassTime.dataClass.'+currentUserId+'.'+this.webOrSoft+'.Productive.'+subCategory);
    }
    else{
        timeSpent = settings.getSync('setClassTime.dataClass.'+currentUserId+'.'+this.webOrSoft+'.Unproductive.'+subCategory);
    }

    this.insertDataInTable(category, subCategory, timeSpent);

  }

}
// var objReport = new showClassReport();
module.exports = { showClassReport }

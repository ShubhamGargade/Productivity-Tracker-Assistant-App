var firebase = require("firebase/app");

var Chart = require('chart.js');
const settings = require('electron-settings');

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/database");
var database = firebase.database();

const time_arith = require("./time_arith");
var timeArith = new time_arith.TimeArith();

// var tWebSoftProdtt;
var totalTimeWS;
var currentUserId = settings.getSync('user.uid');

console.log('Outside',currentUserId);
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log("Signed in");
    // console.log(user.uid);
    settings.setSync('user.uid', user.uid);

    var currentUserId = user.uid;
    console.log('Inside auth',currentUserId);
  }
});


class insertIndividualWebSoftReport{
  constructor(webOrSoft){
    this.webOrSoft = webOrSoft;

    this.htmlWSReportTable = document.getElementById(this.webOrSoft+"-report-table");
    this.animatePB = false;

    if(sessionStorage.tracking=="on" || sessionStorage.tracking=="starting"){
      this.animatePB = true;
    }

    console.log("This Is-------", this.webOrSoft);
    this.getwebSoftDic = settings.getSync('Dic.dataDic.'+currentUserId);
    console.log("Pura dic", this.getwebSoftDic);
    // tWebSoftProdtt = this.getwebSoftDic['t'+this.webOrSoft+'pt'];
    // totalTimeWS = this.getwebSoftDic['t'+this.webOrSoft+'tt'];
    // console.log("old tw or stt", tWebSoftProdtt);
    console.log("old ttt", totalTimeWS);
    // if(this.getwebSoftDic == null){
    //   settings.setSync('Dic',{
    //     dataDic: {'w':{},
    //               's':{}}
    //   })
    // }
    console.log(settings.getSync('Dic.dataDic.'+currentUserId));

    // this.webSoftDic = this.getwebSoftDic[this.webOrSoft];

    console.log('successful saved webSoftDic', this.webSoftDic);

    this.updateRecentSessionData();
  }

  updateProgressBars(){
    if(sessionStorage.tracking=="on" || sessionStorage.tracking=="starting"){
      this.animatePB = true;
    }
    else{
      this.animatePB = false;
    }

    this.webSoftDic = settings.getSync('Dic.dataDic.'+currentUserId)['i'+this.webOrSoft];
    var olddata;

    for(olddata in this.webSoftDic)
    {

      this.showPB(this.webSoftDic[olddata], olddata);
    }
  }

  togglePBAnimation(toggleValue){

    // var pbAnimated = document.getElementsByClassName("progress-bar-animated")[0]
    // if(pbAnimated==null){
    //   $(".progress-bar").addClass("progress-bar-animated");
    //   $(".progress-bar").addClass("progress-bar-striped");
    // }
    // else{
    //   $(".progress-bar").removeClass("progress-bar-animated");
    //   $(".progress-bar").removeClass("progress-bar-striped");
    // }

    if(toggleValue=='true'){
      $(".progress-bar").addClass("progress-bar-animated");
      $(".progress-bar").addClass("progress-bar-striped");
    }
    else{
      $(".progress-bar").removeClass("progress-bar-animated");
      $(".progress-bar").removeClass("progress-bar-striped");
    }
  }

  showPB(timeTrac, webSoftProd){

    totalTimeWS = settings.getSync('Dic.dataDic.'+currentUserId)['t'+this.webOrSoft+'tt'];

    console.log("timeTrac:", timeTrac);
    console.log("websSoftProd:", webSoftProd);
    this.currwebsoftttPB = timeArith.calTime(timeTrac);
    this.twebsoftttPB = timeArith.calTime(totalTimeWS);
    console.log("currwebsoftttPB", this.currwebsoftttPB);
    console.log("twebsoftttPB", this.twebsoftttPB);
    this.prodPerPB = ((this.currwebsoftttPB/this.twebsoftttPB)*100).toString();

    console.log('website: ',webSoftProd);
    console.log("Individual Website Progress:",this.prodPerPB);
    // this.pBar = document.createElement("PROGRESS");
    // this.pBar.setAttribute("value", this.prodPerPB);
    // this.pBar.setAttribute("max", "100");

    var progressBarColor = "info";
    var pbStripedAnimation = "";

    if(this.animatePB){
      pbStripedAnimation = "progress-bar-striped progress-bar-animated";
    }

    this.incH = document.getElementById(webSoftProd).cells[3].innerHTML = `
      <div class='progress'>
        <div class='progress-bar ${pbStripedAnimation} bg-${progressBarColor}' role='progressbar' style='width: ${this.prodPerPB}%; background-color: #ff6f00 !important' aria-valuenow='${this.prodPerPB}' aria-valuemin='0' aria-valuemax='100'>${Number(this.prodPerPB).toFixed(2)}%</div>
      </div>`;

    // this.incH.style.height = '30px';
  }

  updateTotalTimes() {

    var t_ws_tt = settings.getSync('Dic.dataDic.'+currentUserId+'.t'+this.webOrSoft+'tt');
    var t_ws_pt = settings.getSync('Dic.dataDic.'+currentUserId+'.t'+this.webOrSoft+'pt');
    var t_ws_upt = timeArith.subTime(t_ws_tt, t_ws_pt);

    var t_ws_tt_in_sec = timeArith.calTime(t_ws_tt);
    if(t_ws_tt_in_sec==0){
      t_ws_tt_in_sec = 1;
    }
    var prodPercent = ((timeArith.calTime(t_ws_pt)/t_ws_tt_in_sec)*100).toFixed(2).toString();

    document.getElementById('show-t'+this.webOrSoft+'tt-'+this.webOrSoft+'report').innerHTML = timeArith.removeDashesFromTimeStr(t_ws_tt);
    document.getElementById('show-t'+this.webOrSoft+'pt-'+this.webOrSoft+'report').innerHTML = timeArith.removeDashesFromTimeStr(t_ws_pt);
    document.getElementById('show-t'+this.webOrSoft+'upt-'+this.webOrSoft+'report').innerHTML = timeArith.removeDashesFromTimeStr(t_ws_upt);
    document.getElementById('show-prod-percent').innerHTML = prodPercent+" %";

  }

  updateRecentSessionData(){

      this.updateTotalTimes();

      var olddata;
      this.webSoftDic = settings.getSync('Dic.dataDic.'+currentUserId)['i'+this.webOrSoft];
      for(olddata in this.webSoftDic)
      {
        this.updateData(olddata);
      }
  }

  updateData(olddata){

    this.webSoftDic = settings.getSync('Dic.dataDic.'+currentUserId)['i'+this.webOrSoft];

    // console.log("Testing oldata: ", olddata);
    var idForRow = olddata;
    // console.log(idForRow);
    // console.log(this.webSoftDic[this.olddata][0]);
    // console.log(this.webSoftDic[this.olddata][1]);
    this.insertDataInTable(idForRow, olddata, this.webSoftDic[olddata]);

  }

  insertDataInTable(webSoftProd, webSoftNameClass, timeTrac){
    console.log('creating Table');
    console.log(webSoftProd);
    var table = document.getElementById('tb'+this.webOrSoft);

    // check if row alread exists or not
    if(document.getElementById(webSoftProd) == null){

      var row = table.insertRow(this.htmlWSReportTable.rows.length-1);
      row.setAttribute('id', webSoftProd);
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      var cell4 = row.insertCell(3);
      cell1.innerHTML = row.rowIndex;
      cell2.innerHTML = webSoftNameClass;
      cell3.innerHTML = timeArith.removeDashesFromTimeStr(timeTrac);
      cell4.innerHTML = '';
      this.showPB(timeTrac, webSoftProd);
  //     // document.getElementById(webSoftProd).style.backgroundColor = '#f5f6fa';
  //     cell1.style.fontWeight = 'bold';
  //
  //     if(categoryVal == 'Productive'){
  //       console.log(document.getElementById(webSoftProd).cells[2]);
  //       // document.getElementById(webSoftProd).style.backgroundColor = '#c8e6c9';
  //       cell3.innerHTML = `${categoryVal}<span class='material-icons' style='display:block;float:left;font-size:20px;width:12%;color:#28a745;'>check_circle</span>`
  //       // document.getElementById(webSoftProd).cells[2].style.backgroundColor = '#28a745';
  //     }
  //     else{
  //       console.log(document.getElementById(webSoftProd).cells[2]);
  //       // document.getElementById(webSoftProd).style.backgroundColor = '#ffcdd2';
  //
  //       cell3.innerHTML = `${categoryVal}<span class='material-icons' style='display:block;float:left;font-size:20px;width:12%;color:#dc3545'>remove_circle</span>`
  //
  //       // document.getElementById(webSoftProd).cells[2].style.backgroundColor = '#dc3545';
  //
  //     }
  //   }
  //   else {
  //     document.getElementById(webSoftProd).cells[4].innerHTML = timeArith.removeDashesFromTimeStr(timeTrac);
  //   }
  // }

}
  else {
    document.getElementById(webSoftProd).cells[2].innerHTML = timeArith.removeDashesFromTimeStr(timeTrac);
  }
}
}

// var obj = new showDataToWebSoftReport();
module.exports = { insertIndividualWebSoftReport }

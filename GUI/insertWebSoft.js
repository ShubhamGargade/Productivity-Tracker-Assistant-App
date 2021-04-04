var firebase = require("firebase/app");

var Chart = require('chart.js');
const settings = require('electron-settings');

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/database");
var database = firebase.database();
// var tWebSoftProdtt;
var totalTimeWS;
var currentUserId = settings.getSync('key1.data');

console.log('Outside',currentUserId);
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log("Signed in");
    // console.log(user.uid);
    settings.setSync('key1', {
      data: user.uid
    });

    var currentUserId = user.uid;
    console.log('Inside auth',currentUserId);
  }
});


class insertWebSoftReport{
  constructor(webOrSoft){
    this.webOrSoft = webOrSoft;
    console.log("This Is-------", this.webOrSoft);
    this.getwebSoftDic = settings.getSync('Dic.dataDic');
    console.log("Pura dic", this.getwebSoftDic);
    // tWebSoftProdtt = this.getwebSoftDic['t'+this.webOrSoft+'pt'];
    totalTimeWS = this.getwebSoftDic['t'+this.webOrSoft+'tt'];
    // console.log("old tw or stt", tWebSoftProdtt);
    console.log("old ttt", totalTimeWS);
    // if(this.getwebSoftDic == null){
    //   settings.setSync('Dic',{
    //     dataDic: {'w':{},
    //               's':{}}
    //   })
    // }
    console.log(settings.getSync('Dic.dataDic'));

    this.webSoftDic = this.getwebSoftDic[this.webOrSoft];

    console.log('successful saved webSoftDic', this.webSoftDic);
    document.getElementById('show-t'+this.webOrSoft+'tt-'+this.webOrSoft+'report').innerHTML = settings.getSync('Dic.dataDic.t'+this.webOrSoft+'tt')
    document.getElementById('show-t'+this.webOrSoft+'pt-'+this.webOrSoft+'report').innerHTML = settings.getSync('Dic.dataDic.t'+this.webOrSoft+'pt')
    this.updateRecentSessionData();
  }

  updateRecentProgressBar(webSoftDic){
    for(this.olddata in webSoftDic)
    {
      this.nC = this.olddata.split(',');
      var idForRow = this.nC[0]+'-*-'+this.nC[1];
      // console.log(idForRow);
      // console.log(webSoftDic[this.olddata][0]);
      // console.log(webSoftDic[this.olddata][1]);
      // document.getElementById(idForRow).cells[3].remove();
      this.showPB(webSoftDic[this.olddata][0], idForRow, webSoftDic[this.olddata][1]);
    }
  }



   calTime(tempT){
     try {
     var sPTH=0, sPTM=0, sPTS=0;
     tempT = tempT.split(" ");
     sPTH = tempT[0].split("-");
     sPTH = parseInt(sPTH[0])*3600;
     sPTM = tempT[1].split("-");
     sPTM = parseInt(sPTM[0])*60;
     sPTS = tempT[2].split("-");
     sPTS = parseInt(sPTS[0]);
     tempT = sPTH + sPTM + sPTS;
     return tempT;

      } catch (e) {
         console.log('calTime error',e);
      } finally {

      }
   }


  showPB(timeTrac, webSoftProd, categoryVal){
    console.log("Inside showPB...................")
    console.log("timeTrac:", timeTrac);
    console.log("websSoftProd:", webSoftProd);
    this.currwebsoftttPB = this.calTime(timeTrac);
    this.twebsoftttPB = this.calTime(totalTimeWS);
    console.log("currwebsoftttPB", this.currwebsoftttPB);
    console.log("twebsoftttPB", this.twebsoftttPB);
    console.log("categoryVal", categoryVal);
    this.prodPerPB = ((this.currwebsoftttPB/this.twebsoftttPB)*100).toString();

    console.log('website: ',webSoftProd);
    console.log("Individual Website Progress:",this.prodPerPB);
    // this.pBar = document.createElement("PROGRESS");
    // this.pBar.setAttribute("value", this.prodPerPB);
    // this.pBar.setAttribute("max", "100");
    if(categoryVal=="Productive"){
      this.incH = document.getElementById(webSoftProd).cells[4].innerHTML = `
      <div class='progress'>
        <div class='progress-bar progress-bar-striped progress-bar-animated bg-success' role='progressbar' style='width: ${this.prodPerPB}%' aria-valuenow='${this.prodPerPB}' aria-valuemin='0' aria-valuemax='100'></div>
      </div>`;
    }
    else{
      this.incH = document.getElementById(webSoftProd).cells[4].innerHTML = `
      <div class='progress'>
        <div class='progress-bar progress-bar-striped progress-bar-animated bg-danger' role='progressbar' style='width: ${this.prodPerPB}%' aria-valuenow='${this.prodPerPB}' aria-valuemin='0' aria-valuemax='100'></div>
      </div>`;
    }

    // this.incH.style.height = '30px';
  }

  updateRecentSessionData(){
      var olddata;
      for(olddata in this.webSoftDic)
      {
        // console.log("Testing oldata: ", olddata);
        var nC = olddata.split(',');
        console.log(this.nC);
        var idForRow = nC[0]+'-*-'+nC[1];
        // console.log(idForRow);
        // console.log(this.webSoftDic[this.olddata][0]);
        // console.log(this.webSoftDic[this.olddata][1]);
        this.insertDataInTable(idForRow, nC, this.webSoftDic[olddata][0], this.webSoftDic[olddata][1]);
      }
  }

  insertDataInTable(webSoftProd, webSoftNameClass, timeTrac, categoryVal){
    console.log('creating Table');
    console.log(webSoftProd);
    var table = document.getElementById('tb'+this.webOrSoft);
    var row = table.insertRow(0);
    row.setAttribute('id', webSoftProd);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    cell1.innerHTML = webSoftNameClass[0];
    cell2.innerHTML = webSoftNameClass[1];
    cell3.innerHTML = categoryVal;
    cell4.innerHTML = timeTrac;
    cell5.innerHTML = ' ';
    this.showPB(timeTrac, webSoftProd, categoryVal);
    document.getElementById(webSoftProd).style.backgroundColor = '#f5f6fa';
    if(categoryVal == 'Productive'){
      console.log(document.getElementById(webSoftProd).cells[2]);
      document.getElementById(webSoftProd).cells[2].style.backgroundColor = '#4cd137';
    }
    else{
      console.log(document.getElementById(webSoftProd).cells[2]);
      document.getElementById(webSoftProd).cells[2].style.backgroundColor = '#e84118';
    }
  }

}


// var obj = new showDataToWebSoftReport();
module.exports = { insertWebSoftReport }

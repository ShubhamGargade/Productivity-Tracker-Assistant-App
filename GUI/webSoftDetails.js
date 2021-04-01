var firebase = require("firebase/app");

var Chart = require('chart.js');
const settings = require('electron-settings');

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/database");
var database = firebase.database();
var tWebSoftProdtt;
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

class showDataToWebSoftReport{
  constructor(webOrSoft){
    this.webOrSoft = webOrSoft;
    console.log("This Is-------", this.webOrSoft);
    this.getwebSoftDic = settings.getSync('Dic.dataDic');
    if(webOrSoft == 'w'){
      this.webSoftDic = this.getwebSoftDic[this.webOrSoft];
    }
    else{
      this.webSoftDic = this.getwebSoftDic[this.webOrSoft];
    }
    this.getClassDic = settings.getSync('setClassTime.data1');
    this.classProdDic = this.getClassDic["Productive"];
    this.classUnProdDic = this.getClassDic["UnProductive"];
    console.log(this.classProdDic);
    console.log(this.classUnProdDic);

    console.log('successful saved webSoftDic', this.webSoftDic);
    this.updateRecentSessionData(this.webSoftDic);
    this.listenActivities();
  }

  calTime(tempT){
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
  }


  showPB(timeTrac, webSoftProd, categoryVal){
    this.currwebsoftttPB = this.calTime(timeTrac);
    this.twebsoftttPB = this.calTime(tWebSoftProdtt);
    if(categoryVal == "Productive"){
      this.prodPerPB = ((this.currwebsoftttPB/this.twebsoftttPB)*100).toString();
    }
    else{
      this.twupttPB = this.calTime(totalTimeWS) - this.twebsoftttPB;
      this.prodPerPB = ((this.currwebsoftttPB/this.twupttPB)*100).toString();
    }
    console.log(this.prodPerPB);
    console.log("Individual Website Progress:",this.prodPerPB);
    this.pBar = document.createElement("PROGRESS");
    this.pBar.setAttribute("value", this.prodPerPB);
    this.pBar.setAttribute("max", "100");
    this.incH = document.getElementById(webSoftProd).cells[4].appendChild(this.pBar);
    this.incH.style.height = '30px';
  }

  updateRecentSessionData(webSoftDic){
      for(this.olddata in webSoftDic)
      {
        this.nC = this.olddata.split(',');
        var idForRow = this.nC[0]+'-*-'+this.nC[1];
        // console.log(idForRow);
        // console.log(webSoftDic[this.olddata][0]);
        // console.log(webSoftDic[this.olddata][1]);
        tWebSoftProdtt = webSoftDic[this.olddata][0];
        this.insertDataInTable(idForRow, this.nC, webSoftDic[this.olddata][0], webSoftDic[this.olddata][1]);
      }
  }

  insertDataInTable(webSoftProd, webSoftNameClass, timeTrac, categoryVal){
    console.log('creating Table');
    console.log(webSoftProd);
    var table = document.getElementById('tb');
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


  listenActivities(){
    var calUsertwstt = firebase.database().ref(this.webOrSoft+'a/'+ currentUserId + '/t'+this.webOrSoft+'tt');
    calUsertwstt.on('value', (snapshot) => {
      const datatwstt = snapshot.val();
      // console.log(data);
      if(datatwstt != null)
      {
        totalTimeWS = datatwstt;
        console.log(datatwstt.toString());
        // this.sentDataToHtml("show-t"+this.webOrSoft+"tt-webreport", datatwstt);
        document.getElementById("show-t"+this.webOrSoft+"tt-"+this.webOrSoft+"report").innerHTML = datatwstt;


      }
    });

    var calUserwsPT = firebase.database().ref(this.webOrSoft+'a/'+ currentUserId + '/p/t'+this.webOrSoft+'pt');
    calUserwsPT.on('value', (snapshot) => {
    if(snapshot.val() != null)
    {
      var wsPT = snapshot.val();
      tWebSoftProdtt = wsPT;
      console.log(wsPT);
      // this.sentDataToHtml("show-t"+this.webOrSoft+"pt-webreport", wsPT);
      document.getElementById("show-t"+this.webOrSoft+"pt-"+this.webOrSoft+"report").innerHTML = wsPT;
    }
    });

    //For adding productive data in table

    var calNewUserDataProd = firebase.database().ref('newD/'+ currentUserId + '/'+this.webOrSoft+'/p');
    calNewUserDataProd.on('value', (snapshot1) => {
    if(snapshot1.val() != null)
    {
      var webSoftProd = snapshot1.val();
      var webSoftProdNameClass = webSoftProd.split('-*-');
      console.log('Yeee Founded', this.webSoftDic);
      console.log("COMMON_DICT: ", this.getwebSoftDic);
      if(this.webSoftDic[webSoftProdNameClass] != null){
          // console.log('inside try');
          database.ref().child(this.webOrSoft+'a/').child(currentUserId).child('p').child(webSoftProdNameClass[1]).child(webSoftProdNameClass[0]).get().then((snapshot2) => {
            if (snapshot2.exists()) {
              database.ref().child(this.webOrSoft+'a/').child(currentUserId).child('p').child(webSoftProdNameClass[1]).child('tct').get().then((snap) => {            //Updating Class Dict
                if (snap.exists()) {
                  this.classProdDic[webSoftProdNameClass[1]] = snap.val();
                }
                else{
                  console.log("Classtime not found");
                }
              });
              console.log('Inside if prod',snapshot2.val()['tmt']);
              console.log(this.webSoftDic);
              this.webSoftDic[webSoftProdNameClass] = [snapshot2.val()['tmt'],'Productive'];
              document.getElementById(webSoftProd).cells[3].innerHTML = snapshot2.val()['tmt'];
              console.log('UPDATED WEB PROD TIME');
          }
            else {
              console.log("No data available");

            }
          }).catch(function(error) {
            console.log(error);
          });
        }
      else{
        database.ref().child(this.webOrSoft+'a/').child(currentUserId).child('p').child(webSoftProdNameClass[1]).child(webSoftProdNameClass[0]).get().then((snapshot2) => {
          if (snapshot2.exists()) {
            database.ref().child(this.webOrSoft+'a/').child(currentUserId).child('p').child(webSoftProdNameClass[1]).child('tct').get().then((snap) => {            //Updating Class Dict
              if (snap.exists()) {
                this.classProdDic[webSoftProdNameClass[1]] = snap.val();
              }
              else{
                console.log("Classtime not found");
              }
            });
            this.webSoftDic[webSoftProdNameClass] = [snapshot2.val()['tmt'],'Productive'];
            console.log('Found out data:',snapshot2.val()['tmt']);
            console.log(this.webSoftDic);
            this.insertDataInTable(webSoftProd, webSoftProdNameClass, snapshot2.val()['tmt'], 'Productive');
        }
          else {
            console.log("No data available");
          }
        }).catch(function(error) {
          console.log(error);

        });
      }
    }
    });


    //For adding Unproductive data in table
    var calNewUserDataUnProd = firebase.database().ref('newD/'+ currentUserId + '/'+this.webOrSoft+'/up');
    calNewUserDataUnProd.on('value', (snapshot3) => {
    if(snapshot3.val() != null)
    {
      var webSoftUnProd = snapshot3.val();
      var webSoftUnProdNameClass = webSoftUnProd.split('-*-');
      if(this.webSoftDic[webSoftUnProdNameClass] != null){
          database.ref().child(this.webOrSoft+'a/').child(currentUserId).child('up').child(webSoftUnProdNameClass[1]).child(webSoftUnProdNameClass[0]).get().then((snapshot4) => {
            if (snapshot4.exists()) {
              // console.log('Found out data:',snapshot4.val()['tmt']);
              database.ref().child(this.webOrSoft+'a/').child(currentUserId).child('up').child(webSoftUnProdNameClass[1]).child('tct').get().then((snap) => {            //Updating Class Dict
                if (snap.exists()) {
                  this.classUnProdDic[webSoftUnProdNameClass[1]] = snap.val();
                }
                else{
                  console.log("Classtime not found");
                }
            });
              document.getElementById(webSoftUnProd).cells[3].innerHTML = snapshot4.val()['tmt'];
              console.log('UPDATED WEB UNPROD TIME');
              console.log(this.webSoftDic);
              this.webSoftDic[webSoftUnProdNameClass] = [snapshot4.val()['tmt'],'UnProductive'];
          }
            else {
              console.log("No data available");
            }
          }).catch(function(error) {
            console.error(error);
          });
        }
      else{
        // console.log(this.arrayOFDataKey);
        database.ref().child(this.webOrSoft+'a/').child(currentUserId).child('up').child(webSoftUnProdNameClass[1]).child(webSoftUnProdNameClass[0]).get().then((snapshot4) => {
          if (snapshot4.exists()) {
            // console.log('Found out data:',snapshot4.val()['tmt']);
            database.ref().child(this.webOrSoft+'a/').child(currentUserId).child('up').child(webSoftUnProdNameClass[1]).child('tct').get().then((snap) => {            //Updating Class Dict
              if (snap.exists()) {
                this.classUnProdDic[webSoftUnProdNameClass[1]] = snap.val();
              }
              else{
                console.log("Classtime not found");
              }
            });
            snapshot4.val()['tmt'];

            this.webSoftDic[webSoftUnProdNameClass] = [snapshot4.val()['tmt'],'UnProductive'];
            this.insertDataInTable(webSoftUnProd, webSoftUnProdNameClass, snapshot4.val()['tmt'], 'UnProductive');
            console.log(this.webSoftDic);
        }
        else {
            console.log("No data available");
          }
        }).catch(function(error) {
          console.error(error);
        });
      }
    }
    });

    try {
      const { ipcRenderer } = require('electron');
      ipcRenderer.on('asynchronous-message', (event, args) => {
          console.log('Saving webSoftDict');
          this.getwebSoftDic[this.webOrSoft] = this.webSoftDict;
          settings.setSync('Dic', {
            dataDic: this.getwebSoftDic
          });
          this.getClassDic["Productive"] = this.classProdDic;
          this.getClassDic["UnProductive"] = this.classUnProdDic;
        });

    } catch (e) {
      console.log(e);
    }

  }

}
// var obj = new showDataToWebSoftReport();
module.exports = { showDataToWebSoftReport }

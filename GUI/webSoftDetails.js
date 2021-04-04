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

class showDataToWebSoftReport{
  constructor(webOrSoft){
    this.webOrSoft = webOrSoft;
    console.log("This Is-------", this.webOrSoft);
    // this.getwebSoftDic = settings.getSync('Dic.dataDic');
    // console.log("Pura dic", this.getwebSoftDic);
    // tWebSoftProdtt = this.getwebSoftDic['t'+this.webOrSoft+'pt'];
    // totalTimeWS = this.getwebSoftDic['t'+this.webOrSoft+'tt'];
    // console.log("old tw or stt", tWebSoftProdtt);
    console.log("old ttt", totalTimeWS);
    console.log(settings.getSync('Dic.dataDic'));
    this.getClassDic = settings.getSync('setClassTime.data1');
    this.classProdDic = this.getClassDic["Productive"];
    this.classUnProdDic = this.getClassDic["UnProductive"];
    console.log(this.classProdDic);
    console.log(this.classUnProdDic);

    console.log('successful saved webSoftDic', this.webSoftDic);
    // this.updateRecentSessionData();
    this.listenActivities();
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

  listenActivities(){
    console.log("Inside Listen.....................");
    var calUsertwstt = firebase.database().ref(this.webOrSoft+'a/'+ currentUserId + '/t'+this.webOrSoft+'tt');
    calUsertwstt.on('value', (snapshot) => {
      const datatwstt = snapshot.val();
      // console.log(data);

      if(datatwstt != null)
      {
        totalTimeWS = datatwstt;
        settings.setSync('Dic.dataDic.t'+this.webOrSoft+'tt', totalTimeWS)

        console.log(datatwstt.toString());

      }
    });

    var calUserwsPT = firebase.database().ref(this.webOrSoft+'a/'+ currentUserId + '/p/t'+this.webOrSoft+'pt');
    calUserwsPT.on('value', (snapshot) => {
    if(snapshot.val() != null)
    {

      var wsPT = snapshot.val();
      // tWebSoftProdtt = wsPT;
      settings.setSync('Dic.dataDic.t'+this.webOrSoft+'pt', wsPT)

      console.log(wsPT);
    }
    });

    //For adding productive data in table

    var calNewUserDataProd = firebase.database().ref('newD/'+ currentUserId + '/'+this.webOrSoft+'/p');
    calNewUserDataProd.on('value', (snapshot1) => {
    if(snapshot1.val() != null)
    {
      var webSoftProd = snapshot1.val();
      var webSoftProdNameClass = webSoftProd.split('-*-');
      console.log('Yeee Founded-'+this.webOrSoft, this.webSoftDic);
      console.log("COMMON_DICT: ", this.getwebSoftDic);
      console.log("Update Productive Data--"+this.webOrSoft,settings.getSync('Dic.dataDic'));
      // if(this.webSoftDic[webSoftProdNameClass] != null){
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
              console.log("Set ke pehele dict: ", this.getwebSoftDic);                                                                                            //storing data in local
              settings.setSync('Dic.dataDic.'+this.webOrSoft+'.'+webSoftProdNameClass, [snapshot2.val()['tmt'],'Productive']);
              console.log("Set ke after dict: ", this.getwebSoftDic);
              console.log('UPDATED WEB PROD TIME');
          }
          else {
              console.log("No data available");

          }
          }).catch(function(error) {
            console.log(error);
          });
    }
    });


    //For adding Unproductive data in table
    var calNewUserDataUnProd = firebase.database().ref('newD/'+ currentUserId + '/'+this.webOrSoft+'/up');
    calNewUserDataUnProd.on('value', (snapshot3) => {
    // if(snapshot3.val() != null)
    // {
      console.log("Update UnProductive Data",settings.getSync('Dic.dataDic'));
      var webSoftUnProd = snapshot3.val();
      var webSoftUnProdNameClass = webSoftUnProd.split('-*-');
      // if(this.webSoftDic[webSoftUnProdNameClass] != null){
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
              // document.getElementById(webSoftUnProd).cells[3].innerHTML = snapshot4.val()['tmt'];
              console.log('UPDATED WEB UNPROD TIME');
              console.log(this.webSoftDic);
              console.log("Set ke pehele dict: ", this.getwebSoftDic);                                                                                            //storing data in local
              settings.setSync('Dic.dataDic.'+this.webOrSoft+'.'+webSoftUnProdNameClass, [snapshot4.val()['tmt'],'UnProductive']);
          }
            else {
              console.log("No data available");
            }
          }).catch(function(error) {
            console.error(error);
          });
    });

  }

}
// var obj = new showDataToWebSoftReport();

module.exports = { showDataToWebSoftReport }

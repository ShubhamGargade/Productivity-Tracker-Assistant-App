// var firebase = require("firebase/app");

var Chart = require('chart.js');
// const settings = require('electron-settings');

// Add the Firebase products that you want to use
// require("firebase/auth");
// require("firebase/database");
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
    console.log(settings.getSync('Dic.dataDic.'+currentUserId));
    // this.getClassDic = settings.getSync('setClassTime.data1');
    // this.classProdDic = this.getClassDic["Productive"];
    // this.classUnProdDic = this.getClassDic["UnProductive"];
    console.log(this.classProdDic);
    console.log(this.classUnProdDic);

    console.log('successful saved webSoftDic', this.webSoftDic);
    // this.updateRecentSessionData();
    this.listenActivities();
  }

  calTWSCT(valT, valC){
   if(valT != null){
    var twsct = valT.split(" ");
    var wsct = valC.split(" ");

    var tH = twsct[0].split("-");
    var tM = twsct[1].split("-");
    var tS = twsct[2].split("-");

    var cH = wsct[0].split("-");
    var cM = wsct[1].split("-");
    var cS = wsct[2].split("-");

    var fH = parseInt(tH[0])+parseInt(cH[0]);
    var fM = parseInt(tM[0])+parseInt(cM[0]);
    var fS = parseInt(tS[0])+parseInt(cS[0]);

    if(fS >= 60){
      fS = fS % 60;
      fM += 1
    }

    if(fM >= 60){
      fM = fM % 60;
      fH += 1
    }

    return ((fH)+'-h '+(fM)+'-m '+(fS)+'-s ')
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
        settings.setSync('Dic.dataDic.'+currentUserId+'.t'+this.webOrSoft+'tt', totalTimeWS)

        console.log(datatwstt.toString());

      }
    });

    var calUserwsPT = firebase.database().ref(this.webOrSoft+'a/'+ currentUserId + '/p/t'+this.webOrSoft+'pt');
    calUserwsPT.on('value', (snapshot) => {
    if(snapshot.val() != null)
    {

      var wsPT = snapshot.val();
      // tWebSoftProdtt = wsPT;
      settings.setSync('Dic.dataDic.'+currentUserId+'.t'+this.webOrSoft+'pt', wsPT)

      console.log(wsPT);
    }
    });

    //For adding productive data in table

    var calNewUserDataProd = firebase.database().ref('newD/'+ currentUserId + '/'+this.webOrSoft+'/p');
    calNewUserDataProd.on('value', (snapshot1) => {
    if(snapshot1.val() != null)
    {
      var webSoftProd = snapshot1.val();
      var webSoftProdNameClass = webSoftProd["key"].split('-*-');

      // if(this.webSoftDic[webSoftProdNameClass] != null){
          // console.log('inside try');
          database.ref().child(this.webOrSoft+'a/').child(currentUserId).child('p').child(webSoftProdNameClass[1]).child(webSoftProdNameClass[0]).get().then((snapshot2) => {
            if (snapshot2.exists()) {
              database.ref().child(this.webOrSoft+'a/').child(currentUserId).child('p').child(webSoftProdNameClass[1]).child('tct').get().then((snap) => {            //Updating Class Dict
                if (snap.exists()) {
                  settings.setSync('setClassTime.dataClass.'+currentUserId+'.'+this.webOrSoft+'.Productive.'+webSoftProdNameClass[1], snap.val());

                  var tempClassTime;
                  if(this.webOrSoft == 'w'){
                    tempClassTime = settings.getSync('setClassTime.dataClass.'+currentUserId+'.s'+'.Productive.'+webSoftProdNameClass[1]);
                    console.log(settings.getSync('setClassTime.dataClass.'+currentUserId+'.s'+'.Productive.'+webSoftProdNameClass[1]));
                  }
                  else if(this.webOrSoft == 's'){
                    tempClassTime = settings.getSync('setClassTime.dataClass.'+currentUserId+'.w'+'.Productive.'+webSoftProdNameClass[1]);
                    console.log(settings.getSync('setClassTime.dataClass.'+currentUserId+'.w'+'.Productive.'+webSoftProdNameClass[1]));
                  }
                  if(tempClassTime == null){
                    tempClassTime = '0-h 0-m 0-s';
                  }
                  console.log("TEMP PROD CLASS TIME", tempClassTime);                                                                                                  //For Total Class
                  tempClassTime = this.calTWSCT(tempClassTime, snap.val());
                  settings.setSync('setClassTime.dataClass.'+currentUserId+'.t'+'.Productive.'+webSoftProdNameClass[1], tempClassTime);
                  console.log('------------------------------------Prod CLass Dict updated-----------------------------------------');
                  console.log( settings.getSync('setClassTime.dataClass'));
                }
                else{
                  console.log("Classtime not found");
                }
              });
              console.log('Inside if prod',snapshot2.val()['tmt']);
                                                                                                       //storing data in local
              settings.setSync('Dic.dataDic.'+currentUserId+'.'+this.webOrSoft+'.'+webSoftProdNameClass, [snapshot2.val()['tmt'],'Productive']);

              console.log('----------------------------------------UPDATED WEB SOFT PROD TIME---------------------------------------------------------');
              console.log(settings.getSync('Dic.dataDic.'+currentUserId+'.'+this.webOrSoft));

              // change the value in local storage which will be listened in other file
              // by adding listener to changes in local storage
              localStorage.setItem(currentUserId+this.webOrSoft+"newDataChanged", webSoftProd["key"]+"-*-"+webSoftProd["t"+this.webOrSoft+"pt"]);
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
    if(snapshot3.val() != null)
    {
      // console.log("Update UnProductive Data",settings.getSync('Dic.dataDic.'+currentUserId));
      var webSoftUnProd = snapshot3.val();
      var webSoftUnProdNameClass = webSoftUnProd["key"].split('-*-');
      // if(this.webSoftDic[webSoftUnProdNameClass] != null){
          database.ref().child(this.webOrSoft+'a/').child(currentUserId).child('up').child(webSoftUnProdNameClass[1]).child(webSoftUnProdNameClass[0]).get().then((snapshot4) => {
            if (snapshot4.exists()) {
              // console.log('Found out data:',snapshot4.val()['tmt']);
              database.ref().child(this.webOrSoft+'a/').child(currentUserId).child('up').child(webSoftUnProdNameClass[1]).child('tct').get().then((snap) => {            //Updating Class Dict
                if (snap.exists()) {
                  settings.setSync('setClassTime.dataClass.'+currentUserId+'.'+this.webOrSoft+'.UnProductive.'+webSoftUnProdNameClass[1], snap.val());

                  var tempClassTime;
                  if(this.webOrSoft == 'w'){
                    tempClassTime = settings.getSync('setClassTime.dataClass.'+currentUserId+'.s'+'.UnProductive.'+webSoftUnProdNameClass[1]);                             //For Total Class
                  }
                  else if (this.webOrSoft == 's') {
                    tempClassTime = settings.getSync('setClassTime.dataClass.'+currentUserId+'.w'+'.UnProductive.'+webSoftUnProdNameClass[1]);
                  }
                  if(tempClassTime == null){
                    tempClassTime = '0-h 0-m 0-s';
                  }
                  console.log("TEMP UNPROD CLASS TIME", tempClassTime);
                  tempClassTime = this.calTWSCT(tempClassTime, snap.val());
                  settings.setSync('setClassTime.dataClass.'+currentUserId+'.t'+'.UnProductive.'+webSoftUnProdNameClass[1], tempClassTime);

                  console.log('------------------------------------Unprod CLass Dict updated-----------------------------------------');
                  console.log( settings.getSync('setClassTime.dataClass'));
                }
                else{
                  console.log("Classtime not found");
                }
            });
              // document.getElementById(webSoftUnProd).cells[3].innerHTML = snapshot4.val()['tmt'];
                                                                                     //storing data in local
              settings.setSync('Dic.dataDic.'+currentUserId+'.'+this.webOrSoft+'.'+webSoftUnProdNameClass, [snapshot4.val()['tmt'],'UnProductive']);
              console.log('----------------------------------------UPDATED WEB SOFT UNPROD TIME---------------------------------------------------------');
              console.log(settings.getSync('Dic.dataDic.'+currentUserId+'.'+this.webOrSoft));

              // change the value in local storage which will be listened in other file
              // by adding listener to changes in local storage
              localStorage.setItem(currentUserId+this.webOrSoft+"newDataChanged", webSoftUnProd["key"]+"-*-"+webSoftUnProd["t"+this.webOrSoft+"pt"]);
          }
            else {
              console.log("No data available");
            }
          }).catch(function(error) {
            console.error(error);
          });
        }
    });
    console.log('-----------------------------------------------------------DICT AFTER UPDATION-----------------------------------------------------------------');
    console.log("Update Productive Data--"+this.webOrSoft,settings.getSync('Dic.dataDic'));
  }

}
// var obj = new showDataToWebSoftReport();

module.exports = { showDataToWebSoftReport }

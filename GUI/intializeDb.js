var firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/database");
const firebaseConfig = {
  apiKey: "AIzaSyACGUDZccPyev4MarszVJdx34FXf702_Ls",
  authDomain: "productivitytrackerassistant.firebaseapp.com",
  databaseURL: "https://productivitytrackerassistant-default-rtdb.firebaseio.com",
  projectId: "productivitytrackerassistant",
  storageBucket: "productivitytrackerassistant.appspot.com",
  messagingSenderId: "1045872340135",
  appId: "1:1045872340135:web:06aaaea092166624f6bf82",
  measurementId: "G-THF78Y1GLX"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// // firebase.analytics();

// var database = firebase.database();
// function writeUserData(uid, fname, lname, email) {
//   firebase.database().ref('wa/123/Computers/cmd').set({
//     fn: fname,
//     ln: lname,
//     email: email,
//     isDBCleared: "t"
//   });
// }
// writeUserData(123, "shubham", "gargade", "g@gmail.com");
uid="123";

function calTime(tempT){
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

function updateTime(tempT, count){
  return {
        tempT: calTime(tempT),
        count: count+1,
    };
}

function calPercentage(sPT, wPT, tTT, count){
  if (count==3){
    // console.log(((sPT+wPT)/tTT)*100);
    var calPT = (((sPT+wPT)/tTT)*100).toFixed(2);
    if(calPT != 'NaN'){
        return calPT.toString() + '%';
    }
    else {
      return "0%";
    }
  }
  return null;
}

function calProdPercent(){
  var  sPT=0, wPT=0, tTT=0;
  var count = 0;
  var calUsersPT = firebase.database().ref('sa/123/p/tspt');
  calUsersPT.on('value', (snapshot) => {
  if(snapshot.val() != null)
  {
    sPT = snapshot.val();
    var values = updateTime(sPT, count);
    sPT = values.tempT;
    count = values.count;
    var prodPer = calPercentage(sPT, wPT, tTT, count);
    setProdPercentInHTML(prodPer);
  }
  });
  var calUserwPT = firebase.database().ref('wa/123/p/twpt');
  calUserwPT.on('value', (snapshot) => {
  if(snapshot.val() != null)
  {

    wPT = snapshot.val();
    var values = updateTime(wPT, count);
    wPT = values.tempT;
    count = values.count;

    var prodPer = calPercentage(sPT, wPT, tTT, count);
    setProdPercentInHTML(prodPer);
  }
  });
  var calUsertTT = firebase.database().ref('users/123/ttt');
  calUsertTT.on('value', (snapshot) => {
  if(snapshot.val() != null)
  {

    tTT = snapshot.val();  // "0-h 0-m 0-s"
    var values = updateTime(tTT, count);
    tTT = values.tempT;
    count = values.count;

    var prodPer = calPercentage(sPT, wPT, tTT, count);
    setProdPercentInHTML(prodPer);
  }
});

}

function setProdPercentInHTML(val){
  console.log(val);
  if(val != null){
    document.getElementById("show-prod-percent").innerHTML = val;
  }
}

//ttt
var calUserttt = firebase.database().ref('users/123/ttt');
calUserttt.on('value', (snapshot) => {
  const datattt = snapshot.val();
  // console.log(data);
  if(datattt != null)
  {
    console.log(datattt.toString());
    document.getElementById("show-ttt-dashboard").innerHTML = datattt;
    calProdPercent();
  }

});


var calUsertwtt = firebase.database().ref('wa/123/twtt');
calUsertwtt.on('value', (snapshot) => {
  const datatwtt = snapshot.val();
  // console.log(data);
  if(datatwtt != null)
  {
    console.log(datatwtt.toString());
    document.getElementById("show-twtt-dashboard").innerHTML = datatwtt;

  }

});

var calUsertstt = firebase.database().ref('sa/123/tstt');
calUsertstt.on('value', (snapshot) => {
  const datatstt = snapshot.val();
  // console.log(data);
  if(datatstt != null)
  {
    console.log(datatstt.toString());
    document.getElementById("show-tstt-dashboard").innerHTML = datatstt;

  }

});

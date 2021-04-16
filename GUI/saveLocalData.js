

initial_time = '0-h 0-m 0-s'

class SaveLocalData {
  constructor(uid){
    this.uid = uid;
    this.initLocalData();
  }

  initLocalData(){
    this.initLtd();
    this.updateLtd();
  }

  initLocalDict(){
    settings.setSync('Dic.dataDic.'+this.uid,{
      w:{},
      s:{},
      iw:{},
      is:{},
      twpt:initial_time,
      twtt:initial_time,
      tspt:initial_time,
      tstt:initial_time
    })

    //To save class timing
    settings.setSync('setClassTime.dataClass.'+this.uid, {
      w:{Productive:{Business: initial_time, Computers:initial_time, Health:initial_time, News:initial_time, Recreation:initial_time, Science:initial_time, Sports:initial_time},
      Unproductive:{Arts:initial_time, Games:initial_time, Home:initial_time, Reference:initial_time, Shopping:initial_time, Society:initial_time}},
      s:{Productive:{Business:initial_time, Computers:initial_time, Health:initial_time, News:initial_time, Recreation:initial_time, Science:initial_time, Sports:initial_time},
      Unproductive:{Arts:initial_time, Games:initial_time, Home:initial_time, Reference:initial_time, Shopping:initial_time, Society:initial_time}},
      t:{Productive:{Business:initial_time, Computers:initial_time, Health:initial_time, News:initial_time, Recreation:initial_time, Science:initial_time, Sports:initial_time},
      Unproductive:{Arts:initial_time, Games:initial_time, Home:initial_time, Reference:initial_time, Shopping:initial_time, Society:initial_time}}
     });
  }

  initLtd(){
    console.log(this.uid+'-------------------------------------');
    var ltd = settings.getSync('lastTrackingDate.dataLtd.'+this.uid);
    console.log("LTD: ",ltd);
    if(ltd == null){
      console.log("---------------------------------LAST TRACKING DATE------------------------------------")

      this.initLocalDict();

      console.log('-----------------------------------------SET NEW DICT AS LTD IS NULL--------------------------------------------------');
      console.log(settings.getSync('Dic.dataDic'));
      console.log(settings.getSync('setClassTime.dataClass'));
    }

  }

  updateLtd(){
    console.log('---------------------------Tracking Started-------------------------------------------');
    var ltd = settings.getSync('lastTrackingDate.dataLtd.'+this.uid);
    var cD = new Date().getDate().toString();
    var cM = (parseInt(new Date().getMonth())+1).toString();
    var cY = new Date().getFullYear().toString().substr(2,2);
    console.log('current month', cM);
    if(cM.length == 1){
      cM = "0"+cM;
    }
    var currentTrackingDate = cD+'-'+cM+'-'+cY;

    console.log('current date: ', currentTrackingDate);
    if(currentTrackingDate != ltd){
      settings.setSync('lastTrackingDate.dataLtd.'+this.uid, currentTrackingDate);
      console.log("Update LTD", settings.getSync('lastTrackingDate.dataLtd.'+this.uid));

      this.initLocalDict();

    console.log('--------------------------------------------------------NEW DATE TRACKING STARTED-----------------------------------------------------------');
    }
  }

}

module.exports = { SaveLocalData };

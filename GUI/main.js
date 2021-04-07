// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')
const settings = require('electron-settings');

var firebase = require("firebase/app");
var isSignInTrue;
var currentTrackingDate;
// Add the Firebase products that you want to use
require("firebase/auth");
// require("firebase/firestore");


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
// firebase.analytics();
global.firebase = firebase; //to access the firebase instance from the renderer process

//To save class timing
settings.setSync('setClassTime', {
  data1: {"Productive":{"Business":"", "Computers":"", "Health":"", "News":"", "Recreation":"", "Science":"", "Sports":""},
          "Unproductive":{"Arts":"", "Games":"", "Home":"", "Reference":"", "Shopping":"", "Society":""}}
});

var isMainWindowClosed = false;

function createWindow () {
  // Create the browser window.

  const mainWindow = new BrowserWindow({
    width: 1800,
    height: 1600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      enableRemoteModule: true,
      nativeWindowOpen: true,
      // worldSafeExecuteJavaScript: true,
      // contextIsolation: true
    }
  })

  mainWindow.webContents
  .executeJavaScript(
    `localStorage.setItem('theme_bg_light1', 'white');
     localStorage.setItem('theme_bg_dark1', '#2c2c54');
     localStorage.setItem('theme_bg_dark2', '#004747');
     localStorage.setItem('theme_color_light', '#343a40');
     localStorage.setItem('theme_color_dark', 'white');
     localStorage.setItem('card_body_bg_light1', '94, 94, 94, .4');
     localStorage.setItem('card_body_bg_dark1', '87, 85, 129, .4');
     localStorage.setItem('card_body_bg_dark2', '56, 115, 114, .4');
    `
    , true)
  .then(result => {
    console.log(result);
  });

  var ltd = settings.getSync('lastTrackingDate.dataLtd');
  if(ltd == null){
    settings.setSync('Dic',{
      dataDic: {'w':{},
      's':{},
      'twpt': null,
      'twtt': null,
      'tspt': null,
      'tstt': null}
    })
    //To save class timing
    settings.setSync('setClassTime', {
      dataClass: {"Productive":{"Business":"", "Computers":"", "Health":"", "News":"", "Recreation":"", "Science":"", "Sports":""},
              "UnProductive":{"Arts":"", "Games":"", "Home":"", "Reference":"", "Shopping":"", "Society":""}}
    });

    console.log('LTD:', ltd);
  }

  try {
        var value = settings.getSync('key.data');
        console.log('Persisted Value - ' + value);
        isSignInTrue = value;
        console.log("Inside try: "+isSignInTrue);
        if(isSignInTrue == 'Yes') {
            // User is signed in.
            mainWindow.loadFile("homeAfterLogin.html");
        }
        else {
             // No user is signed in.
            mainWindow.loadFile('index.html');
         }

    console.log("This is value: "+isSignInTrue);


  } catch (e) {
    console.log(e);
    console.log("Inside catch: "+isSignInTrue);
    mainWindow.loadFile('index.html');

  }

  // create hidden worker window
  const workerWindow = new BrowserWindow({
    // show: false,
    
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      enableRemoteModule: true,
      nativeWindowOpen: true,
      // worldSafeExecuteJavaScript: true,
      // contextIsolation: true
    }
  });
  workerWindow.loadFile('worker.html');

  // In main process.
  const { ipcMain } = require('electron');
  var userRefreshToken = null;

  ipcMain.on('async-start-tracking-message', (event, arg) => {
    console.log(arg);
    const result = startTracking();

    console.log(result);
    return result;
  });

  ipcMain.on('async-stop-tracking-message', (event, arg) => {
    console.log('ipcmain:',arg);
    const result = stopTracking();
    return result;
  });

  ipcMain.handle('async-set-user-refresh-token', async (event, arg) => {
    userRefreshToken = arg;  // gets refreshToken if user signed in else get null for signed out
    setPyshellOptions();
    return "refreshed";
  });


  var python_process;
  var {PythonShell} = require('python-shell');
  var pyshell = null;
  var options = {
      pythonOptions: ['-u'], // get print results in real-time
      scriptPath: '../Engine/',
      args: [userRefreshToken]
    }

  console.log(options);

  function setPyshellOptions(){
    options.args = [userRefreshToken];
    console.log(options);
  }

  function startTracking(){

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
      settings.setSync('Dic',{
        dataDic: {'w':{},
        's':{},
        'twpt':'',
        'twtt':'',
        'tspt':'',
        'tstt':''}
      })
      settings.setSync('lastTrackingDate', {
        dataLtd: currentTrackingDate
      })
      //To save class timing
      settings.setSync('setClassTime', {
        dataClass: {"Productive":{"Business":"", "Computers":"", "Health":"", "News":"", "Recreation":"", "Science":"", "Sports":""},
                "UnProductive":{"Arts":"", "Games":"", "Home":"", "Reference":"", "Shopping":"", "Society":""}}
      });

    }

    if(userRefreshToken==null){
      console.log("RefreshToken is null");
      return;
    }

    pyshell = new PythonShell('main.py',  options);

    python_process = pyshell;

      // sends a message to the Python script via stdin
      pyshell.send("RUN");

      pyshell.on('message', function(message) {
        // received a message sent from the Python script (a simple "print" statement)

        if(message == "STARTED"){
            mainWindow.webContents.send('tracking', true);
        }
        console.log("FromBAckend: ",message);
        if(message=="KILL" || message=="EXCEPTION"){
          // end the input stream and allow the process to exit
          pyshell.end(function (err,code,signal) {
            if (err) throw err;
            console.log('The exit code was: ' + code);
            console.log('The exit signal was: ' + signal);
            console.log('finished');

            try{
              mainWindow.webContents.send('tracking', false);
            }catch(e){
              // console.log(e);
            }

            if(isMainWindowClosed){
              try{
                workerWindow.close();
              }
              catch(e){
                // console.log(e);
              }
            }

          });
        }
        else{
          try{
            pyshell.send('RUN');
          }
          catch(e){
            console.log(e.message);
          }
        }
      });
  }


  function stopTracking(){
    console.log("Stopping")
    try {
        pyshell.send('KILL');
      }
      catch(e){
        console.log(e.message);
        try{
          mainWindow.webContents.send('tracking', false);
        }catch(e){
          // console.log(e);
        }

        if(isMainWindowClosed){
          try{
            workerWindow.close();
          }
          catch(e){
            // console.log(e);
          }
        }
      }
  }

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    isMainWindowClosed = true;
    stopTracking();
  })

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
}
)


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {

  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

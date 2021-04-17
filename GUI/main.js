// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')
const settings = require('electron-settings');

var firebase = require("firebase/app");
var isSignInTrue;
// Add the Firebase products that you want to use
require("firebase/auth");

datesModule = require("./dates");
dates = new datesModule.Dates();

var currentTrackingDate;

var initial_time = "0-h 0-m 0-s"

var stopTrackingMsgSent = false;

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


function createHiddenWindow(){
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

  return workerWindow;
}


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
     localStorage.setItem('p_bar_bg_light1', '#e9ecef');
     localStorage.setItem('p_bar_bg_dark1', '#575581');
     localStorage.setItem('p_bar_bg_dark2', '#387372');
     localStorage.setItem('active_tab', 'home-link');
    `
    , true)
  .then(result => {
    console.log(result);
  });


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
  var workerWindow;
  
  //
  const { ipcMain } = require('electron');
  var userRefreshToken = null;

  ipcMain.on('async-start-tracking-message', (event, arg) => {
    console.log(arg);

    // start hidden worker window in background
    workerWindow = createHiddenWindow();
    workerWindow.loadFile('worker.html');

    const result = startTracking();

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

    stopTrackingMsgSent = false;

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
      console.log("FROM BACKEND:",message)
      if(message == "RUN"){
        
        //

      }
      else if(message == "STARTED"){
        try{
          mainWindow.webContents.send('tracking', true);
          workerWindow.webContents.send('tracking', true);  // Sent 2nd
        }catch(e){
          console.log(e);
          message = "KILL";
        }
      }
      else if(message == "DB-INITS"){
        try {
          workerWindow.webContents.send('DB-INITS', true)  // Sent 1st
        }catch(e){
          console.log(e);
          message = "KILL";
        }
      }
        
      if(message=="KILL" || message=="EXCEPTION"){
        // end the input stream and allow the process to exit

        try{
          pyshell.end(function (err,code,signal) {
            if (err) throw err;
            console.log('The exit code was: ' + code);
            console.log('The exit signal was: ' + signal);
            console.log('finished');

            try{
              mainWindow.webContents.send('tracking', false);
              workerWindow.webContents.send('tracking', false);
            }catch(e){
              console.log(e);
            }

            try{
              workerWindow.close();
            }
            catch(e){
              console.log(e);
            }

          });
        }catch(e){
          console.log(e);
        }
      }
      else{
        try{
          if(stopTrackingMsgSent==false){
            pyshell.send('RUN');            
          }
        }
        catch(e){
          console.log(e.message);
          message = "KILL";
        }
      }
    });
  }


  function stopTracking(){
    console.log("Stopping")
    try {
        stopTrackingMsgSent = true;
        pyshell.send('KILL');
      }
      catch(e){
        console.log(e.message);
        try{
          mainWindow.webContents.send('tracking', false);
          workerWindow.webContents.send('tracking', false);
        }catch(e){
          // console.log(e);
        }

        try{
          workerWindow.close();
        }
        catch(e){
          // console.log(e);
        }
      }
  }

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
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

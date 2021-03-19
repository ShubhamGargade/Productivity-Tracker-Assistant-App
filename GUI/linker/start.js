// var python_process;
// // let options = {
// //   mode: 'text',
// //   pythonPath: 'python3',
// //   pythonOptions: ['-u'], // get print results in real-time
// //   // scriptPath: 'E:/BEproject/Productivity-Tracker-Assistant-App/GUI',
// //   args: "null"
// // };
//
// var {PythonShell} = require('python-shell');
// var pyshell = null;
//
// function startTracking(){
//
//   //let path = require('path')
//     //
//     // PythonShell.run('../Engine/main.py',options, function (err, results) {
//     //   if (err) throw err;
//     //   // results is an array consisting of messages collected during execution
//     //   console.log('results: %j', results);
//     //   });
//
//     // sessionStorage.setItem('start.jsScript', 'Tracking Started');
//     pyshell = new PythonShell('../Engine/main.py');
//     python_process = pyshell;
//
//     // sends a message to the Python script via stdin
//     pyshell.send('RUN');
//
//     pyshell.on('message', function (message) {
//       // received a message sent from the Python script (a simple "print" statement)
//       console.log("FromBAckend: ",message);
//       if(message == "KILL"){
//
//         // sessionStorage.setItem('start.jsScript', null );
//         // end the input stream and allow the process to exit
//         pyshell.end(function (err,code,signal) {
//           if (err) throw err;
//           console.log('The exit code was: ' + code);
//           console.log('The exit signal was: ' + signal);
//           console.log('finished');
//         });
//       }
//       else{
//         pyshell.send('RUN');
//       }
//     });
//
//       // sleep(1000);
//       // console.log('results: %j', results);
//       // document.getElementById("toPrint1").innerText=results;
//     // });
//     // i += 1
//   // }
// }
// // let shell = new PythonShell('../Engine/main.py', options);
// var lisensT = document.getElementById("sT");
// if(lisensT != null){
//   lisensT.addEventListener("click", (e) => {
//     try {
//       pyshell.send('KILL');
//     }
//     catch(e){
//       console.log(e.message);
//       console.log("Please disable stop tracking button Shubham");
//     }
//   });
//
//   }
//
// // function stopTracking(){
// //   let pyshell = new PythonShell('../Engine/main.py');
// //   // console.log(pyshell.pid);
// //
// //   pyshell.kill()
// //
// // }

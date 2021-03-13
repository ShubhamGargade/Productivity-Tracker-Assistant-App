var python_process;
// let options = {
//   mode: 'text',
//   pythonPath: 'python3',
//   pythonOptions: ['-u'], // get print results in real-time
//   // scriptPath: 'E:/BEproject/Productivity-Tracker-Assistant-App/GUI',
//   args: "null"
// };

function startTracking(){

  //let path = require('path')
    //
    // PythonShell.run('../Engine/main.py',options, function (err, results) {
    //   if (err) throw err;
    //   // results is an array consisting of messages collected during execution
    //   console.log('results: %j', results);
    //   });

    let {PythonShell} = require('python-shell');

      var pyshell = new PythonShell('../Engine/main.py');

      python_process = pyshell;
      pyshell.end(function (err) {
        if (err) {
            console.log(err);
        }
      });
      // sleep(1000);
      // console.log('results: %j', results);
      // document.getElementById("toPrint1").innerText=results;
    // });
    // i += 1
  // }
}
// let shell = new PythonShell('../Engine/main.py', options);
var lisensT = document.getElementById("sT");
if(lisensT != null){
  lisensT.addEventListener("click", (e) => {
    console.log("Listening to stop");
    console.log(python_process.kill('SIGTERM'));
    })

  }

// function stopTracking(){
//   let pyshell = new PythonShell('../Engine/main.py');
//   // console.log(pyshell.pid);
//
//   pyshell.kill()
//
// }

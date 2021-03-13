function startTracking1(){
  let {PythonShell} = require('python-shell');
  //let path = require('path')
  let options = {
    mode: 'text',
    pythonPath: 'python3',
    pythonOptions: ['-u'], // get print results in real-time
    scriptPath: 'E:/BEproject/Productivity-Tracker-Assistant-App/GUI',
    args: "null"
  };
  var i = 0;
  // while(i<100)
  // {
    PythonShell.run('../Engine/test1.py', options, function (err, results) {
      if (err) throw err;
      // results is an array consisting of messages collected during execution
      console.log('results: %j', results);
      // sleep(1000);

      // document.getElementById("toPrint2").innerText="";
      // document.getElementById("toPrint2").innerText=results;
    });
  //   i += 1
  // }
}

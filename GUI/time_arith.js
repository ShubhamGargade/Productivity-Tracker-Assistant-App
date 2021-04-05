

class TimeArith {

	getHrMinSec(time_str){
		let t = time_str.split(" ");
		let th = t[0].split('-')[0];
		let tm = t[1].split('-')[0];
		let ts = t[2].split('-')[0];

		return [th, tm, ts];
	}

	calTime(time_str){

		var hr_min_sec = this.getHrMinSec(time_str);

		var th, tm, ts;
		th = hr_min_sec[0];
		tm = hr_min_sec[1];
		ts = hr_min_sec[2];

		th = parseInt(th)*3600;
		tm = parseInt(tm)*60;
		ts = parseInt(ts);

		var tempT = th + tm + ts;

		return tempT;

	}

	removeDashesFromTimeStr(time_str){

		var hr_min_sec = this.getHrMinSec(time_str);

		var th, tm, ts;
		th = hr_min_sec[0];
		tm = hr_min_sec[1];
		ts = hr_min_sec[2];

		var res = th+"h "+tm+"m "+ts+"s";

		return res;
      
    }

    subTime(t1_str, t2_str){

    	var hr_min_sec = this.getHrMinSec(t1_str);

		var t1h, t1m, t1s;
		t1h = parseInt(hr_min_sec[0]);
		t1m = parseInt(hr_min_sec[1]);
		t1s = parseInt(hr_min_sec[2]);

		hr_min_sec = this.getHrMinSec(t2_str);

		var t2h, t2m, t2s;
		t2h = parseInt(hr_min_sec[0]);
		t2m = parseInt(hr_min_sec[1]);
		t2s = parseInt(hr_min_sec[2]);

		console.log("t1:", t1h, t1m, t1s)
		console.log("t2:", t2h, t2m, t2s)

		var secs = (t1s - t2s);
		var mins = (t1m - t2m + Math.floor(secs/60));
		var hrs = (t1h - t2h + Math.floor(mins/60));
		secs = ((secs%60)+60)%60;
		mins = ((mins%60)+60)%60;

		var time_sub = String(hrs) + "-h " + String(mins) + "-m " + String(secs) + "-s"

		return time_sub 

    }
}

module.exports = { TimeArith }

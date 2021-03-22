"""
DOCSTRINGS
"""


# Standard library imports
import calendar  # to generate unix time stamp from gmt
import time  # to get gmt time
from datetime import date, datetime
import os


# Third party imports
from . import db


# Local application imports
from ...Constants.keys import *
from .retrieve_data import *
from ...time_arithmetic import TimeArithmetic
from .user_info import UserInfo


user_info=UserInfo.getInstance()
uid = user_info.getUid()
email = user_info.getEmail()

retrieve_user_data = RetrieveUserData.getInstance()
retrieve_tracking_history = RetrieveTrackingHistory.getInstance()

time_arith = TimeArithmetic()
add_time = time_arith.add_time  # add_time method instance
sub_time = time_arith.sub_time  # sub_time method instance
initial_time = time_arith.initial_time

date_format = "%d-%m-%y"
url_title_separator = "-*-"

# A list of class into which websites are categorized
productive=[c for i,c in PRODUCTIVE_STR.items()]
unproductive=[c for i,c in UNPRODUCTIVE_STR.items()]


class SaveData:
	"""Singleton SaveData class"""

	__instance = None

	@staticmethod
	def getInstance():
		""" Static access method. """
		if SaveData.__instance == None:
			SaveData()
		return SaveData.__instance


	def __init__(self):  # firebase authenticated user fetched from frontend
		""" Virtually private costructor """
		
		if SaveData.__instance != None:
			raise Exception("SaveData is a Singleton Class!")
		else:
			SaveData.__instance = self

			self.activity = None


	def __get_timestamp(self): 
		time.sleep(1)
		# gmt stores current gmtime 
		gmt = time.gmtime() 

		# ts stores timestamp 
		ts = calendar.timegm(gmt) 

		return ts

			
	def set_isDBCleared(self, val):

		return db.child("users").child(uid).child("isDBCleared").set(val, user_info.getIdToken())


	def initDB(self):

		#1
		self.clear_db()

		# set last tracking date
		self.set_last_tracking_date()

		isDBCleared = retrieve_user_data.get_isDBCleared_val()

		if isDBCleared == "f":
			return "Database already initialized"


		# Initialize data in database - START #

		# to initialize all tracking times in db
		self.__init_tracking_times_in_db()

		# to initialize oldest tracking date in user tracking history("uth" node)
		self.__init_oldest_tracking_date()

		# Initialize data in database - END #

		isDBCleared = self.set_isDBCleared("f")

		self.remove_older_tracking_times_from_uth()


		return "Database initialized successfully"


	def set_last_tracking_date(self):  # set when user starts tracking

		current_date = date.today().strftime(date_format)

		try:
			db.child("users").child(uid).child("ltd").set(current_date, user_info.getIdToken())
		except Exception as e:
			print(e)

		os.environ["START_DATE"] = current_date


	def __init_tracking_times_in_db(self):

		# initialize total tracking time
		db.child("users").child(uid).child("ttt").set(initial_time, user_info.getIdToken())

		# initialize total software tracking time
		db.child("sa").child(uid).child("tstt").set(initial_time, user_info.getIdToken())

		# initialize total website tracking time
		db.child("wa").child(uid).child("twtt").set(initial_time, user_info.getIdToken())

		# initialize total software productive time
		db.child("sa").child(uid).child("p").child("tspt").set(initial_time, user_info.getIdToken())

		# initialize total software unproductive time
		db.child("sa").child(uid).child("up").child("tsupt").set(initial_time, user_info.getIdToken())

		# initialize total website productive time
		db.child("wa").child(uid).child("p").child("twpt").set(initial_time, user_info.getIdToken())

		# initialize total website unproductive time
		db.child("wa").child(uid).child("up").child("twupt").set(initial_time, user_info.getIdToken())

		# initialize total category time for all productive category
		for p_cat in productive:
			db.child("sa").child(uid).child("p").child(p_cat).child("tct").set(initial_time, user_info.getIdToken())
			db.child("wa").child(uid).child("p").child(p_cat).child("tct").set(initial_time, user_info.getIdToken())

		# initialize total category time for all unproductive category
		for up_cat in unproductive:
			db.child("sa").child(uid).child("up").child(up_cat).child("tct").set(initial_time, user_info.getIdToken())
			db.child("wa").child(uid).child("up").child(up_cat).child("tct").set(initial_time, user_info.getIdToken())

		self.__init_ind_day_tt_in_uth()
		self.__init_all_days_tt_in_uth()


	def __init_ind_day_tt_in_uth(self):

		current_date  = os.getenv("START_DATE")
		if current_date is None:
			current_date = date.today().strftime(date_format)

		db.child("uth").child(uid).child("id").child(current_date).child("ttt").set(initial_time, user_info.getIdToken())
		db.child("uth").child(uid).child("id").child(current_date).child("tpt").set(initial_time, user_info.getIdToken())
		db.child("uth").child(uid).child("id").child(current_date).child("tupt").set(initial_time, user_info.getIdToken())


	def __init_all_days_tt_in_uth(self):

		isAdsSaved = db.child("users").child(uid).child("uths").get(user_info.getIdToken()).val()

		if isAdsSaved is None or isAdsSaved == "0":

			db.child("uth").child(uid).child("ads").child("tpt").set(initial_time, user_info.getIdToken())
			db.child("uth").child(uid).child("ads").child("tupt").set(initial_time, user_info.getIdToken())
			db.child("uth").child(uid).child("ads").child("ttt").set(initial_time, user_info.getIdToken())
			db.child("users").child(uid).child("uths").set("1", user_info.getIdToken())


	def __init_oldest_tracking_date(self):
		# get oldest_tracking_date
		oldest_tracking_date = retrieve_tracking_history.get_oldest_tracking_date()

		if oldest_tracking_date is None:
			# initialize oldest tracking date in db

			current_date  = os.getenv("START_DATE")
			if current_date is None:
				current_date = date.today().strftime(date_format)

			db.child("uth").child(uid).child("otd").set(current_date, user_info.getIdToken())


	def set_activity(self, activity):
		self.activity = activity


	def save(self): # here activity represents the Activity object
		if self.activity.category == OTHERS_STR:
			return

		if self.activity.name == None:
			return

		self.store_data()


	def store_data(self):

		p_up_str = None
		web_sw_str = None

		if self.activity.isProductive:
			p_up_str = "p" 
		else:
			p_up_str = "up"
		
		# storing web or software data
		# here self.activity.key is hostname for website and app_name for software
		if self.activity.isBrowser:

			if self.store_web_data(p_up_str) == 0:
				return

			web_sw_str = "w"
			
		else:

			if self.store_sw_data(p_up_str) == 0:
				return

			web_sw_str = "s"

		# website_or_software_activities("wa" or "sa") string stored in db
		wa_sa_str = "{}a".format(web_sw_str)

		# get total mutual time
		try:
			tmt = db.child(wa_sa_str).child(uid).child(p_up_str).child(self.activity.category).child(self.activity.key).child("tmt").get(user_info.getIdToken()).val()
		except Exception as e:
			return

		if tmt == None:
			tmt = add_time(self.activity.time_spent, initial_time)
		else:
			tmt = add_time(self.activity.time_spent, tmt)
		
		# update total mutual time
		db.child(wa_sa_str).child(uid).child(p_up_str).child(self.activity.category).child(self.activity.key).update({"tmt": tmt}, user_info.getIdToken())

    	# get total category time
		tct = db.child(wa_sa_str).child(uid).child(p_up_str).child(self.activity.category).child("tct").get(user_info.getIdToken()).val()
		tct = add_time(self.activity.time_spent, tct)
		
		# update total category time
		db.child(wa_sa_str).child(uid).child(p_up_str).child(self.activity.category).update({"tct": tct}, user_info.getIdToken())

		# update rest of the tracking times
		self.update_tracking_times(web_sw_str, p_up_str, wa_sa_str)


	def store_web_data(self, p_up_str):
		if not self.activity.is_website_stored:
			url = self.activity.name.split(' - ')[0]

			# add url + title to db
			try:
				db.child("wa").child(uid).child(p_up_str).child(self.activity.category).child(self.activity.key).child("url+title").child(self.__get_timestamp()).set(url + url_title_separator + self.activity.title, user_info.getIdToken())
			except Exception as e:
				return 0
		return 1


	def store_sw_data(self, p_up_str):

		if not self.activity.is_software_stored:

			# add app_data to db
			try:
				db.child("sa").child(uid).child(p_up_str).child(self.activity.category).child(self.activity.key).child("data").set(self.activity.name, user_info.getIdToken())
			except Exception as e:
				return 0
		return 1


	def update_tracking_times(self, web_sw_str, p_up_str, wa_sa_str):

		
		# total app prod or unprod time str("twpt" or "twupt" or "tspt" or "tsupt"). here app can be website or software
		tot_app_p_up_time_str = "t{}{}t".format(web_sw_str, p_up_str)

		# total app tracking time. Here app can be website or a software
		tot_app_tracking_time_str = "t{}tt".format(web_sw_str)

		# total tracking time
		tot_tracking_time_str = "ttt"

		# raise Exception

		# get total web or sw p or up time
		tot_app_p_up_time = db.child(wa_sa_str).child(uid).child(p_up_str).child(tot_app_p_up_time_str).get(user_info.getIdToken()).val()

		# get total web or sw tracking time
		tot_app_tracking_time = db.child(wa_sa_str).child(uid).child(tot_app_tracking_time_str).get(user_info.getIdToken()).val()

		# get total tracking time
		tot_tracking_time = db.child("users").child(uid).child(tot_tracking_time_str).get(user_info.getIdToken()).val()

		db.update({
		    wa_sa_str+'/'+str(uid)+'/'+tot_app_tracking_time_str: add_time(self.activity.time_spent, tot_app_tracking_time)
		}, user_info.getIdToken())

		db.update({
		    wa_sa_str+'/'+str(uid)+'/'+p_up_str+'/'+tot_app_p_up_time_str: add_time(self.activity.time_spent, tot_app_p_up_time)
		}, user_info.getIdToken())

		db.update({
		    "users/"+str(uid)+'/'+tot_tracking_time_str: add_time(self.activity.time_spent, tot_tracking_time)
		}, user_info.getIdToken())

		self.update_individual_app_tracking_time(web_sw_str)


	def update_individual_app_tracking_time(self, web_sw_str):
		# individual website or software tracking time string
		i_w_s_tt_str = "i{}tt".format(web_sw_str)

		# individual website or software tracking time value
		ind_app_tracking_time = db.child(i_w_s_tt_str).child(uid).child(self.activity.key).get(user_info.getIdToken()).val()

		if ind_app_tracking_time is None:
			ind_app_tracking_time = initial_time


		# update individual app(website or software) tracking time
		db.update({
			i_w_s_tt_str+'/'+str(uid)+'/'+self.activity.key: add_time(self.activity.time_spent, ind_app_tracking_time)
		}, user_info.getIdToken())


	# update firebase db when user stops tracking
	def update_db_at_user_exit(self):

		#1 
		self.save_user_tracking_history()

		#2
		self.clear_db()


	def save_user_tracking_history(self):
		""" Save user tracking history after user stops tracking """

		#1
		self.remove_older_tracking_times_from_uth()

		#2

		ind_day = retrieve_tracking_history.get_all_ind_day_tracking_dates()

		last_tracking_date = retrieve_user_data.get_last_tracking_date()

		current_date  = os.getenv("START_DATE")
		if current_date is None:
			current_date = date.today().strftime(date_format)

		# get all day tracking times
		adtt = retrieve_tracking_history.get_all_days_tracking_times()

		# get all current day tracking times
		cdtt = self.get_current_day_tracking_times()


		if last_tracking_date == current_date:

			#1 update all_days tracking times 

			# get all current individual day tracking times
			cidtt = retrieve_tracking_history.get_ind_day_tracking_times(current_date)
			
			data = {

				"uth/"+str(uid)+"/ads/" : {
					"ttt" : add_time(sub_time(cdtt["ttt"], cidtt["ttt"]), adtt["ttt"]), 
					"tpt" : add_time(sub_time(cdtt["tpt"], cidtt["tpt"]), adtt["tpt"]), 
					"tupt" : add_time(sub_time(cdtt["tupt"], cidtt["tupt"]), adtt["tupt"]), 
				}
			}

			db.update(data, user_info.getIdToken())

			#2 update current individual day tracking times with current tracking times

			data = {

				"uth/"+str(uid)+"/id/"+str(current_date) : {
					"ttt" : cdtt["ttt"], 
					"tpt" : cdtt["tpt"], 
					"tupt" : cdtt["tupt"], 
				}
			}

			db.update(data, user_info.getIdToken())

		else:

			if len(ind_day) > 7:

				#1 update all_days tracking times

				# get oldest day date
				oldest_tracking_date = retrieve_tracking_history.get_oldest_tracking_date()

				# get oldest day tracking times
				odtt = retrieve_tracking_history.get_ind_day_tracking_times(oldest_tracking_date)

				data = {

					"uth/"+str(uid)+"/ads/" : {
						"ttt" : add_time(sub_time(adtt["ttt"], odtt["ttt"]), cdtt["ttt"]), 
						"tpt" : add_time(sub_time(adtt["tpt"], odtt["tpt"]), cdtt["tpt"]), 
						"tupt" : add_time(sub_time(adtt["tupt"], odtt["tupt"]), cdtt["tupt"]), 
					}
				}

				db.update(data, user_info.getIdToken())

				#2 add current day times to individual_day tracking times after removing oldest day tracking times
				
				db.child("uth").child(uid).child("id").child(oldest_tracking_date).remove(user_info.getIdToken())

				data = {

					"uth/"+str(uid)+"/id/"+str(current_date) : {
						"ttt" : cdtt["ttt"], 
						"tpt" : cdtt["tpt"], 
						"tupt" : cdtt["tupt"], 
					}
				}

				db.update(data, user_info.getIdToken())

				#3 update oldest_tracking_date to oldest date which can be taken from ind_day node
				
				self.update_oldest_tracking_date_in_uth()

			else:

				if last_tracking_date != current_date:

					#1 update all_days tracking times

					data = {

						"uth/"+str(uid)+"/ads/" : {
							"ttt" : add_time(adtt["ttt"], cdtt["ttt"]), 
							"tpt" : add_time(adtt["tpt"], cdtt["tpt"]), 
							"tupt" : add_time(adtt["tupt"], cdtt["tupt"]), 
						}
					}

					db.update(data, user_info.getIdToken())

					#2 add current day times to individual_day tracking times 

					data = {

						"uth/"+str(uid)+"/id/"+str(current_date) : {
							"ttt" : cdtt["ttt"], 
							"tpt" : cdtt["tpt"], 
							"tupt" : cdtt["tupt"], 
						}
					}

					db.update(data, user_info.getIdToken())


	def get_current_day_tracking_times(self):
		cdtt = dict()
		cdtt["ttt"] = retrieve_user_data.get_total_tracking_time()
		cdtt["tpt"] = retrieve_user_data.get_total_productive_time()
		cdtt["tupt"] = retrieve_user_data.get_total_unproductive_time()

		return cdtt


	def update_oldest_tracking_date_in_uth(self):

		old_dates = retrieve_tracking_history.get_all_ind_day_tracking_dates()

		if old_dates is None:
			return

		old_dates = list(old_dates)

		# get oldest date
		oldest_date = None

		# get current date
		c_date = datetime.strptime(datetime.today().strftime(date_format), date_format)

		max_days = 0

		for old_date in old_dates:
			o_date = datetime.strptime(old_date, date_format)
			temp_days = (c_date - o_date).days
			if temp_days > max_days:
				max_days = temp_days
				oldest_date = old_date

		if oldest_date != None:
			db.child("uth").child(uid).update({
				"otd" : oldest_date
			}, user_info.getIdToken())


	def remove_older_tracking_times_from_uth(self):
		"""
			Get all ind_day dates and remove all nodes which are older than last 7 days from current.
			While removing nodes, simultaneously subtract times value from att and update att.
		"""

		# getcurrent date
		c_date = datetime.strptime(date.today().strftime(date_format), date_format)

		# total tracking times to be deleted
		dttt, dtpt, dtupt = initial_time, initial_time, initial_time


		#1 First get older tracking dates from user tracking history

		old_dates = retrieve_tracking_history.get_all_ind_day_tracking_dates()

		if old_dates is None:
			return

		old_dates = list(old_dates)

		for old_date in old_dates:

			o_date = datetime.strptime(old_date, date_format)

			if (c_date - o_date).days >= 7:
				# store tracking times in variables before deleteing

				old_tracking_times = retrieve_tracking_history.get_ind_day_tracking_times(old_date)

				dttt = add_time(dttt, old_tracking_times["ttt"])
				dtpt = add_time(dtpt, old_tracking_times["tpt"])
				dtupt = add_time(dtupt, old_tracking_times["tupt"])

				db.child("uth").child(uid).child("id").child(old_date).remove(user_info.getIdToken())

		if dttt != initial_time:

			# get all days times
			all_days_times = retrieve_tracking_history.get_all_days_tracking_times()


			# subtract deleted times from all_days times
			data = {

				"uth/"+str(uid)+"/ads/" : {
					"ttt" : sub_time(all_days_times["ttt"], dttt), 
					"tpt" : sub_time(all_days_times["tpt"], dtpt),
					"tupt" : sub_time(all_days_times["tupt"], dtupt)
				}
			}

			db.update(data, user_info.getIdToken())

			self.update_oldest_tracking_date_in_uth()


	def clear_db(self):  # to be done when user stops tracking

		current_date  = os.getenv("START_DATE")
		if current_date is None:
			current_date = date.today().strftime(date_format)

		last_tracking_date = retrieve_user_data.get_last_tracking_date()


		if last_tracking_date != None and current_date != last_tracking_date:

			# update last_tracking_date to current_date
			db.child("users").child(uid).update({
				"ltd" : current_date
			}, user_info.getIdToken())

			# delete last day data(all except user data and tracking history)

			db.child("sa").child(uid).remove(user_info.getIdToken())
			db.child("wa").child(uid).remove(user_info.getIdToken())
			db.child("istt").child(uid).remove(user_info.getIdToken())
			db.child("iwtt").child(uid).remove(user_info.getIdToken())

			# change isDBCleared to "t"

			db.child("users").child(uid).update({
				"isDBCleared" : "t"
			}, user_info.getIdToken())


		else:
			pass
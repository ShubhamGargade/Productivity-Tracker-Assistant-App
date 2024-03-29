"""DOCSTRINGS"""


# Standard library imports
import os
import sys
# get user refresh token from pyshell
os.environ["user_refresh_token"] = sys.argv[1]  # to be done before backend import

# Third party imports


# Local application imports
from ProductivityTrackerAssistant import check_conn


db_choice = "1"
prediction_mode = "2"

def main():
	
	choices = ["1", "2"]
	if not ((db_choice in choices) and (prediction_mode in choices)):
		return

	if db_choice == "1" or prediction_mode == "1":
		# check internet connection
		isInternetConnected = check_conn.checkInternetConn()
		if isInternetConnected:
			pass
		else:
			print("Not connected to internet")

			print("EXCEPTION")  # to be received by pyshell to stop tracking

			return

	if prediction_mode == "2":
		isDockerRunning = check_conn.checkDockerConn()
		if isDockerRunning:
			pass
		else:
			print("Docker not running")

			print("EXCEPTION")  # to be received by pyshell to stop tracking
			
			return

	os.environ["db_choice"] = db_choice
	os.environ["prediction_mode"] = prediction_mode

	from ProductivityTrackerAssistant.ActivityTracker.main import Backend
	
	backend = Backend()
	backend.main()


main()
sys.stdout.flush()

"""DOCSTRINGS"""


# Standard library imports
import os
import sys


# Third party imports


# Local application imports
from ProductivityTrackerAssistant.ActivityTracker.main import Backend
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
			return

	if prediction_mode == "2":
		isDockerRunning = check_conn.checkDockerConn()
		if isDockerRunning:
			pass
		else:
			print("Docker not running")
			return

	os.environ["db_choice"] = db_choice
	os.environ["prediction_mode"] = prediction_mode

	backend = Backend()
	backend.main()


main()
sys.stdout.flush()

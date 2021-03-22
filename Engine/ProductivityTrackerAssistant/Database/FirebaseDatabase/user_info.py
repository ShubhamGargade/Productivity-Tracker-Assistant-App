"""DOCSTRINGS"""


# Standard library imports
import os
import threading
import time


# Third party imports


# Local application imports
from . import auth



refresh_token_timer = 50*60  # refresh user token every 50 min

class UserInfo:

	__instance = None


	@staticmethod
	def getInstance():
		""" Static access method. """

		if UserInfo.__instance == None:
			UserInfo()
		
		return UserInfo.__instance
			

	def __init__(self):

		if UserInfo.__instance != None:
			raise Exception("UserInfo is a Singleton Class!")
		else:
			UserInfo.__instance = self

			self.__set_user_data()


	def __set_user_data(self):
		self.__user = auth.refresh(os.getenv("user_refresh_token"))
		self.__idToken = self.__user['idToken']
		self.__account_info = auth.get_account_info(self.__user['idToken'])["users"][0]
		self.__uid = self.__account_info["localId"]
		self.__email = self.__account_info["email"]

		print("Refreshed ID token: ", self.__idToken)

		self.__refresh_user_token()


	def getUid(self):
		return self.__uid


	def getEmail(self):
		return self.__email


	def getIdToken(self):
		return self.__idToken


	def __refresh_user_token(self):
		""" Timer thread which will refresh user id token after a particular time """

		t = threading.Timer(refresh_token_timer, self.__set_user_data)
		t.daemon = True  # so that timer thread exits at sys.exit()
		t.start()  # start the timer thread
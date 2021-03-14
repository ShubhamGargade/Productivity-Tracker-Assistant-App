"""DOCSTRINGS"""


# Standard library imports
from __future__ import print_function
import os
import sys, traceback
from signal import *
import time


# Third party imports


# Local application imports
from ..Database.FirebaseDatabase.save_data import SaveData as FbSaveData
from ..Database.FirebaseDatabase.retrieve_data import RetrieveUserData as FbRetrieveUserData
from .Firebase import winActivity as fwa
from .Firebase import winAutoTimer as fwat



# sys.setrecursionlimit(10000)

class Backend:

    def __init__(self):
        self.activityList = fwa.WinAcitivyList()

        # if the tracking process terminates, then call the __store_data_to_file to store activityList object in a file
        for sig in (SIGABRT, SIGBREAK, SIGILL, SIGINT, SIGSEGV, SIGTERM):
            signal(sig, self.__run_at_exit)


    def main(self):

        if os.getenv("db_choice") == "1":
            # Firebase DB selected
            self.__cloud_firebase_db()
        else:
            # Json DB selected
            self.__local_json_db()


    def __cloud_firebase_db(self):
        tb = None
        try:

            retrieve_user_data = FbRetrieveUserData.getInstance()
            isDBCleared = retrieve_user_data.get_isDBCleared_val()

            # Initialize firebase db - START #
            save_data = FbSaveData.getInstance()
            op_text = save_data.initDB()  # initializes db in firebase if not already initialized and returns corresponding text.

            # Initialize firebase db - END #

            if isDBCleared == 'f':

                # load the activityList object from local file
                isLoadedSuccessfully = self.activityList.load_activity_list_from_file()

                if not isLoadedSuccessfully:

                    self.activityList = fwa.WinAcitivyList()

            else:

                # initialize the activityList object

                self.activityList = fwa.WinAcitivyList()

            autoTimer = fwat.AutoTimer(self.activityList)
            autoTimer.start_execution()

        except Exception as e:

            ex_type, ex, tb = sys.exc_info()
            # traceback.print_tb(tb)
            
        finally:
            del tb


    def __store_data_to_file(self):

        self.activityList.store_activity_list_in_file()


    def __update_firebase_db(self):

        save_data = FbSaveData.getInstance()
        save_data.update_db_at_user_exit()


    def __run_at_exit(self, sig, frame):

        self.__store_data_to_file()

        self.__update_firebase_db()

        sys.exit()

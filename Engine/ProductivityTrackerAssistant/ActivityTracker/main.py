"""DOCSTRINGS"""


# Standard library imports
from __future__ import print_function
import os
import sys, traceback
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


    def main(self):

        if os.getenv("db_choice") == "1":
            # Firebase DB selected
            self.__cloud_firebase_db()


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

            print("STARTED")  # "STARTED" msg to be received by pyshell
            
            autoTimer = fwat.AutoTimer(self.activityList)
            autoTimer.start_execution()

        except Exception as e:

            ex_type, ex, tb = sys.exc_info()
            traceback.print_tb(tb)
            print("Exception:",e)
            # print("Python version:",sys.version)

        finally:
            del tb

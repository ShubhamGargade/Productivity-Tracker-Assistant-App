"""
Create configuration for firebase services and intialize the firebase app

# To store apikey in .env file: "https://able.bio/rhett/how-to-set-and-get-environment-variables-in-python--274rgt5"
"""


import pyrebase
import os

config = {
  "apiKey": "AIzaSyACGUDZccPyev4MarszVJdx34FXf702_Ls",
  "authDomain": "productivitytrackerassistant.firebaseapp.com",
  "databaseURL": "https://productivitytrackerassistant-default-rtdb.firebaseio.com",
  "storageBucket": "productivitytrackerassistant.appspot.com"
}

firebase = pyrebase.initialize_app(config)
db = firebase.database()
auth=firebase.auth()
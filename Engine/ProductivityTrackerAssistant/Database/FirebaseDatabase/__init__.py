"""
Create configuration for firebase services and intialize the firebase app

# To store apikey in .env file: "https://able.bio/rhett/how-to-set-and-get-environment-variables-in-python--274rgt5"
"""

# stadard library imports
import json
import os

# third party imports
from decouple import config
import pyrebase


firebaseConfig = json.loads(config('firebaseConfig'))
# print(firebaseConfig)
firebase = pyrebase.initialize_app(firebaseConfig)
db = firebase.database()
auth=firebase.auth()
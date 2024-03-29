"""
DOCSTRINGS
"""


# Standard library imports
import json
import sys

# Third party imports
import requests

# Local application imports
from ..Constants.keys import *



# The server URL specifies the endpoint of your server running the ResNet
# model with the name "model" and using the predict interface.
SERVER_URL = 'http://localhost:8501/v1/models/model:predict'

# A list of class into which websites are categorized
classes=[c for i,c in SUBCLASSES_STR.items()]


class DockerPrediction:

    __instance = None

    @staticmethod
    def getInstance():
        """ Static access method. """
        if DockerPrediction.__instance == None:
            DockerPrediction()

        return DockerPrediction.__instance


    def __init__(self):
        """ Virtually private costructor """

        if DockerPrediction.__instance != None:
            raise Exception("DockerPrediction is a Singleton Class!!")
        else:
            DockerPrediction.__instance = self
          

    def predict(self, input_text):
        # Compose a JSON Predict request (send title+desc of webpage).
        data = json.dumps({"instances" : [input_text]})
        headers = {"content-type": "application/json"}

        json_response = None
        try:
          json_response = requests.post(SERVER_URL, data=data, headers=headers)
        except requests.ConnectionError as e:
          # print("ConnectionError: Please run you model image in docker")
          print("EXCEPTION")  # to be received by PYSHELL
          sys.exit()
          # return OTHERS_STR

        # Extract text from JSON
        response_text = json.loads(json_response.text)

        # get prediction values for each class
        predicted_values = response_text["predictions"][0]

        max_value_index = predicted_values.index(max(predicted_values))
        prediction1 = classes[max_value_index]

        predicted_values[max_value_index] = -100
        sec_max_val_index = predicted_values.index(max(predicted_values))
        prediction2 = classes[sec_max_val_index]

        return prediction1
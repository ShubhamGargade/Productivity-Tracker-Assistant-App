from ProductivityTrackerAssistant.JarvisAssistant import voice_based_assistant
from ProductivityTrackerAssistant.JarvisAssistant import text_based_assistant


from signal import *
import time
import sys


class StartAssistant:

	def __init__(self):
		pass

		
	def start_voice_assistant(self):
		try:
			va = voice_based_assistant.VoiceAssistant()
			va.start_voice_assistant()
		except Exception as e:
			pass


	def start_text_assistant(self):
		try:
			ta = text_based_assistant.TextAssistant()
			ta.start_text_assistant()
		except Exception as e:
			pass


def main():

	choice = input()

	start_assistant = StartAssistant()

	if choice == "1":
		start_assistant.start_voice_assistant()
	elif choice == "2":
		start_assistant.start_text_assistant()
	else:
		# print("\nEnter valid option\n")
		pass


main()
sys.stdout.flush()
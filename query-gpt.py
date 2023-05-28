# Eventually make a virtual environment for this project
import openai
import os
from dotenv import load_dotenv

load_dotenv() # loads the dotenv file
openai.api_key = os.getenv("OPENAI_API_KEY") # sets the api key, currently just a test value
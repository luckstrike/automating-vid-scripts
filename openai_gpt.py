# Eventually make a virtual environment for this project
import openai
import os
from dotenv import load_dotenv

def ask_gpt():
    load_dotenv() # loads the dotenv file
    openai.api_key = os.getenv("OPENAI_API_KEY") # sets the api key, currently just a test value
    return

def check_sentiment():
    # OpenAI has an API that allows you to use sentiment analysis (use this to see if a query is an answer or not)
    return

def create_search_query():
    # Creates a search query if GPT is unable to answer a question
    return

def query_sense():
    # Note: Should this be used? A funtion to check if the web results make sense?
    return
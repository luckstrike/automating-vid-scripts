import requests
import json
import os
from dotenv import load_dotenv
from googleapiclient.discovery import build

# Used to search the internet and get search results
# Using the Google Custom Search JSON API

def debug_load_dotenv():
    load_dotenv()
    return

def get_results(search_query):
    # Used to search the internet and get search results from the web
    debug_load_dotenv()
    
    service = build("customsearch", "v1", developerKey = os.getenv("GOOGLE_API_KEY"))
    res = service.cse().list(q = search_query, cx = os.getenv("GOOGLE_CSE_ID")).execute()

    return res
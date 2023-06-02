import requests
import json
import os
from dotenv import load_dotenv
from googleapiclient.discovery import build
from bs4 import BeautifulSoup

# Used to search the internet and get search results
# Takes in URLs and then returns the summary of them

def debug_load_dotenv():
    load_dotenv()
    return

def get_results(search_query):
    # Used to search the internet and get search results from the web
    debug_load_dotenv()
    
    service = build("customsearch", "v1", developerKey = os.getenv("GOOGLE_API_KEY"))
    res = service.cse().list(q = search_query, cx = os.getenv("GOOGLE_CSE_ID")).execute()

    return res

def results_to_urls(json_results, num_results = 5):
    # Takes in a JSON file and returns the urls

    # num_results bound check
    if num_results > len(json_results['items']):
        num_results = len(json_results['items'])

    return [json_results['items'][i]['link'] for i in range(num_results)]

def scrape_urls(url):
    # Takes in a url and returns the content of the webpage
    response = requests.get(url)

    if response.status_code == 200:
        page_content = response.content

        soup = BeautifulSoup(page_content, 'html.parser')

        return soup.get_text()
    
    return Exception("Error: Unable to get webpage content")

def check_wikipedia(url):
    # Checks if any updated info is on Wikipedia
    pass

def parse_urls():
    # Parses the provided URLs from a textbox and returns them as a list
    pass
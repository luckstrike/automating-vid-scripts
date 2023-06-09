import nltk
from openai_gpt import *
from web_search import *
from dotenv import load_dotenv

def main():
    load_dotenv() # loads the dotenv file
    # nltk.download('punkt')

    print("Parsing...")
    # Scraping the URL
    url = ""
    site_result = scrape_urls(url)

    print("Parsed!")
    
    # Turning the site results into a summary using GPT
    summary = summarize_info(site_result, "bullet_points")
    print(summary)

if __name__ == "__main__":
    main()
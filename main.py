from openai_gpt import *
from web_search import *
from dotenv import load_dotenv

def main():
    load_dotenv() # loads the dotenv file

    print("Parsing...")
    # Scraping the URL
    url = "https://www.motortrend.com/features/ford-mustang-history-generations-models-specifications/"
    site_result = scrape_urls(url)

    print("Parsed!")

    # Turning the site results into a summary using GPT
    summary = summarize_info(site_result)
    print(summary)

if __name__ == "__main__":
    main()
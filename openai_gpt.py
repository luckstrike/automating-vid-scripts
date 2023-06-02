# Eventually make a virtual environment for this project
import openai
import os
from dotenv import load_dotenv
from openai.error import OpenAIError
from concurrent.futures import ThreadPoolExecutor, as_completed

def debug_load_dotenv():
    load_dotenv()
    return

def ask_gpt(prompt):
    '''
    This function will ask GPT a question and return the answer
    
    Parameters:
        prompt (str): The question to ask GPT

    Returns:
        answer (str): The answer to the question
    '''

    # Takes a while to generate the response, so add a loading screen in the UI?

    # debug_load_dotenv()
    openai.api_key = os.getenv("OPENAI_API_KEY") # sets the api key

    # Runs the GPT-3.5-turbo model
    try:
        response = openai.ChatCompletion.create(
            model = "gpt-3.5-turbo",
            messages = [
                {"role": "system", "content": "You are a helpful assitant."},
                {"role": "user", "content": prompt}
            ],
            temperature = 0.5 # creativity factor, from 0 to 1 where one is more creative
        )
        return response['choices'][0]['message']['content']
    
    except OpenAIError as e:
        print(f"Uh oh, an API error occured. {e}")
        return None
    
    except Exception as e:
        print(f"Uh oh, an error occured: {e}")
        return None

def check_sentiment(text):
    # OpenAI has an API that allows you to use sentiment analysis (use this to see if a query is an answer or not)
    # You can use this to gauge the confidence of GPT's answer

    # debug_load_dotenv()
    openai.api_key = os.getenv("OPENAI_API_KEY") # sets the api key

    # Running sentiment analysis
    response = openai.Completion.create(
        model = "text-davinci-002",
        prompt = f"Sentiment analysis of the following text as a single word (either Positive, Neutral or Negative): \n{text}\n",
        temperature = 0,
        max_tokens = 60,
        top_p = 1,
        frequency_penalty = 0,
        presence_penalty = 0,
    )

    return response['choices'][0]['text']

def create_search_query():
    # Creates a search query if GPT is unable to answer a question
    # Possible queries to ask:
    return

def query_sense():
    # Note: Should this be used? A funtion to check if the web results make sense?
    return

def ask_gpt_chunk(chunk):
    print("DEBUG: Chunk has been fed into GPT")
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant who summarizes any user provided text."},
                {"role": "user", "content": chunk}
            ],
            temperature=0.5  # creativity factor, from 0 to 1 where one is more creative
        )
        return response['choices'][0]['message']['content']
    except OpenAIError as e:
        print(f"Uh oh, an API error occurred. {e}")
        return None
    except Exception as e:
        print(f"Uh oh, an error occurred: {e}")
        return None

def summarize_info(content):
    openai.api_key = os.getenv("OPENAI_API_KEY")  # sets the api key

    # Divide the text into chunks of 2048 tokens each (no sentence splitting)
    content_chunks = [content[i:i+2048] for i in range(0, len(content), 2048)]

    # Parallelize the chunk processing
    with ThreadPoolExecutor(max_workers = 10) as executor:  # Adjust max_workers as needed
        future_to_chunk = {executor.submit(ask_gpt_chunk, chunk): chunk for chunk in content_chunks}
        return "".join(future.result() for future in as_completed(future_to_chunk))

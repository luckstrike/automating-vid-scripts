# Eventually make a virtual environment for this project
import openai
import os
from dotenv import load_dotenv
from openai.error import OpenAIError
from concurrent.futures import ThreadPoolExecutor, as_completed
from nltk.tokenize import sent_tokenize

MAX_TOKEN_CHUNKS = 2048 # Default of 2048, lower values lead to a more detailed summary but more chunks are used

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

def chunk_sentences(content, max_tokens=2048):
    sentences = sent_tokenize(content)
    chunks = []
    current_chunk = ''
    for sentence in sentences:
        if len((current_chunk + sentence).split()) > max_tokens:
            chunks.append(current_chunk)
            current_chunk = sentence
        else:
            current_chunk += ' ' + sentence
    chunks.append(current_chunk)
    return chunks

def ask_gpt_chunk(chunk, summary_mode):
    print("DEBUG: Chunk has been fed into GPT")

    assistant_role = ""

    if summary_mode == 'summarize':
        assistant_role = "You are a helpful assistant who summarizes any user provided text."
    elif summary_mode == 'bullet_points':
        assistant_role = "You are a helpful assistant who creates bullet points from any user provided text."

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": assistant_role},
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

def summarize_info(content, summary_mode = 'summarize'):
    # load_dotenv()
    openai.api_key = os.getenv("OPENAI_API_KEY")  # sets the api key

    print("DEBUG: Assistant role has been set to the following: " + summary_mode)

    # Splits up website content into chunks of the specified max token value (in this case words)
    content_chunks = chunk_sentences(content, MAX_TOKEN_CHUNKS)

    print("DEBUG: A total of " + str(len(content_chunks)) + " chunks have been created")

    # Parallelizes the chunks and puts together results back into original order
    with ThreadPoolExecutor(max_workers = 10) as executor:  # Adjust max_workers as needed
        futures = [executor.submit(ask_gpt_chunk, chunk, summary_mode) for chunk in content_chunks]
        results = [future.result() for future in futures]

    return "".join(results)
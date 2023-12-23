from openai_gpt import *
from web_search import *
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/api/generateidea", methods = ["POST"])
def generateIdea():
    # Fed into the function and used by the GPT model to decide how it handles the prompt
    mode_prompt = "You are a helpful assitant who provides users with a great starting point for a video script." \
                    "You are given a topic and you should provide the user with any key facts or information about it." \
                    "You should provide the user with either a short summary to start them of or a list of information" \
                    "about the topic they enter. You do not need to provide a full script, just a starting point." \
                    "You also don't need to treat your response like a traditional script, just providing the user the " \
                    "information in an informal way is fine."

    res = query_GPT(request.json['prompt'], mode_prompt)
    
    # An error occurred
    if res == None:
        return jsonify({"status": "ERROR", "response": "Uh oh, an error occurred"}), 400

    return jsonify({"status": "OK", "response": res})

@app.route("/api/randomidea", methods = ["GET"])
def genRandomIdea():
    # Let's the AI know that the user has not provided a prompt
    prompt = "Hi, I'm not sure what topic to make a video about. Can you help me out?"

    # Fed into the function and used by the GPT model to decide how it handles the prompt
    mode_prompt = "You are a helpful assitant who provides users with a great starting point for a video script." \
                    "The user is not sure of what they want to make a video about so they would like to be provided with" \
                    "a topic to make a video about. You should provide the user with a topic, any key facts or " \
                    "information about it that may be useful. You do not need to provide a full script, just a starting " \
                    "point. You also don't need to treat your response like a traditional script, just providing the user " \
                    "the information in an informal way is fine."

    res = query_GPT(prompt, mode_prompt)
    
    # An error occurred
    if res == None:
        return jsonify({"status": "ERROR", "response": "Uh oh, an error occurred"}), 400

    return jsonify({"status": "OK", "response": res})

def main():
    load_dotenv() # loads the dotenv file
    app.run(debug = True)

if __name__ == "__main__":
    main()
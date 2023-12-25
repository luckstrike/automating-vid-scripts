import firebase_admin
from openai_gpt import *
from web_search import *
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from firebase_admin import credentials, auth

# Initialize the Firebase Admin SDK
cred = credentials.Certificate("path/to/serviceAccountKey.json")
firebase_admin.initialize_app(cred)

app = Flask(__name__)
CORS(app)

# NOTE: For the Firebase Authentication the following needs to be done:
# Front-end:
# 1. Integrate the Firebase Authentication into the front-end
# 2. When the user logs in, send the token to the back-end
# Back-end:
# 1. Verify the token with the Firebase Authentication
# 2. If the token is valid, generate the response
# 3. If the token is invalid, return an error

# IDEA: Wouldn't it be cool to hold metrics about the AI as well
#       for example the seed, time taken to generate the response,
#       number of tokens used, when it was created, temperature
#       for future reference?

# Deals with Firebase login
@app.route('/user/login', methods=['GET', 'POST'])
def protected_route():
    # Extract the token sent by the client
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'Authorization token is missing'}), 401

    try:
        # Verify the token
        decoded_token = auth.verify_id_token(token)
        user_id = decoded_token['uid']
        # Now you can use the uid to get or save data related to this user
        # Perform your logic here
        # TODO: Add the user to the database if they don't exist
        # Then load all of the users existing scripts, if any
        
        return jsonify({'message': 'Access granted', 'uid': user_id}), 200
    except Exception as e:
        return jsonify({'error': 'Invalid token'}), 403

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
from openai_gpt import *
from web_search import *
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/api/askgpt", methods = ["POST"])
def queryGPT():
    res = ask_gpt(request.json['prompt'])
    
    # An error occurred
    if res == None:
        return jsonify({"status": "ERROR", "response": "Uh oh, an error occurred"}), 400

    return jsonify({"status": "OK", "response": res})

def main():
    load_dotenv() # loads the dotenv file
    app.run(debug = True)

if __name__ == "__main__":
    main()
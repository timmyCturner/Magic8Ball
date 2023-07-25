# using flask_restful
from flask import Flask, jsonify, request
from flask_restful import Resource, Api
# required modules
import random
import json
import pickle
import numpy as np
import nltk
from keras.models import load_model
from nltk.stem import WordNetLemmatizer


# creating the flask app
app = Flask(__name__)
# creating an API object
# cors = CORS(app)
# app.config['CORS_HEADERS'] = 'Content-Type'
api = Api(app)



lemmatizer = WordNetLemmatizer()

# loading the files we made previously
intents = json.loads(open("intenseBin.json").read())
words = pickle.load(open('words.pkl', 'rb'))
classes = pickle.load(open('classes.pkl', 'rb'))
model = load_model('chatbotmodel.h5')

#This function will separate words from the sentences we’ll give as input.
def clean_up_sentences(sentence):
    sentence_words = nltk.word_tokenize(sentence)
    sentence_words = [lemmatizer.lemmatize(word)
                      for word in sentence_words]
    return sentence_words

#append 1 to a list variable ‘bag’ if the word is contained inside our input and is also present in the list of words created earlier
def bagw(sentence):

    # separate out words from the input sentence
    sentence_words = clean_up_sentences(sentence)
    bag = [0]*len(words)
    for w in sentence_words:
        for i, word in enumerate(words):

            # check whether the word
            # is present in the input as well
            if word == w:

                # as the list of words
                # created earlier.
                bag[i] = 1

    # return a numpy array
    return np.array(bag)

#predict the class of the sentence input by the user.
def predict_class(sentence):
    bow = bagw(sentence)
    res = model.predict(np.array([bow]))[0]
    ERROR_THRESHOLD = 0.25
    results = [[i, r] for i, r in enumerate(res)
               if r > ERROR_THRESHOLD]
    results.sort(key=lambda x: x[1], reverse=True)
    return_list = []
    for r in results:
        return_list.append({'intent': classes[r[0]],
                            'probability': str(r[1])})
        return return_list


def get_response(intents_list, intents_json):
    tag = intents_list[0]['intent']
    list_of_intents = intents_json['intents']
    result = ""
    for i in list_of_intents:
        if i['tag'] == tag:

              # prints a random response
            result = random.choice(i['responses'])
            break
    return result

print("Chatbot is up!")


def corsify_actual_response(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response
# making a class for a particular resource
# the get, post methods correspond to get and post requests
# they are automatically mapped by flask_restful.
# other methods include put, delete, etc.
class Hello(Resource):

    # corresponds to the GET request.
    # this function is called whenever there
    # is a GET request for this resource
    def get(self):

        return corsify_actual_response(jsonify({'message': 'hello world'}))

    # Corresponds to POST request
    def post(self):

        data = request.get_json()     # status code
        return jsonify({'data': data}), 201

# another resource to calculate the square of a number
class Magic(Resource):
    def get(self, magic):
        print(magic)
        ints = predict_class(magic)
        print(ints)
        res = get_response(ints, intents)
        return corsify_actual_response(jsonify({'magic': res}))


# adding the defined resources along with their corresponding urls

api.add_resource(Hello, '/')
api.add_resource(Magic, '/magic/<string:magic>')


# driver function
if __name__ == '__main__':

    app.run(debug = True)

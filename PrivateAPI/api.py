# using flask_restful
from flask import Flask, jsonify, request
from flask_restful import Resource, Api
#from flask_cors import CORS, cross_origin
# creating the flask app
app = Flask(__name__)
# creating an API object
# cors = CORS(app)
# app.config['CORS_HEADERS'] = 'Content-Type'
api = Api(app)
#@cross_origin()
# making a class for a particular resource
# the get, post methods correspond to get and post requests
# they are automatically mapped by flask_restful.
# other methods include put, delete, etc.

def corsify_actual_response(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

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
class Square(Resource):

    def get(self, num):

        return corsify_actual_response(jsonify({'square': num**2}))



# another resource to calculate the square of a number
class Magic(Resource):

    def get(self, magic):

        return corsify_actual_response(jsonify({'magic': magic}))


# adding the defined resources along with their corresponding urls

api.add_resource(Hello, '/')
api.add_resource(Square, '/square/<int:num>')
api.add_resource(Magic, '/magic/<string:magic>')


# driver function
if __name__ == '__main__':

    app.run(debug = True)

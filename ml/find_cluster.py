import json
import pickle
import os
from tokenize import String
from requests import request
from nltk.stem.porter import PorterStemmer
from pymongo import MongoClient
from bson.objectid import ObjectId
from flask import Flask, jsonify, request


cluster = None
port = None

try:
    port = os.environ['PYTHON_PORT']
except:
    port = 5757

try:
    cluster = MongoClient(os.environ['MONGO_URL'])
except:
    cluster = MongoClient('mongodb://127.0.0.1:27017/')


db = cluster['social-template']
post = db['posts']
clusterPost = db['postclusters']


# finds the cluster of the post
def run_model(text, id):
    vectorizer = 0
    with open('./ml/vectorizer_trained', 'rb') as file:
        vectorizer = pickle.load(file)

    model = 0
    with open('./ml/cluster_model', 'rb') as file:
        model = pickle.load(file)

    ps = PorterStemmer()
    post = text
    post = post.split()
    post = [ps.stem(x) for x in post]
    post = ' '.join(post)

    post_vector = vectorizer.transform([post]).toarray()
    post_cluster = model.predict(post_vector)
    # print("Post cluster is : ", post_cluster[0])
    clusterPost.insert_one({'postid': id, 'cluster': str(post_cluster[0])})
    return post_cluster[0]


# old main method
def main(id):

    print("Script Started ", id)

    curr_post = None
    try:
        curr_post = post.find_one({'_id': ObjectId(id)})
    except:
        pass

    if(curr_post == None):
        return {'error': 'invalid id'}

    post_text = curr_post['text']
    post_title = curr_post['title']
    print("running for", post_title)
    post_cluster = run_model(post_text + ' ' + post_title, id)

    return {'success': 'success',
            'cluster': str(post_cluster)}

# new run method for running http server


def run():
    app = Flask(__name__)

    @app.route('/cluster', methods=['POST'])
    def get_cluster():

        arge = None

        try:
            args = request.args.to_dict()
        except:
            return jsonify({'error': 'no arguments'})

        try:
            id = args['id']
        except:
            return jsonify({'error': 'pass an id ' + id})

        res = main(id)

        return jsonify(res)

    app.run(port=port)


run()

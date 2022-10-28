import pickle
import os
import sys
from tokenize import String
from xml.etree.ElementTree import tostring
from sklearn.feature_extraction.text import CountVectorizer
from nltk.stem.porter import PorterStemmer
import pymongo
from pymongo import MongoClient
from bson.objectid import ObjectId
from Flask import flask, jsonify

cluster = MongoClient(os.environ['MONGO_URL'] or 'mongodb://127.0.0.1:27017/')
# cluster = MongoClient()
db = cluster['social-template']
# db = cluster
post = db['posts']
clusterPost = db['postclusters']


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
    print("Post cluster is : ", post_cluster[0])
    clusterPost.insert_one({'postid': id, 'cluster': str(post_cluster[0])})


def main():

    args = sys.argv
    if(len(args) <= 1):
        sys.stderr.write("Provide arguments")
        return

    id = args[1]

    print("Script Started ", id)

    # allPosts = post.find()

    # print(allPosts)

    curr_post = post.find_one({'_id': ObjectId(id)})
    print(curr_post)
    post_text = curr_post['text']
    post_title = curr_post['title']
    print("running for", post_title)
    run_model(post_text + ' ' + post_title, id)


main()

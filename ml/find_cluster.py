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

cluster = MongoClient('mongodb://127.0.0.1:27017/')
db = cluster['social-template']
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
    print(post_cluster[0])
    clusterPost.insert_one({'postid': id, 'cluster': str(post_cluster[0])})


def main():
    args = sys.argv
    if(len(args) <= 1):
        sys.stderr.write("Provide arguments")
        return

    id = args[1]
    curr_post = post.find_one({'_id': ObjectId(id)})
    post_text = curr_post['text']
    post_title = curr_post['title']
    run_model(post_text + ' ' + post_title, id)


main()

import pickle
import os
import sys
from sklearn.feature_extraction.text import CountVectorizer
from nltk.stem.porter import PorterStemmer

args = sys.argv
if(len(args) < 1):
    print("Provide arguments")

id = sys.argv[1]


def run_model():
    vectorizer = 0
    with open('./ml/vectorizer_trained', 'rb') as file:
        vectorizer = pickle.load(file)

    model = 0
    with open('./ml/cluster_model', 'rb') as file:
        model = pickle.load(file)

    ps = PorterStemmer()
    post = "This is where it all begins! A hands-on introduction to all of the essential tools you'll need to build real, working websites. You'll learn what web developers actually do – the foundations you'll need for later courses."
    post = post.split()
    post = [ps.stem(x) for x in post]
    post = ' '.join(post)

    post_vector = vectorizer.transform([post]).toarray()
    post_cluster = model.predict(post_vector)
    print(post_cluster)


if(len(args) > 1):

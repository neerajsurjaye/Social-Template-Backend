import pymongo
from pymongo import MongoClient

import os

cluster = MongoClient(os.environ['MONGO_URL'])

db = cluster['social-template']
post = db['post']

allPosts = post.find()

print(allPosts)

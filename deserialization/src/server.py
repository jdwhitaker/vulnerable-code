from flask import Flask, request
import pickle, os, base64

app = Flask(__name__)

@app.route('/myObject', methods=['POST'])
def login():
	obj = (request.json)['obj']
	obj = pickle.loads(base64.b64decode(obj))
	print(obj)

if __name__ == '__main__': 
	app.run()

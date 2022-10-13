from flask import Flask, send_file
from flask import jsonify
from flask import render_template
from flask import request 
from helpers.pretty_print import yellow, cyan, log, green
import sqlite3
from io import BytesIO,StringIO
#### Globals 
app = Flask(__name__)
stores = [] 

@app.route('/')
@app.route('/index')
def index():
    cyan("index")
    return render_template('game.html')



@app.route('/qa')
def qa():
    cyan("qa")
    return render_template('qa.html')

@app.route('/simple')
def simple():
    cyan("simple")
    return render_template('simple.html')

if __name__ == '__main__':
    #cyan("http://34.83.236.108:8080 with database at data/dispense.db")
    cyan("http://localhost:8080/")
    from waitress import serve

    serve(app, host="0.0.0.0", port=8080)

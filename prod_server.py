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

def create_html_grid():
    html = '<div class="grid-container">'
    for row in range(8):
        for col in range(8):
            cell_id = f"{row}-{col}"
            cell_class = 'cream' if (row + col) % 2 == 0 else 'green'
            html += f'<div id="{cell_id}" class="grid-cell {cell_class}">{cell_id}</div>'
    html += '</div>'
    return html

@app.route('/chess')
def chess():
    html_grid = create_html_grid()
    return render_template('chess.html', html_grid=html_grid)

if __name__ == '__main__':
    #cyan("http://34.83.236.108:8080 with database at data/dispense.db")
    cyan("http://localhost:8080/")
    from waitress import serve

    serve(app, host="0.0.0.0", port=8080)



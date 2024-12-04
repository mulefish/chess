from flask import Flask, send_file
from flask import jsonify
from flask import render_template
from flask import request 
from helpers.pretty_print import yellow, cyan, log, green
import sqlite3
from io import BytesIO,StringIO
#### Globals 
app = Flask(__name__)

def create_html_grid():

    letters = list("abcdefgh")


    html = '<div class="grid-container">'
    
    for row in range(8):
        for col in range(8):
            cell_id = f"{row}-{col}"
            cell_class = 'cream' if (row + col) % 2 == 0 else 'green'
            cell_content = ''
            if col == 0:
                cell_content += f'<span class="row-number">{row + 1}</span>'
            if row == 0:
                letter = letters[col]
                cell_content += f'<span class="col-letter">{letter}</span>'


            html += f'<div id="{cell_id}" class="grid-cell {cell_class}">{cell_content}</div>'
    
    html += '</div>'
    return html



# def create_html_grid():
#     html = '<div class="grid-container">'
    
#     # Add number headers
#     html += '<div class="number-header"></div>'
#     for col in range(8):
#         html += f'<div class="number-header">{col + 1}</div>'
    
#     # Add the grid with row headers
#     for row in range(8):
#         # Add letter header for each row
#         html += f'<div class="letter-header">{chr(97 + row)}</div>'
#         for col in range(8):
#             cell_id = f"{row}-{col}"
#             cell_class = 'cream' if (row + col) % 2 == 0 else 'green'
#             html += f'<div id="{cell_id}" class="grid-cell {cell_class}"></div>'
    
#     html += '</div>'
#     return html


@app.route('/')
def chess():
    html_grid = create_html_grid()
    return render_template('chess.html', html_grid=html_grid)

if __name__ == '__main__':
    #cyan("http://34.83.236.108:8080 with database at data/dispense.db")
    cyan("http://localhost:8080/")
    from waitress import serve

    serve(app, host="0.0.0.0", port=8080)





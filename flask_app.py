from flask import Flask, render_template
#from flask import request, url_for
#from flask_sqlalchemy import SQLAlchemy
#from flask_migrate import Migrate

class CustomFlask(Flask):
	jinja_options = Flask.jinja_options.copy()
	jinja_options.update(dict(
		block_start_string='$$',
		block_end_string='$$',
		variable_start_string='$',
		variable_end_string='$',
		comment_start_string='$#',
		comment_end_string='#$',
	))

app = CustomFlask(__name__)

@app.route('/')
def index():
    return render_template('index.html', data = '7')


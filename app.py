# app.py (updated)

from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    """Serves the main graph creator page."""
    return render_template('index.html')

# --- NEW ROUTE ---
@app.route('/theorems')
def theorems():
    """Serves the theorem simulation page."""
    return render_template('theorems.html')
# --- END NEW ROUTE ---

if __name__ == '__main__':
    app.run(debug=True)

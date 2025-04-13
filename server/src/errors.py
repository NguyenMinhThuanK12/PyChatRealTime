import traceback

from flask import jsonify, render_template
from src import app


class InvalidAPIUsage(Exception):
    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        super().__init__()
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        if f'status_code'.startswith('4'):
            self.status = 'fail'
        else:
            self.status = 'error'
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['status'] = self.status
        rv['message'] = self.message

        return rv


@app.errorhandler(InvalidAPIUsage)
def invalid_api_usage(e):
    return jsonify(e.to_dict()), e.status_code


@app.errorhandler(500)
def internal_server_error(error):
    return render_template('page-500.html'), 500


@app.errorhandler(404)
def page_not_found(error):
    return render_template('page-404.html'), 404


@app.errorhandler(Exception)
def handle_unhandled_exception(error):
    trace = traceback.format_exc()
    app.logger.error(f'Unhandled Exception: {error}\n{trace}')
    return jsonify({
        'status': 'fail',
        'error': 'Internal Server Error',
    }), 500

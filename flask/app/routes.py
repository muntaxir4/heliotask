from flask import Flask

def resgiter_routes(app : Flask):
    @app.route("/")
    def index():
        return "Hello World"
    
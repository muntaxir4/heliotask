# run these first in a venv
# flask --app run.py db init
# flask --app run.py db migrate
# flask --app run.py db upgrade

dotenv run -- flask --app run.py run --port 3000 --host 0.0.0.0 --debug
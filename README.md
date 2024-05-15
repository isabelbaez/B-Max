# B-Max Installation

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

This is B-Max, a symptom and vitals monitoring web application. Its frontend is built using React (with ) and its backend is built in Django. 

## Backend Scripts

For the backend, ensure you have some version of Python installed. 

(Note: Multiple versions should work, but in the case you encountered unforeseen errors, we found our system to work best with Python 3.11.6)

Access the B-Max/backend directory and install dependencies for the backend:

cd B-Max/backend

### pip install django
pip install djangorestframework
pip install django-cors-headers
pip install python-dotenv
pip install openai
pip install opencv-python
pip install matplotlib
pip install scipy==1.11.1 (other versions might cause issues)
pip install SpeechRecognition

To start the backend server, run the following command in the same directory:

python manage.py runserver



## Frontend Scripts

For the frontend, ensure you have Node.js and npm installed.

(Note: Again, multiple versions should work, but in the case you encountered unforeseen errors, we found our system to work best with Node.js 16.20.2 (npm 8.19.4))


In the main project directory (/B-Max), you can run:

npm install
npm start






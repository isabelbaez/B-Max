# B-Max Installation

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

This is B-Max, a symptom and vitals monitoring web application. Its frontend is built using React (with ) and its backend is built in Django. 

## Backend Scripts

For the backend, ensure you have some version of Python installed. 

(**Note:** Multiple versions may work, but in the case you encounter unforeseen errors, we found our system to work best with Python 3.11.5)

Additionally, ensure you have `ffmpeg` (a video processing software) installed in your system. It can be installed in macOS using Homebrew:

```
brew install ffmpeg
```

Next, install dependencies for the backend:

```
pip install django
pip install djangorestframework
pip install django-cors-headers
pip install python-dotenv
pip install openai
pip install opencv-python
pip install matplotlib
pip install scipy==1.11.1 (other versions might cause issues)
pip install SpeechRecognition
```

To start the backend server, access the backend B-Max directory:

```
cd B-Max/backend
```

and run the following command:

```
python manage.py runserver
```


### Troubleshooting

If you encounter an `ImportError: libGL.so.1: cannot open shared object file: No such file or directory` error message when running the backend server, it can be due to not having the necessary OpenGL libraries. To account for this in macOS, you can use Homebrew:

`brew install libglvnd1` 
`brew install glfw glew`

## Frontend Scripts

For the frontend, ensure you have Node.js and npm installed. Make sure you are using versions Node.js 16.20.2 (npm 8.19.4), as others may throw unexpected errors. 

In the main project directory (/B-Max), you can run:

npm install
npm start






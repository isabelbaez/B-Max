# B-Max Installation

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

This is B-Max, a symptom and vitals monitoring web application. Its frontend is built using React and its backend is built in Django. 

## Backend Scripts

For the backend, ensure you have some version of Python installed. 

*(**Note:** Multiple versions may work, but in the case you encounter unforeseen errors, we found our system to work best with **Python 3.11.5**)*

Additionally, ensure you have ffmpeg (a video processing software) installed in your system. It can be installed in macOS using Homebrew:

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
pip install scipy==1.11.1
pip install SpeechRecognition
```

Make sure you install the specified scipy version (1.11.1) as other versions might cause issues.

Finally, to start the backend server, access the backend B-Max directory:

```
cd B-Max/backend
```

and run the following command:

```
python manage.py runserver
```

The backend server should be running in `http://localhost:8000`.

### Troubleshooting

If you encounter an `ImportError: libGL.so.1: cannot open shared object file: No such file or directory` error message when running the backend server, it can be due to not having the necessary OpenGL libraries. To account for this in macOS, you can use Homebrew:

```
brew install libglvnd1
brew install glfw glew
```

## Frontend Scripts

For the frontend, ensure you have Node.js and npm installed. Make sure you are using versions **Node.js 16.20.2 (npm 8.19.4)**, as others may throw unexpected errors. 

You can access the main project directory:

```
cd B-Max
```

and run:

```
npm install
npm start
```

You should now be able to access B-Max at `http://localhost:3000`.


# List of Contents

## Backend Directory

B-Max's backend is built using Django. The main files at play here can be found under the `/vitals` folder. 

### `/vitals` folder

- **`urls.py`** - specifies the endpoints for the vitals measurement and the speech transcription (`/measureVitals` and `/processAudio` respectively). 

- **`audio_process.py`** - contains all the work for the speech-to-text transcriptions. It takes in a WebM audio, converts it into WAV format and uses the SpeechRecognition library to output a text transcription.

- **`vitals_utils/heart_rate.py`** - contains most of the work for the heart rate calculation. It takes in a video in MOV format and outputs the pulse.

- **`views.py`** - Contains all of the work for the pain probability calculation and some work for the heart rate calculation. Takes in a video in MOV format and outputs the calculated hear rate and pain probability percentage. The heart rate portion takes in a video in WebM format and converts it into MOV format, then using the functions in `heart_rate.py` to output the pulse. The pain probability workflow extracts the frames of the WebM video and stores them in JPEG format, then using the ChatGPT API to output the pain probability percentage. 


### `/media` folder

- **`/frames`** - Empty folder to store the extracted frames for the pain probability calculation.

- **`/output.mov`** - Converted video for the heart rate calculation. 


## Frontend Directory

B-Max's frontend is built using React. 

### `/public` folder

- **`/models`** -

- **`/questions`** -

- **`questions.json`** -  

### `/src` folder

- **`/components/AudioRecorder.js`** -

- **`/components/CameraRecorder.js`** -

- **`/landing/landing.js`** -










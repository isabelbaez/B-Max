# B-Max Installation

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

This is B-Max, a symptom and vitals monitoring web application. Its frontend is built using React and its backend is built in Django. 

## Backend Scripts

For the backend, ensure you have some version of Python installed. 

***NOTE:** Multiple versions may work, but in the case you encounter unforeseen errors, we found our system to work best with **Python 3.11.5***

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

***NOTE:** The OpenAI API requires an API-KEY, an ORG-KEY, and a PROJECT_KEY which we store in a `.env` file that cannot be uploaded.*

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

- **`urls.py`** - Specifies the endpoints for the vitals measurement and the speech transcription (`/measureVitals` and `/processAudio` respectively). 

- **`audio_process.py`** - Contains all the work for the speech-to-text transcriptions. It takes in a WebM audio, converts it into WAV format and uses the SpeechRecognition library to output a text transcription.

- **`vitals_utils/heart_rate.py`** - Contains most of the work for the heart rate calculation. It takes in a video in MOV format and outputs the pulse.

- **`views.py`** - Contains all of the work for the pain probability calculation and some work for the heart rate calculation. Takes in a video in MOV format and outputs the calculated hear rate and pain probability percentage. The heart rate portion takes in a video in WebM format and converts it into MOV format, then using the functions in `heart_rate.py` to output the pulse. The pain probability workflow extracts the frames of the WebM video and stores them in JPEG format, then using the ChatGPT API to output the pain probability percentage. 


### `/media` folder

- **`/frames`** - Empty folder to store the extracted frames for the pain probability calculation.

- **`/output.mov`** - Converted video for the heart rate calculation. 


## Frontend Directory

B-Max's frontend is built using React. 

### `/public` folder

- **`/models`** - Folder containing the `face-api.js` models used for the initial real-time user face tracking to confirm their positioning. 

- **`/questions`** - This folder contains the audio files used as audio questions for the self-reporting health questionaire.

- **`questions.json`** - Contains the written medical questionnaire questions in JSON format.  

### `/src` folder

- **`/landing/landing.js`** - This React component is the one that is opened on initialization of our client. It contained the HTML code related to the Welcome screen, and also contains a state controller that will change the React component depending on the stage of the daily health evaluation the user is in: changing to CameraRecorder when the user needs to be recorded for the heart rate and pain calculations, to the AudioRecorder when the user is completing the self-evaluation questionaire, and then to Stats which would display the results obtained on the screen.

- **`/components/AudioRecorder.js`** - This file is the React component that handles the user answering the questions. It has a useState that gets updated as the user goes from question to question, and it calls the appropiate question audio file and text to be displayed and played when the user encounters a new question. It also has the code that displays the record/stop recording/re-record buttons and allows for audio input that is sent to the backend as well as display the text response that the backend returns.

- **`/components/CameraRecorder.js`** - This file is the React component that handles the user's interaction with the camera. It always displays the content of the web cam on the screen and has useStates that first provide an alignment stage followed by a recording stage. In the alignement state the image of the to-record video is displayed providing an outline of where to user's face should be. It has a button to start recording which would start colecting video input from the webcam. The video is automatically stopped after 30 seconds but the user can press the button again to stop the recording after a minimum of 15 seconds of recording. One this happens a request with the video file is sent to the backend which responds with the calculated heart rate and pain level given the input video.

- **`/components/Stats.js`** - This file is the React component that is incharged of displying the results obtained by B-Max. After completing the video recording and audio recording of answers, this file prompts a loading page while still awaiting for response from the backend from any of the requests sent of these media to get back heart rate, pain rate, and text transcription of the user's answers to the questions. Once loaded, this page displays the calculated heart rate, pain level and the text question-answer pairs that the user reported.

- **`/components/Components.css`** - CSS file with formatting for AudioRecorder, CameraRecorder and Stats compoments.

- **`/landing/landing.css`** - CSS file with the formating for the lading page









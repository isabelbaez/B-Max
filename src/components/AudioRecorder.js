import './Components.css';
import React, { useState, useRef, useEffect } from 'react';

function AudioRecorder({ state, setState }) {
    const [isRecording, setIsRecording] = useState(false);
    const [isAnswering, setIsAnswering] = useState(false);
    const [questions, setQuestions] = useState(null);
    const [currQuestion, setCurrQuestion] = useState(1);
    const [currTrancription, setCurrTrancription] = useState(null);
    const [showingTranscription, setShowingTranscription] = useState(false);
    const audioRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);

    useEffect(() => {
        const getWrittenQuestions = async () => {
            try {
                const questionsResponse = await fetch("/questions.json");
                if (questionsResponse.ok) {
                    const json_data = await questionsResponse.json();
                    setQuestions(json_data['questions']);
                    console.log(questions);
                    console.log('Transcoding successful');
                } else {
                    console.error('Transcoding failed:', questionsResponse.statusText);
                }
            } catch (error) {
                console.error('Error uploading audio:', error);
            }
        }; 
        getWrittenQuestions();
    }, []);


    const startRecording = () => {
        navigator.mediaDevices.getUserMedia({ video: false, audio: true })
        .then((stream) => {
            audioRef.current.srcObject = stream;
            const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            // const options = { mimeType: 'audio/wav' };
            // const mediaRecorder = new MediaRecorder(stream, options);
            mediaRecorderRef.current = mediaRecorder;
            mediaRecorder.ondataavailable = (e) => {
            chunksRef.current.push(e.data);
            };
            mediaRecorder.onstop = () => {
                setIsRecording(false);
                uploadAudio(chunksRef.current);
            };
            mediaRecorder.start();
            setIsRecording(true);
        })
        .catch((err) => {
            console.error('Error accessing media devices:', err);
        });
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }
        setShowingTranscription(true);
    };

    const nextQuestion = () => {
        setCurrQuestion(currQuestion + 1)
        // if (currQuestion > 10){
        //     setState(state + 1)
        // }
        setShowingTranscription(false);
        setCurrTrancription("");
        setIsAnswering(false);
    };

    const finishSurvey = () => {
        setState(state + 1)
    };

    const uploadAudio = async (chunks) => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('file', blob, 'input.webm');
        formData.append('answer_number', currQuestion)
        chunksRef.current = [];

        try {
          const response = await fetch("http://localhost:8000/vitals/processAudio", {
            method: 'POST',
            body: formData
          });
      
          if (response.ok) {
            const json_data = await response.json();
            setCurrTrancription(json_data['transcription']);
            console.log('Transcoding successful');
          } else {
            console.error('Transcoding failed:', response.statusText);
          }
        } catch (error) {
          console.error('Error uploading audio:', error);
        }
    }; 

    return (
        <div>
            {currQuestion <= 10 && (
                <div className='container'>
                    <div className='questionContainer'>
                        <h1>Question {(currQuestion)}</h1>
                        <span>{questions && questions[currQuestion-1]["question"]}</span>
                        <audio
                            controls
                            autoPlay
                            onEnded={() => setIsAnswering(true)}  // Automatically move to recording after the question
                            src={`questions/Q${(currQuestion)}.m4a`}>
                            Your browser does not support the audio element.
                        </audio>
                    </div>

                    {isAnswering && (
                        <div className='questionContainer' id='questionAnswer'>
                            <audio ref={audioRef} autoPlay muted style={{ display: 'none' }} />
                            {isRecording ? (
                                <button className="recordBtn" onClick={stopRecording}>
                                    <svg height="40" viewBox="0 0 32 32" width="40" xmlns="http://www.w3.org/2000/svg">
                                        <g id="Ikon">
                                            <circle cx="16" cy="16" fill="#eee" r="14"/>
                                            <circle cx="16" cy="16" fill="#f44336" r="10"/>
                                        </g>
                                    </svg>
                                    <b>Stop Recording</b>
                                </button>
                            ) : (
                                <button className="recordBtn" onClick={startRecording} disabled={showingTranscription}>
                                    <svg height="40" viewBox="0 0 32 32" width="40" xmlns="http://www.w3.org/2000/svg">
                                        <g id="Ikon">
                                            <circle cx="16" cy="16" fill="#eee" r="14"/>
                                            <circle cx="16" cy="16" fill={showingTranscription? "eee" : "#f44336"} r="5"/>
                                        </g>
                                    </svg>
                                    <b>Record Answer</b>
                                </button>
                            )}
                            
                            <span>{showingTranscription && currTrancription}</span>

                            {currQuestion == 10 ? (
                                <button className="flowBtn" style={{display: showingTranscription ? "" : "none"}} onClick={finishSurvey}>
                                    <b>Finish</b>
                                </button>
                            ) : (
                                <button className="flowBtn" style={{display: showingTranscription ? "" : "none"}} onClick={nextQuestion}>
                                    <b>Next Question</b>
                                    {/* <iframe src="src/icons/right-arrow.svg" width="100" height="100" frameBorder="0"></iframe>
                                    <img src="src/icons/right-arrow.svg" alt="right-arrow"></img> */}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default AudioRecorder;
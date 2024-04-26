import './Components.css';
import React, { useState, useRef, useEffect } from 'react';

function AudioRecorder({ state, setState, allAnswers, setAllAnswers }) {
    const [isRecording, setIsRecording] = useState(false);
    const [isAnswering, setIsAnswering] = useState(false);
    const [hasAnswered, setHasAnswered] = useState(false);
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
        setHasAnswered(true);
    };

    const nextQuestion = () => {
        setCurrQuestion(currQuestion + 1)
        setShowingTranscription(false);
        setCurrTrancription("");
        setIsAnswering(false);
        setHasAnswered(false);
        if (currTrancription != 'Google Speech Recognition could not understand the audio'){
            allAnswers.push(currTrancription)
        }
        else{
            allAnswers.push('N/A')
        }
        setAllAnswers(allAnswers)
    };

    const finishSurvey = () => {
        setAllAnswers(allAnswers);
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
                                <div>
                                    {hasAnswered? (
                                        <button className="recordBtn" onClick={startRecording}>
                                            <svg height="40" viewBox="0 0 32 32" width="40" xmlns="http://www.w3.org/2000/svg">
                                                <g id="Ikon">
                                                    <circle cx="16" cy="16" fill="#eee" r="14"> a ver </circle>
                                                    <svg height="30" viewBox="-22 -12 100 80" width="30" xmlns="http://www.w3.org/2000/svg" id="fi_6066733"><g id="Layer_3" fill="#6d6e71" data-name="Layer 3"><path d="m60.42035 35.46243a28.63547 28.63547 0 0 1 -57.05708-3.87781 1.00453 1.00453 0 0 1 1.00767-.9767h3.97342a1.00513 1.00513 0 0 1 .99664 1.03776 22.689 22.689 0 1 0 10.5759-18.79675 1.00465 1.00465 0 0 0 .22414 1.79451l6.4972 2.20177a1 1 0 0 1 -.15942 1.934l-17.51426 2.86664a1 1 0 0 1 -1.1609-.95147l-.56589-15.97962a1 1 0 0 1 1.87062-.52624l3.10929 5.519a1.00479 1.00479 0 0 0 1.52448.26524 28.61444 28.61444 0 0 1 46.67819 25.48967z"></path><path d="m60.42035 35.46243a28.63547 28.63547 0 0 1 -57.05708-3.87781 1.00453 1.00453 0 0 1 1.00767-.9767h3.97342a1.00513 1.00513 0 0 1 .99664 1.03776 22.689 22.689 0 1 0 10.5759-18.79675 1.00465 1.00465 0 0 0 .22414 1.79451l6.4972 2.20177a1 1 0 0 1 -.15942 1.934l-17.51426 2.86664a1 1 0 0 1 -1.1609-.95147l-.56589-15.97962a1 1 0 0 1 1.87062-.52624l3.10929 5.519a1.00479 1.00479 0 0 0 1.52448.26524 28.61444 28.61444 0 0 1 46.67819 25.48967z"></path></g><g id="Icon"><path d="m42.05469 4.12988a29.4416 29.4416 0 0 0 -28.96582 5.08692l-3.10938-5.51953a2.00014 2.00014 0 0 0 -3.74121 1.05322l.56641 15.97951a1.99907 1.99907 0 0 0 2.32131 1.90281l17.51464-2.8667a2.00033 2.00033 0 0 0 .31936-3.86811l-6.50879-2.20361a21.65076 21.65076 0 1 1 6.46192 39.36718 21.80263 21.80263 0 0 1 -16.57231-21.39897 2.01389 2.01389 0 0 0 -1.99609-2.05469h-3.97364a2.0077 2.0077 0 0 0 -2.00781 1.96143 29.63241 29.63241 0 0 0 46.48047 24.79785 29.38226 29.38226 0 0 0 12.56836-20.77979 29.68216 29.68216 0 0 0 -19.35742-31.45752z" fill="#e53935"></path></g></svg>

                                                </g>
                                            </svg>
                                            <b>Re-record</b>
                                        </button>
                                    ) : (
                                        <button className="recordBtn" onClick={startRecording}>
                                            <svg height="40" viewBox="0 0 32 32" width="40" xmlns="http://www.w3.org/2000/svg">
                                                <g id="Ikon">
                                                    <circle cx="16" cy="16" fill="#eee" r="14"/>
                                                    <circle cx="16" cy="16" fill={"#f44336"} r="5"/>
                                                </g>
                                            </svg>
                                            <b>Record Answer</b>

                                            
                                        </button>
                                    )}
                                </div>
                            )}
                            
                            <span>{showingTranscription && currTrancription}</span>

                            {currQuestion == 10 ? (
                                <button className="flowBtn" style={{display: showingTranscription ? "" : "none"}} onClick={finishSurvey}>
                                    <b>Finish</b>
                                </button>
                            ) : (
                                <button className="flowBtn" style={{display: showingTranscription ? "" : "none"}} onClick={nextQuestion}>
                                    <b>Next Question</b>
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
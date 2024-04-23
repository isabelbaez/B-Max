import React, { useState, useRef } from 'react';
// import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

function AudioRecorder({ state, setState }) {
    const [isRecording, setIsRecording] = useState(false);
    const [currQuestion, setCurrQuestion] = useState(1)
    const audioRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);

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
        setCurrQuestion(currQuestion + 1)
        if (currQuestion > 20){
            setState(state + 1)
        }
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
            {currQuestion <= 20 && currQuestion % 2 === 1 ? (
                <div>
                    <h1>Question {(currQuestion + 1) / 2}</h1>
                    <audio
                        controls
                        autoPlay
                        onEnded={() => setCurrQuestion(currQuestion + 1)}  // Automatically move to recording after the question
                        src={`questions/Q${(currQuestion + 1) / 2}.m4a`}>
                        Your browser does not support the audio element.
                    </audio>
                </div>
            ) : (
                <div>
                    <audio ref={audioRef} autoPlay muted style={{ display: 'none' }} />
                    {isRecording ? (
                        <button onClick={stopRecording}>Stop Recording</button>
                    ) : (
                        <button onClick={startRecording}>Start Recording</button>
                    )}
                </div>
            )}
        </div>
    );
}

export default AudioRecorder;
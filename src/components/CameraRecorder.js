import React, { useState, useRef } from 'react';
// import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

function CameraRecorder() {
    const [isRecording, setIsRecording] = useState(false);
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);

    const startRecording = () => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then((stream) => {
            videoRef.current.srcObject = stream;
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            mediaRecorder.ondataavailable = (e) => {
            chunksRef.current.push(e.data);
            };
            mediaRecorder.onstop = () => {
                setIsRecording(false);
                uploadVideo(chunksRef.current);
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
    };

    const uploadVideo = async (chunks) => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const formData = new FormData();
        formData.append('file', blob, 'input.webm');

        try {
          const response = await fetch("http://localhost:8000/vitals/measureVitals", {
            method: 'POST',
            body: blob
          });
      
          if (response.ok) {
            console.log('Transcoding successful');
          } else {
            console.error('Transcoding failed:', response.statusText);
          }
        } catch (error) {
          console.error('Error uploading video:', error);
        }
    }; 

    return (
        <div>
        <video ref={videoRef} autoPlay style={{display: isRecording? "" : "none"}}/>
        {isRecording ? (
            <button onClick={stopRecording}>Stop Recording</button>
        ) : (
            <button onClick={startRecording}>Start Recording</button>
        )}
        </div>
    );
}

export default CameraRecorder;
import React, { useState, useRef, useEffect } from 'react';
// import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

function CameraRecorder({state, setState, setHeartRate, setPainProb, onRecordingComplete}) {
    const [isRecording, setIsRecording] = useState(false);
    const [streamActive, setStreamActive] = useState(false); 
    const [seconds, setSeconds] = useState(30);
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);

    useEffect(() => {
        // Setup the stream right when the component mounts
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            .then((stream) => {
                videoRef.current.srcObject = stream;
                setStreamActive(true); // Enable video visibility
                // Clean up the stream when the component unmounts
                return () => {
                    stream.getTracks().forEach(track => track.stop());
                };
            })
            .catch((err) => {
                console.error('Error accessing media devices:', err);
            });
        if (seconds <= 0) {
            stopRecording();
        }
    }, [seconds]);

    const startRecording = () => {
        const mediaRecorder = new MediaRecorder(videoRef.current.srcObject);
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

        if (seconds > 0) {
            const interval = setInterval(() => {
                setSeconds(seconds => seconds - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }

        setState(state + 1);
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
                const json_data = await response.json();
                console.log(json_data)
                setHeartRate(json_data["heart_rate"]);
                setPainProb(json_data["pain_prob"]);
                onRecordingComplete(response)
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
        {isRecording ? (
            <button onClick={stopRecording}>Stop Recording</button>
        ) : (
            <button onClick={startRecording}>Start Recording</button>
        )}
        <h1>00:{seconds/10 < 1? "0" + String(seconds) : seconds}</h1>
        <video ref={videoRef} autoPlay style={{ display: streamActive ? "" : "none" }}/>
        </div>
    );
}

export default CameraRecorder;
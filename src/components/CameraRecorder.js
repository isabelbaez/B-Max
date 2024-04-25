import './Components.css';
import React, { useState, useRef, useEffect } from 'react';
import * as faceapi from 'face-api.js';

function CameraRecorder({state, setState, setHeartRate, setPainProb, onRecordingComplete}) {
    const [isRecording, setIsRecording] = useState(false);
    const [streamActive, setStreamActive] = useState(false); 
    const [seconds, setSeconds] = useState(30);
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const canvasRef = useRef(null);
    const alignedRef = useRef(false);

    let xOffset = 0;
    let yOffset = 0;

    const renderedOutline = [
        { x: 360 + xOffset, y: 130 + yOffset },

        { x: 320 + xOffset, y: 135 + yOffset },
        { x: 285 + xOffset, y: 155 + yOffset },
        { x: 260 + xOffset, y: 185 + yOffset },

        { x: 250 + xOffset, y: 220 + yOffset },
        { x: 250 + xOffset, y: 250 + yOffset }, 
        { x: 250 + xOffset, y: 290 + yOffset },

        { x: 260 + xOffset, y: 330 + yOffset },
        { x: 280 + xOffset, y: 370 + yOffset },
        { x: 300 + xOffset, y: 395 + yOffset },
        { x: 320 + xOffset, y: 410 + yOffset },

        { x: 340 + xOffset, y: 420 + yOffset },
        { x: 360 + xOffset, y: 425 + yOffset },
        { x: 380 + xOffset, y: 420 + yOffset },

        { x: 400 + xOffset, y: 410 + yOffset },
        { x: 420 + xOffset, y: 395 + yOffset },
        { x: 440 + xOffset, y: 370 + yOffset },
        { x: 460 + xOffset, y: 330 + yOffset },

        { x: 470 + xOffset, y: 290 + yOffset },
        { x: 470 + xOffset, y: 250 + yOffset },
        { x: 470 + xOffset, y: 220 + yOffset }, 

        { x: 460 + xOffset, y: 185 + yOffset },
        { x: 445 + xOffset, y: 155 + yOffset },
        { x: 410 + xOffset, y: 135 + yOffset },
    ];

    const idealOutline = [

        { x: 250 + xOffset, y: 220 + yOffset },
        { x: 250 + xOffset, y: 250 + yOffset }, 
        { x: 250 + xOffset, y: 290 + yOffset },

        { x: 260 + xOffset, y: 330 + yOffset },
        { x: 280 + xOffset, y: 370 + yOffset },
        { x: 300 + xOffset, y: 395 + yOffset },
        { x: 320 + xOffset, y: 410 + yOffset },

        { x: 340 + xOffset, y: 420 + yOffset },
        { x: 360 + xOffset, y: 425 + yOffset },
        { x: 380 + xOffset, y: 420 + yOffset },

        { x: 400 + xOffset, y: 410 + yOffset },
        { x: 420 + xOffset, y: 395 + yOffset },
        { x: 440 + xOffset, y: 370 + yOffset },
        { x: 460 + xOffset, y: 330 + yOffset },

        { x: 470 + xOffset, y: 290 + yOffset },
        { x: 470 + xOffset, y: 250 + yOffset },
        { x: 470 + xOffset, y: 220 + yOffset }, 
    ];

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            .then((stream) => {
                videoRef.current.srcObject = stream;
                setStreamActive(true);
                return () => {
                    stream.getTracks().forEach(track => track.stop());
                };
            })
            .catch((err) => {
                console.error('Error accessing media devices:', err);
            });

        const loadModels = async () => {
            const MODEL_URL = '/models';
            await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
            await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
            startVideo();
        };
    
        const startVideo = () => {
            navigator.mediaDevices.getUserMedia({ video: {} })
                .then(stream => {
                    videoRef.current.srcObject = stream;
                    videoRef.current.addEventListener('play', onPlay);
                })
                .catch(err => {
                    console.error("Failed to start video", err);
                });
        };
    
        const onPlay = () => {
            if (!canvasRef.current) {
                const canvas = faceapi.createCanvasFromMedia(videoRef.current);
                canvasRef.current = canvas;
            }
            
            setInterval(async () => {

                if (canvasRef.current && videoRef.current) { 
                    const displaySize = { width: videoRef.current.width, height: videoRef.current.height };
                    faceapi.matchDimensions(canvasRef.current, displaySize);
            
                    const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                        .withFaceLandmarks();
            
                    const resizedDetections = faceapi.resizeResults(detections, displaySize);

                    if (canvasRef.current) {
                        
                        canvasRef.current.getContext('2d').clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                        faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
                        faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
                    
                        const detectedOutline = detections.map(det => {
                            const landmarks = det.landmarks;
                            return landmarks.getJawOutline();
                        });

                        const compareOutlines = (idealOutline, detectedOutline) => {
                            let totalDistance = 0;

                            if (detectedOutline.length == 0) {
                                return null;
                            }

                            for (let i = 0; i < idealOutline.length; i++) {
                                const idealPoint = idealOutline[i];
                                const detectedPoint = detectedOutline[i];
                                if (detectedPoint && detectedPoint[i]) {
                                    const distance = Math.sqrt(
                                        Math.pow(idealPoint.x - detectedPoint[i].x, 2) +
                                        Math.pow(idealPoint.y - detectedPoint[i].y, 2)
                                    );
                                    totalDistance += distance;
                                }
                            }
                            return totalDistance / idealOutline.length;
                        }

                        const distance = compareOutlines(idealOutline, detectedOutline);
                        if (distance) {
                            alignedRef.current = distance < 2;
                        }
                        const red = '#FF0000';
                        const green = '#00FF00';
                        drawOutline(alignedRef.current? green : red);
                    }
                }
            }, 100);
        };
    
        const drawOutline = (color) => {
            const canvas = document.getElementById('outlineCanvas');
            const ctx = canvas.getContext('2d');
            
            ctx.beginPath();
            ctx.moveTo(renderedOutline[0].x, renderedOutline[0].y);

            renderedOutline.forEach(point => {
                ctx.lineTo(point.x, point.y);
            });
            
            ctx.closePath();
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        loadModels();
        return () => {
            if (videoRef.current) {
                videoRef.current.removeEventListener('play', onPlay);
            }
        };
    }, []);

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
                setSeconds(prevSeconds => {
                    if (prevSeconds <= 0) {
                        clearInterval(interval);
                        stopRecording();
                        return 0;
                    } else {
                        return prevSeconds - 1;
                    }
                });
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

        let headers = new Headers();
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Access-Control-Allow-Methods', 'POST');

        try {
            console.log("heeeere");
            const response = await fetch("http://localhost:8000/vitals/measureVitals", {
                method: 'POST',
                headers: headers,
                body: blob
            });
            console.log("done");
        
            if (response.ok) {
                const json_data = await response.json();
                console.log("DATA", json_data);
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
            <h2>Align your face to the outline.</h2>

            <video ref={videoRef} autoPlay width="720" height="560" style={{ display: streamActive ? "" : "none", position: 'absolute', top: "10%", left: "25%" }}/>
            {!isRecording && (<canvas ref={canvasRef} width="720" height="560" style={{ display: streamActive ? "" : "none", position: 'absolute', top: "10%", left: "25%" }} />)}
            <canvas id="outlineCanvas" width="720" height="560" style={{ display: streamActive ? "" : "none", position: 'absolute', top: "10%", left: "25%" }}></canvas>

            <div style={{ display: streamActive ? "" : "none", position: 'absolute', top: "80%", left: "25%" }}>

                {isRecording ? (
                    <div>
                    <button className="recordBtn" onClick={stopRecording}>
                        <svg height="40" viewBox="0 0 32 32" width="40" xmlns="http://www.w3.org/2000/svg">
                            <g id="Ikon">
                                <circle cx="16" cy="16" fill="#eee" r="14"/>
                                <circle cx="16" cy="16" fill="#f44336" r="10"/>
                            </g>
                        </svg>
                        <b>Stop Recording</b>
                    </button>
                    <h1>00:{seconds/10 < 1? "0" + String(seconds) : seconds}</h1>
                    </div>
                ) : (
                    <button className="recordBtn" onClick={startRecording}>
                        <svg height="40" viewBox="0 0 32 32" width="40" xmlns="http://www.w3.org/2000/svg">
                            <g id="Ikon">
                                <circle cx="16" cy="16" fill="#eee" r="14"/>
                                <circle cx="16" cy="16" fill="#f44336" r="5"/>
                            </g>
                        </svg>
                        <b>Start Recording</b>
                    </button>
                )}
            </div>
        </div>
    );
}

export default CameraRecorder;
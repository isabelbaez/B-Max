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

                const blob = new Blob(chunksRef.current, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'recording.webm';
                a.click();
                setIsRecording(false);
                uploadVideo(chunksRef.current);
                // chunksToMOV(chunksRef.current)
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
        try {
          const response = await fetch("http://localhost:8000/heartrate/measure", {
            method: 'POST',
            body: chunks
          });
      
          if (response.ok) {
            // If the request is successful, you can handle the transcoded video here
            // For example, you can save it to state or play it in a video player
            console.log('Transcoding successful');
          } else {
            console.error('Transcoding failed:', response.statusText);
          }
        } catch (error) {
          console.error('Error uploading video:', error);
        }
    };




    // const chunksToMOV = (chunks) => {
    //     const blob = new Blob(chunks, { type: 'video/webm' });
        
    //     // Create a FileReader to read the Blob as an ArrayBuffer
    //     const fileReader = new FileReader();
        
    //     fileReader.onload = () => {
    //         // Once the ArrayBuffer is loaded, use FFmpeg to transcode it
    //         const ffmpeg = createFFmpeg({ log: true });
            
    //         ffmpeg.load().then(async () => {
    //         // Write the ArrayBuffer to FFmpeg's filesystem
    //         ffmpeg.FS('writeFile', 'input.webm', new Uint8Array(fileReader.result));
        
    //         // Transcode the video from WebM to MOV format
    //         await ffmpeg.run('-i', 'input.webm', 'output.mov');
        
    //         // Read the transcoded MOV file from FFmpeg's filesystem
    //         const movData = ffmpeg.FS('readFile', 'output.mov');
        
    //         // Create a Blob from the transcoded MOV data
    //         const movBlob = new Blob([movData.buffer], { type: 'video/quicktime' });
        
    //         // Create an object URL from the Blob
    //         const movURL = URL.createObjectURL(movBlob);
        
    //         // Create a download link for the MOV file
    //         const downloadLink = document.createElement('a');
    //         downloadLink.href = movURL;
    //         downloadLink.download = 'recorded_video.mov';
    //         downloadLink.textContent = 'Download MOV';
    //         document.body.appendChild(downloadLink);
    //         });
    //     };
        
    //     // Read the Blob as an ArrayBuffer
    //     fileReader.readAsArrayBuffer(blob);
    //     };
          
      

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
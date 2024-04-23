import './landing.css';
import * as React from 'react';
import {useState} from 'react';
import CameraRecorder from '../components/CameraRecorder';
import AudioRecorder from '../components/AudioRecorder';
import Stats from '../components/Stats';

function Landing() {

  const [currTab, setCurrTab] = useState(0)

  const [loading, setLoading] = useState(false); // Tracks if waiting for async response
    const [cameraData, setCameraData] = useState(null); 

  
    const handleCameraFinished = (response) => {
      console.log("ALOOOOO HOLA BEBE")
      response
          .then(response => response.json())
          .then(data => {
              setCameraData(data);
              setLoading(false);
          })
          .catch(error => {
              console.error('Error:', error);
              setLoading(false);
          });
  };


  return ( 
    <div className="flex column width-100 align-center">
    {currTab === 1 && (
        
          <AudioRecorder state={currTab} setState={setCurrTab} />
        
      )}
      {(
        currTab === 0 && <CameraRecorder state={currTab} setState={setCurrTab} onRecordingComplete={handleCameraFinished}/>
      )}{(
        currTab == 2 && <Stats bpm={cameraData} ></Stats>
      )}
    </div>
  );
}

export default Landing;
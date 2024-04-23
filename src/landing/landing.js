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
  const [entryStarted, setEntryStarted] = useState(false); 

  const [heartRate, setHeartRate] = useState(null);
  const [painProb, setPainProb] = useState(null);
  
  const handleCameraFinished = (response) => {
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
      <button style={{display: entryStarted? "none" : ""}} onClick={() => setEntryStarted(true)}>New Entry</button>

      <div style={{display: entryStarted? "" : "none"}}>
        {
          currTab === 1 
          && 
          (<AudioRecorder state={currTab} setState={setCurrTab}/>
        )}
        {(
          currTab === 0 
          && 
          <CameraRecorder state={currTab} setState={setCurrTab} setHeartRate={setHeartRate} setPainProb={setPainProb} onRecordingComplete={handleCameraFinished}/>
        )}
        {(
          currTab == 2 
          && 
          <Stats bpm={heartRate} pain={painProb}></Stats>
        )}
      </div>
    </div>
  );
}

export default Landing;
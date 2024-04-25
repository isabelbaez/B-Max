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
  const [allAnswers, setAllAnswers] = useState([]);
  
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

      <div className='header' style={{display: entryStarted? "none" : ""}}>
        <span id="name">B-MAX</span>
        <span id="description">A Symptom Monitoring Interface</span>
        <button id="startBtn" style={{display: entryStarted? "none" : ""}} onClick={() => setEntryStarted(true)}>New Entry</button>
      </div>

      <div style={{display: entryStarted? "" : "none"}}>
        {
          currTab === 1 
          && 
          (<AudioRecorder state={currTab} setState={setCurrTab} allAnswers={allAnswers} setAllAnswers={setAllAnswers}/>
        )}
        {(
          currTab === 0 
          && 
          <CameraRecorder state={currTab} setState={setCurrTab} setHeartRate={setHeartRate} setPainProb={setPainProb} onRecordingComplete={handleCameraFinished}/>
        )}
        {(
          currTab == 2 
          && 
          <Stats bpm={heartRate} pain={painProb} allAnswers={allAnswers}></Stats>
        )}
      </div>
    </div>
  );
}

export default Landing;
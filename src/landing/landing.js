import './landing.css';
import * as React from 'react';
import {useState} from 'react';
import CameraRecorder from '../components/CameraRecorder';
import AudioRecorder from '../components/AudioRecorder';

function Landing() {

  const [currTab, setCurrTab] = useState(0)


  return ( 
    <div>
    {currTab === 0 ? (
        <div className="flex column width-100 align-center">
          cool
          <AudioRecorder state={currTab} setState={setCurrTab} />
        </div>
      ) : (
        currTab === 1 && <CameraRecorder />
      )}
    </div>
  );
}

export default Landing;
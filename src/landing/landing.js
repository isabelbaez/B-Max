import './landing.css';
import * as React from 'react';
import {useState} from 'react';
import CameraRecorder from '../components/CameraRecorder';
import AudioRecorder from '../components/AudioRecorder';

function Landing() {

  const [currTab, setCurrTab] = useState(0)


  return ( 
    <div className="flex column width-100 align-center">
    {currTab === 1 ? (
        
          <AudioRecorder state={currTab} setState={setCurrTab} />
        
      ) : (
        currTab === 0 && <CameraRecorder state={currTab} setState={setCurrTab}/>
      )}
    </div>
  );
}

export default Landing;
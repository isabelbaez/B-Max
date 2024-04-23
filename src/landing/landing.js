import './landing.css';
import * as React from 'react';
import {useState} from 'react';
import CameraRecorder from '../components/CameraRecorder';

function Landing() {


  return ( 
    <div className="flex column width-100 align-center">
      cool
      <CameraRecorder/>
        {/* <div className="flex align-left column landing-1 width-100" style={{height: "max(8vw, 50px)"}}>
            <NavBar />
        </div> */}
        {/* <div className="tab-selection">
          <button className={selectedTab === 1 ? "selected-button" : "tab-button"} onClick={() => setSelectedTab(1)}>Manipulation</button>
          <button className={selectedTab === 2 ? "selected-button" : "tab-button"} onClick={() => setSelectedTab(2)}>Generation</button>
        </div> */}
        {/* <div style={{marginTop: "min(-10vw, -120px)", width: "87%"}} className="flex justify-end">
            {sections.map((section, i) => <Button key={i} variant="contained" className="landing-button">{section}</Button>)}
        </div> */}
        {/* <div id="demo" style={{width: "90%", margin: "20px", marginTop: "50px"}}>
            <X2Mesh />
        </div> */}
    </div>
  );
}

export default Landing;
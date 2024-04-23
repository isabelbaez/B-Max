import React, { useState, useRef } from 'react';
// import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

function Stats({bpm, pain}) {
    
    return (
        <div>
            <h2> Calculated Heart Rate: {Math.round(bpm)} beats per minute </h2>
            <h2> Calculated Pain Probability: {Math.round(pain)}% </h2>
        </div>
    );
}

export default Stats;
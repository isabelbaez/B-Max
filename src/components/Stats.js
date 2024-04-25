import React, { useState, useRef, useEffect } from 'react';
// import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

function Stats({bpm, pain, allAnswers}) {

    const [questions, setQuestions] = useState(null);
    const allTime = [0,1,2,3,4,5,6,7,8,9,10];

    useEffect(() => {
        const getWrittenQuestions = async () => {
            try {
                const questionsResponse = await fetch("/questions.json");
                if (questionsResponse.ok) {
                    const json_data = await questionsResponse.json();
                    setQuestions(json_data['questions']);
                    // console.log(questions);
                    console.log('Transcoding successful');
                } else {
                    console.error('Transcoding failed:', questionsResponse.statusText);
                }
            } catch (error) {
                console.error('Error uploading audio:', error);
            }
        }; 
        getWrittenQuestions();
    }, []);

    useEffect(() => {
        if (questions) {
            console.log(questions);
            console.log('Questions loaded successfully');
        }
    }, [questions]);
    
    return (
        <div>
            <h2> Calculated Heart Rate: {Math.round(bpm)} beats per minute </h2>
            <h2> Calculated Pain Probability: {Math.round(pain)}% </h2>
            
            {questions && allAnswers && questions.map((question, i) => (
                <div key={i}>
                    <h3>Question {i}: {question["question"]}</h3>
                    <p>{allAnswers[i]}</p>
                </div>
            ))}
        </div>
    );
}

export default Stats;
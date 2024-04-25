import './Components.css';
import React, { useState, useRef, useEffect } from 'react';

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

            <div className="header">
                <span>Results</span>
            </div>
            
            {/* <b> Heart Rate </b> */}

            <div id='heartRateContainer' className='vitalsContainer'>
                <svg clip-rule="evenodd" fill-rule="evenodd" width="100" height="100" image-rendering="optimizeQuality" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" viewBox="0 0 1707 1707" xmlns="http://www.w3.org/2000/svg" id="fi_8011552"><g id="Layer_x0020_1"><g id="_529968176"><path d="m527 1486c-2 0-3 0-5 0-19-2-34-18-35-38l-48-933-117 439c-5 17-21 29-39 29h-243c-22 0-40-18-40-40s18-40 40-40h213l175-653c5-19 23-32 43-30s35 18 36 38l47 934 74-276c5-17 21-29 39-29h99l69-254c5-18 21-30 39-30 19 1 34 14 38 32l88 404 89-236c6-16 21-26 38-26h540c22 0 40 18 40 40s-18 40-40 40h-513l-127 337c-6 17-23 27-40 26-18-2-33-14-37-32l-81-376-34 125c-5 17-20 30-38 30h-100l-132 490c-4 17-20 29-38 29z" fill="#f74d06"></path></g></g></svg>
                <span> {Math.round(bpm)} bpm </span>
            </div>

            <div id='painContainer' className='vitalsContainer'>
                <span> <span>{Math.round(pain)}%</span> likelyhood of being in pain</span>
            </div>

            <div className='answersContainer'>
                <h1>Survey Answers</h1>
                {questions && allAnswers && questions.map((question, i) => (
                    <div key={i} className='surveyAnswer'>
                        <h3>{i + 1}. {question["question"]}</h3>
                        <p>{allAnswers[i]}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Stats;
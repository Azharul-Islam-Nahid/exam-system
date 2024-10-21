import axios from "axios";
import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import style from "../StudentDashboard.module.css";

function Test() {
    let { id } = useParams();
    let { category } = useParams();

    const [allQuestions, setAllQuestions] = useState([]);
    const [answer, setAnswer] = useState({
        answer1: "",
        answer2: "",
        answer3: "",
        answer4: "",
        answer5: "",
    });

    const [timeLeft, setTimeLeft] = useState(900); // Set 15-minute timer (900 seconds)
    const [isTimeUp, setIsTimeUp] = useState(false);

    let history = useHistory();

    useEffect(() => {
        async function getAllQuestions() {
            let value = await axios.get("http://localhost:3333/question");
            setAllQuestions(value.data);
        }
        getAllQuestions();
    }, []);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearInterval(timer); // Cleanup interval on component unmount
        } else {
            setIsTimeUp(true);
            submitTest(); // Auto-submit when time is up
        }
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    let correctAnswer = [];

    function onRadioButtonChange(e) {
        if (isTimeUp) return; // Prevent changes when time is up
        setAnswer({
            ...answer,
            [e.target.name]: e.target.value
        });
    }

    async function submitTest() {
        // Retrieve correct answers based on the exam_id
        correctAnswer = allQuestions
            .filter(q => parseInt(q.exam_id) === parseInt(id))
            .map(q => q.question_answer.trim().toLowerCase()); // Normalize correct answers

        let score = 0;
        let status = "";

        // Loop through each answer and compare, normalizing user answers too
        for (let i = 0; i < correctAnswer.length; i++) {
            const userAnswer = answer[`answer${i + 1}`]; // Get user answer
            if (userAnswer) { // Check if user answer exists
                if (correctAnswer[i] === userAnswer.trim().toLowerCase()) {
                    score++;
                }
            }
        }

        // Determine pass or fail based on score
        if (score >= 7) status = "Pass";
        else status = "Fail";

        // Prepare date and data to send to API
        var date = new Date();
        var d = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
        var t = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

        let data = {
            "result_status": status,
            "result_score": score,
            "user_email": sessionStorage.getItem("user"),
            "exam_date": d + " " + t,
            "exam_name": category,
            "total_marks": "20",
            "exam_id": id,
            "total_Question": "20"
        };

        await axios.post("http://localhost:3333/result", data);
        history.push("/StudentDashboard/Result");
    }

    return (
        <>
            <div style={{
                display: 'flex',
                justifyContent: 'flex-end', // Align children to the right
                padding: '10px'
            }}>
                <h3 style={{
                    backgroundColor: 'grey',
                    padding: '10px',
                    position: 'fixed',  // Fixes the element's position
                    top: '40px',       // Distance from the top of the viewport
                    right: '10px',     // Distance from the right of the viewport
                    zIndex: 1000       // Ensures the timer is above other elements
                }}>
                    Time Remaining: {formatTime(timeLeft)}
                </h3>
            </div>
            <div id={style.displayBoxQuestionHeadingBox}>
                <h1>Answer all the questions</h1>
                {isTimeUp && <h4>Time's up! Your answers have been submitted.</h4>}
            </div>
            {
                allQuestions.map((data, i) => {
                    if (parseInt(data.exam_id) === parseInt(id)) {
                        return (
                            <div id={style.displayBoxQuestionBox} key={i}>
                                <div id={style.divQuestion}> <span>{data.question_name}</span> </div>

                                <div>
                                    <input onChange={(e) => onRadioButtonChange(e)} value={data.option_one}
                                        id={style.option1} name={`answer${i + 1}`} type="radio" disabled={isTimeUp} />
                                    <label htmlFor="option1">{data.option_one}</label>
                                </div>

                                <div>
                                    <input onChange={(e) => onRadioButtonChange(e)} value={data.option_two}
                                        id={style.option2} name={`answer${i + 1}`} type="radio" disabled={isTimeUp} />
                                    <label htmlFor="option2">{data.option_two}</label>
                                </div>

                                <div>
                                    <input onChange={(e) => onRadioButtonChange(e)} value={data.option_three}
                                        id={style.option3} name={`answer${i + 1}`} type="radio" disabled={isTimeUp} />
                                    <label htmlFor="option3">{data.option_three}</label>
                                </div>

                                <div>
                                    <input onChange={(e) => onRadioButtonChange(e)} value={data.option_four}
                                        id={style.option4} name={`answer${i + 1}`} type="radio" disabled={isTimeUp} />
                                    <label htmlFor="option4">{data.option_four}</label>
                                </div>
                            </div>
                        );
                    }
                    return <React.Fragment key={i}></React.Fragment>
                })
            }
            <div id={style.submitExam}>
                <button onClick={submitTest} disabled={isTimeUp}>Submit Exam</button>
            </div>
        </>
    );
}

export default Test;

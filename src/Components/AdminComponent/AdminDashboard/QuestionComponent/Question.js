import style from "../SubjectComponent/Subject.module.css";
import axios from "axios";
import { useEffect, useState } from "react";

function Question() {
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        async function getAllQuestions() {
            try {
                const value = await axios.get("http://localhost:3333/question");
                setQuestions(value.data);
            } catch (error) {
                console.error("Error fetching questions:", error);
            }
        }
        getAllQuestions();
    }, []);

    return (
        <>
            <div className={style.displayHeadingBox}>
                <h2>Question List</h2>
            </div>

            <div className={style.tableBox}>
                <table>
                    <thead>
                        <tr>
                            <th className={style.center}>Question Name</th>
                            <th className={style.center}>Option one</th>
                            <th className={style.center}>Option two</th>
                            <th className={style.center}>Option three</th>
                            <th className={style.center}>Option Four</th>
                            <th className={style.center}>Question Answer</th>
                            <th className={style.center}>Subject Name</th>
                        </tr>
                    </thead>
                    <tbody className={style.tbody}>
                        {questions.map((data, i) => (
                            <tr key={i}>
                                <td>{data.question_name}</td>
                                <td>{data.option_one}</td>
                                <td>{data.option_two}</td>
                                <td>{data.option_three}</td>
                                <td>{data.option_four}</td>
                                <td>{data.question_answer}</td>
                                <td>{data.subject_name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default Question;

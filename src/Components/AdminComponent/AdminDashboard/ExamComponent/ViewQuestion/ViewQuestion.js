import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import style from "../../SubjectComponent/Subject.module.css";

function ViewQuestion() {
    const [display, setDisplay] = useState({ display: "none" });
    const [questions, setQuestions] = useState([]);
    const [updatedQ, setUpdatedQ] = useState({
        question_name: "",
        option_one: "",
        option_two: "",
        option_three: "",
        option_four: "",
        question_answer: "",
        exam_id: "",
        subject_name: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const history = useHistory();

    const getAllQuestions = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get("http://localhost:3333/question");
            setQuestions(response.data);
        } catch (error) {
            setError("Error fetching questions. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllQuestions();
    }, []);

    const onTextFieldChange = (e) => {
        setUpdatedQ({
            ...updatedQ,
            [e.target.name]: e.target.value
        });
    };

    const setDataInInputField = (questionId) => {
        const question = questions.find(q => q.id === questionId);
        if (question) {
            setUpdatedQ(question);
            setDisplay({ display: "block" });
        } else {
            setError("Question not found.");
        }
    };

    const updateQuestion = async () => {
        setLoading(true);
        setError(null);
        try {
            const { id, ...questionData } = updatedQ; // Exclude the id from the object being sent
            await axios.put(`http://localhost:3333/question/${id}`, questionData);
            alert("Question updated successfully!");
            setDisplay({ display: "none" });
            getAllQuestions();  // Refresh questions list after update
        } catch (error) {
            setError("Error updating the question. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const deleteQuestion = async (questionId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this question?");
        if (!confirmDelete) return; // Exit if the user cancels

        setLoading(true);
        setError(null);
        try {
            await axios.delete(`http://localhost:3333/question/${questionId}`);
            alert("Question deleted successfully!");
            getAllQuestions();  // Refresh questions list after delete
        } catch (error) {
            setError("Error deleting the question. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoBack = () => {
        history.push("/AdminDashboard/Exam");
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <>
            <div id={style.displayHeadingBox}>
                <h2>Question List</h2>
            </div>
            <div id={style.tableBox}>
                <table>
                    <thead>
                        <tr>
                            <th id={style.center}>Question Name</th>
                            <th id={style.center}>Option One</th>
                            <th id={style.center}>Option Two</th>
                            <th id={style.center}>Option Three</th>
                            <th id={style.center}>Option Four</th>
                            <th id={style.center}>Question Answer</th>
                            <th id={style.center}>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questions.map((data) => {
                            if (parseInt(data.exam_id) === parseInt(id)) {
                                return (
                                    <tr key={data.id}>
                                        <td>{data.question_name}</td>
                                        <td>{data.option_one}</td>
                                        <td>{data.option_two}</td>
                                        <td>{data.option_three}</td>
                                        <td>{data.option_four}</td>
                                        <td>{data.question_answer}</td>
                                        <td>
                                            <button onClick={() => setDataInInputField(data.id)}>Edit</button>
                                            <button onClick={() => deleteQuestion(data.id)}>Delete</button>
                                        </td>
                                    </tr>
                                );
                            }
                            return null;
                        })}
                    </tbody>
                </table>
            </div>

            <div id={style.addSubjectBox}>
                <button onClick={handleGoBack}>Go Back</button>
            </div>

            {display.display === "block" && (
                <div id={style.addBox} style={display}>
                    <label>Enter Question </label>
                    <input value={updatedQ.question_name} onChange={onTextFieldChange} name="question_name" type="text" placeholder="Enter Question " />

                    <label>Enter Option A </label>
                    <input value={updatedQ.option_one} onChange={onTextFieldChange} name="option_one" type="text" placeholder="Enter Option A" />

                    <label>Enter Option B </label>
                    <input value={updatedQ.option_two} onChange={onTextFieldChange} name="option_two" type="text" placeholder="Enter Option B" />

                    <label>Enter Option C </label>
                    <input value={updatedQ.option_three} onChange={onTextFieldChange} name="option_three" type="text" placeholder="Enter Option C" />

                    <label>Enter Option D </label>
                    <input value={updatedQ.option_four} onChange={onTextFieldChange} name="option_four" type="text" placeholder="Enter Option D" />

                    <label>Enter Question Answer </label>
                    <input value={updatedQ.question_answer} onChange={onTextFieldChange} name="question_answer" type="text" placeholder="Enter Answer" />

                    <label>Enter Subject </label>
                    <input value={updatedQ.subject_name} onChange={onTextFieldChange} name="subject_name" type="text" placeholder="Enter Subject" />

                    <div id={style.buttonBox}>
                        <button onClick={updateQuestion}>Update Question</button>
                        <button onClick={() => setDisplay({ display: "none" })}>Close</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default ViewQuestion;

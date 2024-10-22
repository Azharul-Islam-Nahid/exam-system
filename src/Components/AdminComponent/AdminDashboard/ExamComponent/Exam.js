import { useState, useEffect } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import style from "../SubjectComponent/Subject.module.css";

function Exam() {
    // State for Add Exam Form visibility
    const [showExamForm, setShowExamForm] = useState(false);
    const [exams, setExams] = useState([]);
    const [questions, setQuestions] = useState([]);

    // Fetching all Exams from db.json file
    useEffect(() => {
        async function getAllExam() {
            try {
                let response = await axios.get("http://localhost:3333/exam"); // Corrected endpoint
                console.log("Fetched exams:", response.data);
                setExams(response.data);
            } catch (error) {
                console.error("Error fetching exams:", error);
            }
        }
        getAllExam();
    }, []);

    // Adding Exam state
    const [exam, setExam] = useState({
        exam_name: "",
        exam_desc: "",
        exam_level: "",
        exam_passMarks: "",
        exam_totalQuestion: "",
        exam_marks: "",
        exam_date: new Date().toLocaleString()
    });

    function handleInput(e) {
        setExam({
            ...exam,
            [e.target.name]: e.target.value
        });
    }

    async function handleAddNewExam() {
        try {
            const newExamResponse = await axios.post("http://localhost:3333/exam", exam); // Corrected endpoint
            console.log("New exam added:", newExamResponse.data);
            setExams([...exams, newExamResponse.data]); // Add the new exam to the state
            setShowExamForm(false); // Close the form
            setExam({ // Reset the exam form
                exam_name: "",
                exam_desc: "",
                exam_level: "",
                exam_passMarks: "",
                exam_totalQuestion: "",
                exam_marks: "",
                exam_date: new Date().toLocaleString()
            });
        } catch (error) {
            console.error("Error adding new exam:", error);
        }
    }

    // Fetching all questions
    useEffect(() => {
        async function getAllQuestions() {
            try {
                let response = await axios.get("http://localhost:3333/question");
                console.log("Fetched questions:", response.data);
                setQuestions(response.data);
            } catch (error) {
                console.error("Error fetching questions:", error);
            }
        }
        getAllQuestions();
    }, []);

    async function deleteExam(id) {
        try {
            // Delete all related questions first
            for (let question of questions) {
                if (question.exam_id === id) {
                    await axios.delete(`http://localhost:3333/question/${question.id}`);
                }
            }
            await axios.delete(`http://localhost:3333/exam/${id}`); // Corrected endpoint for deleting an exam
            setExams(exams.filter((exam) => exam.id !== id)); // Update exams after deletion
        } catch (error) {
            console.error("Error deleting exam:", error);
        }
    }

    return (
        <>
            <div id={style.displayHeadingBox}>
                <h2>Exam List</h2>
            </div>

            <div id={style.tableBox}>
                <table>
                    <thead>
                        <tr>
                            <th id={style.center}>Exam Name</th>
                            <th id={style.center}>Exam Desc.</th>
                            <th id={style.center}>Exam Creation Date</th>
                            <th id={style.center}>Exam Level</th>
                            <th id={style.center}>Options</th>
                        </tr>
                    </thead>
                    <tbody id={style.tbody}>
                        {exams.map((data) => (
                            <tr key={data.id}>
                                <td>{data.exam_name}</td>
                                <td>{data.exam_desc}</td>
                                <td>{data.exam_date}</td>
                                <td>{data.exam_level}</td>
                                <td>
                                    <NavLink to={`/AdminDashboard/Exam/Details/${data.id}`}>
                                        <button>Details</button>
                                    </NavLink>
                                    <NavLink to={`/AdminDashboard/Exam/ViewQuestion/${data.id}`}>
                                        <button>View Question</button>
                                    </NavLink>
                                    <NavLink to={`/AdminDashboard/Exam/AddQuestion/${data.id}`}>
                                        <button>Add Question</button>
                                    </NavLink>
                                    <button onClick={() => deleteExam(data.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div id={style.addSubjectBox}>
                <button onClick={() => setShowExamForm(true)}>Add Exam</button>
            </div>

            {showExamForm && (
                <div id={style.addBox}>
                    <label>Enter Exam Name</label>
                    <input onChange={handleInput} name="exam_name" type="text" placeholder="Enter Exam Name" value={exam.exam_name} />
                    <label>Enter Exam Desc</label>
                    <input onChange={handleInput} name="exam_desc" type="text" placeholder="Enter Exam Desc" value={exam.exam_desc} />
                    <label>Enter Exam Level</label>
                    <input onChange={handleInput} name="exam_level" type="text" placeholder="Enter Exam Level" value={exam.exam_level} />
                    <label>Enter Total Questions</label>
                    <input onChange={handleInput} name="exam_totalQuestion" type="text" placeholder="Enter Total Questions" value={exam.exam_totalQuestion} />
                    <label>Enter Total Marks</label>
                    <input onChange={handleInput} name="exam_marks" type="text" placeholder="Enter Total Marks" value={exam.exam_marks} />
                    <label>Enter Pass Marks</label>
                    <input onChange={handleInput} name="exam_passMarks" type="text" placeholder="Enter Pass Marks" value={exam.exam_passMarks} />
                    <div id={style.buttonBox}>
                        <button onClick={handleAddNewExam}>Add</button>
                        <button onClick={() => setShowExamForm(false)}>Close</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default Exam;

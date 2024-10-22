import style from "../../SubjectComponent/Subject.module.css";
import { useParams, useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";

function Student() {
    const { id } = useParams();
    const [email, setEmail] = useState("");
    const [result, setResult] = useState([]);
    const [error, setError] = useState(""); // State for error messages

    // Fetch student email by ID
    useEffect(() => {
        async function getStudentEmail() {
            try {
                const value = await axios.get(`http://localhost:3333/user/${id}`);
                setEmail(value.data.user_email);
            } catch (error) {
                setError("Error fetching student email.");
                console.error("Error fetching student email:", error);
            }
        }
        getStudentEmail();
    }, [id]);

    // Fetch results by student email
    const fetchResultsByEmail = async (email) => {
        try {
            const response = await axios.get(`http://localhost:3333/result/email/${email}`);
            if (response.data.length === 0) {
                setError("No results found for this student email.");
                setResult([]); // Clear results if no matches found
            } else {
                setResult(response.data);
                setError(""); // Clear any previous errors
            }
        } catch (error) {
            setError("Error fetching results for this student email.");
            console.error("Error fetching results:", error);
        }
    };

    // Fetch results once the email is available
    useEffect(() => {
        if (email) {
            fetchResultsByEmail(email);
        }
    }, [email]);

    const history = useHistory();

    function handleGoBack() {
        history.push("/AdminDashboard/StudentList");
    }

    return (
        <>
            <div id={style.displayHeadingBox}>
                <h2>Student Exam List</h2>
            </div>

            {/* Display Error Message */}
            {error && <div style={{ color: "red" }}>{error}</div>}

            <div id={style.tableBox}>
                <table>
                    <thead>
                        <tr>
                            <th id={style.center}>User Email</th>
                            <th id={style.center}>Exam Name</th>
                            <th id={style.center}>Exam Date</th>
                            <th id={style.center}>Result Status</th>
                            <th id={style.center}>Total Marks</th>
                            <th id={style.center}>Result Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {result.length > 0 ? (
                            result.map((data, i) => (
                                <tr key={i}>
                                    <td>{data.user_email}</td>
                                    <td>{data.exam_name}</td>
                                    <td>{data.exam_date}</td>
                                    <td>{data.result_status}</td>
                                    <td>{data.result_score}</td>
                                    <td>{data.total_marks}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">No results available.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div id={style.addSubjectBox}>
                <button onClick={handleGoBack}>Go Back</button>
            </div>
        </>
    );
}

export default Student;

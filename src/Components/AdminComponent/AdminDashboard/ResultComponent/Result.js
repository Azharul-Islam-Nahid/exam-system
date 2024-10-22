import axios from "axios";
import { useEffect, useState } from "react";
import style from "../SubjectComponent/Subject.module.css";

function Result() {
    const [results, setResults] = useState([]);
    const [email, setEmail] = useState(""); // State for storing the email input
    const [error, setError] = useState(""); // State for error messages
    const [loading, setLoading] = useState(false); // State to indicate loading

    // Fetch all results (initial load)
    useEffect(() => {
        async function getAllResults() {
            try {
                let value = await axios.get("http://localhost:3333/result");
                setResults(value.data);
            } catch (error) {
                console.error("Error fetching results:", error);
            }
        }
        getAllResults();
    }, []);

    // Fetch results by email
    const fetchResultsByEmail = async () => {
        setError(""); // Reset error state
        setLoading(true); // Set loading to true while fetching
        try {
            const response = await axios.get(`http://localhost:3333/result/email/${email}`);
            if (response.data.length === 0) {
                setResults([]); // Clear results if no matches found
                setError("No results found for this email.");
            } else {
                setResults(response.data); // Update results with filtered data
                setError(""); // Clear any error messages
            }
        } catch (error) {
            setResults([]); // Clear results on error
            setError("No results found for this email."); // Set error message
            console.error("Error fetching results:", error);
        }
        setLoading(false); // Stop loading
    };

    return (
        <>
            <div id={style.displayHeadingBox}>
                <h2>Exam Results</h2>
            </div>

            {/* Email Input and Search Button */}
            <div>
                <input
                    type="email"
                    placeholder="Enter user email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button onClick={fetchResultsByEmail}>Search Results</button>
            </div>

            {/* Display Error Message */}
            {error && <div style={{ color: "red" }}>{error}</div>}

            {/* Display Loading Message */}
            {loading && <div>Loading...</div>}

            {/* Display Results Table */}
            {!loading && results.length > 0 && (
                <div id={style.tableBox}>
                    <table>
                        <thead>
                            <tr>
                                <th id="center">User Email</th>
                                <th id="center">Exam Name</th>
                                <th id="center">Exam Date</th>
                                <th id="center">Result Status</th>
                                <th id="center">Your Score</th>
                                <th id="center">Total Marks</th>
                                <th id="center">Total Question</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((data, i) => (
                                <tr key={i}>
                                    <td>{data.user_email}</td>
                                    <td>{data.exam_name}</td>
                                    <td>{data.exam_date}</td>
                                    <td>{data.result_status}</td>
                                    <td>{data.result_score}</td>
                                    <td>{data.total_marks}</td>
                                    <td>{data.total_Question}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Display No Results Message */}
            {!loading && results.length === 0 && !error && (
                <div>No results available. Please enter a valid email.</div>
            )}
        </>
    );
}

export default Result;

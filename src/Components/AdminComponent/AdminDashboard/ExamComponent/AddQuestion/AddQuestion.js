import style from "../../SubjectComponent/Subject.module.css";
import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";

function AddQuestion() {
  const { id } = useParams(); // Get exam ID from URL parameters
  const [question, setQuestion] = useState({
    question_name: "",
    option_one: "",
    option_two: "",
    option_three: "",
    option_four: "",
    question_answer: "",
    exam_id: id,
    subject_name: ""
  });

  // Function to handle changes in input fields
  function onInputChange(e) {
    setQuestion({
      ...question,
      [e.target.name]: e.target.value
    });
  }

  let history = useHistory();

  // Function to handle navigation back to the Exam dashboard
  function handleGoBack() {
    history.push(`/AdminDashboard/Exam`);
  }

  // Function to add a new question by posting it to the server
  async function addnewQuestion() {
    try {
      await axios.post("http://localhost:3333/question", question);
      history.push(`/AdminDashboard/Exam/ViewQuestion/${id}`);
    } catch (error) {
      console.error("Error adding question:", error);
    }
  }

  return (
    <>
      <div id={style.displayHeadingBox}>
        <h2>Adding Question</h2>
      </div>

      <div id={style.addBox} className={style.addQuestion}>
        <label>Question Name</label>
        <input
          onChange={(e) => onInputChange(e)}
          name="question_name"
          type="text"
          placeholder="Enter Question"
        />

        <label>Enter Option A</label>
        <input
          onChange={(e) => onInputChange(e)}
          name="option_one"
          type="text"
          placeholder="Enter Option A"
        />

        <label>Enter Option B</label>
        <input
          onChange={(e) => onInputChange(e)}
          name="option_two"
          type="text"
          placeholder="Enter Option B"
        />

        <label>Enter Option C</label>
        <input
          onChange={(e) => onInputChange(e)}
          name="option_three"
          type="text"
          placeholder="Enter Option C"
        />

        <label>Enter Option D</label>
        <input
          onChange={(e) => onInputChange(e)}
          name="option_four"
          type="text"
          placeholder="Enter Option D"
        />

        <label>Enter Question Answer</label>
        <input
          onChange={(e) => onInputChange(e)}
          name="question_answer"
          type="text"
          placeholder="Enter Question answer (don't write option A,B,C,D)"
        />

        <label>Enter Subject</label>
        <input
          onChange={(e) => onInputChange(e)}
          name="subject_name"
          type="text"
          placeholder="Enter Subject"
        />

        <div id={style.buttonBox}>
          <button onClick={addnewQuestion}>Add</button>
          <button onClick={handleGoBack}>Go back</button>
        </div>
      </div>
    </>
  );
}

export default AddQuestion;

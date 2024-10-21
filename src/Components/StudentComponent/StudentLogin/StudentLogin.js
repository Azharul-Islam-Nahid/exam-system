import style from "./StudentLogin.module.css";
import { NavLink, useHistory } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function StudentLogin() {
    const [user, setUser] = useState({
        user_email: "",
        user_password: ""
    });

    const history = useHistory(); // For navigation

    function onTextFieldChange(e) {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    }

    async function handleLogin() {
        try {
            const response = await axios.get("http://localhost:3333/user");
            const users = response.data;

            // Check if a user exists with the given email and password
            const foundUser = users.find(
                (u) =>
                    u.user_email.toLowerCase() === user.user_email.toLowerCase() &&
                    u.user_password === user.user_password
            );

            if (foundUser) {
                // Login successful
                alert("Login successful");
                sessionStorage.setItem("user", user.user_email);
                history.push("/StudentDashboard");
            } else {
                // Wrong credentials
                alert("Wrong User Email or password");
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("An error occurred during login. Please try again.");
        }
    }

    return (
        <div id={style.container}>
            <div id={style.containerHeadingBox}>
                <h1>Student Login</h1>
            </div>

            <div id={style.emailBox}>
                <label htmlFor="email">
                    Email
                    <input
                        name="user_email"
                        onChange={(e) => onTextFieldChange(e)}
                        type="text"
                        id={style.email}
                    />
                </label>
            </div>

            <div id={style.passwordBox}>
                <label htmlFor="password">
                    Password
                    <input
                        name="user_password"
                        onChange={(e) => onTextFieldChange(e)}
                        type="password"
                        id={style.password}
                    />
                </label>
            </div>

            <div id={style.loginContainer}>
                <button id={style.login} onClick={handleLogin}>
                    Login
                </button>
            </div>

            <div id={style.signup}>
                New to Portal? <NavLink exact to="/StudentSignup"> Register</NavLink>
                <NavLink id={style.goBackLink} exact to="/"> Go Back</NavLink>
            </div>
        </div>
    );
}

export default StudentLogin;

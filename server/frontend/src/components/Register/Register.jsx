import React, { useState } from "react";
import "./Register.css";
import user_icon from "../assets/person.png";
import email_icon from "../assets/email.png";
import password_icon from "../assets/password.png";
import close_icon from "../assets/close.png";

const Register = () => {
  // State variables for form inputs
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setlastName] = useState("");

  // Redirect to home
  const gohome = () => {
    window.location.href = window.location.origin;
  };

  // Handle form submission
  const register = async (e) => {
    e.preventDefault();

    let register_url = window.location.origin + "/djangoapp/register";

    // Send POST request to register endpoint
    const res = await fetch(register_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: userName,
        password: password,
        firstName: firstName,
        lastName: lastName,
        email: email,
      }),
    });

    const json = await res.json();
    if (json.status) {
      // Save username in session and reload home
      sessionStorage.setItem("username", json.userName);
      window.location.href = window.location.origin;
    } else if (json.error === "Already Registered") {
      alert("The user with same username is already registered");
      window.location.href = window.location.origin;
    } else {
      alert("The user could not be registered.");
    }
  };

  return (
    <div className="register_container">
      <div className="header">SignUp</div>

      <div
        onClick={gohome}
        style={{
          justifyContent: "space-between",
          alignItems: "flex-end",
          display: "flex",
          marginRight: "10px",
          cursor: "pointer",
        }}
      >
        <img src={close_icon} alt="close" className="img_icon" />
      </div>

      <hr />

      <form className="inputs" onSubmit={register}>
        <div className="input">
          <img src={user_icon} alt="username" className="img_icon" />
          <input
            className="input_field"
            type="text"
            placeholder="User Name"
            required
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>

        <div className="input">
          <img src={user_icon} alt="first name" className="img_icon" />
          <input
            className="input_field"
            type="text"
            placeholder="First Name"
            required
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div className="input">
          <img src={user_icon} alt="last name" className="img_icon" />
          <input
            className="input_field"
            type="text"
            placeholder="Last Name"
            required
            onChange={(e) => setlastName(e.target.value)}
          />
        </div>

        <div className="input">
          <img src={email_icon} alt="email" className="img_icon" />
          <input
            className="input_field"
            type="email"
            placeholder="Email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input">
          <img src={password_icon} alt="password" className="img_icon" />
          <input
            className="input_field"
            type="password"
            placeholder="Password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="submit_panel">
          <button className="submit" type="submit">
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;

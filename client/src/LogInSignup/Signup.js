import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect, useContext } from "react";
import "./signup.css";
import { NavLink, useNavigate } from "react-router-dom";
import { authdata } from "../context/ContextProvider";

function Signup() {
  const { loggedIn, setLoggedIn, userId, setUserId } = useContext(authdata);

  const navigate = useNavigate();
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
  });
  console.log(signUpData);

  const addSignUpData = (e) => {
    const { name, value } = e.target;
    console.log(e.target.value);
    console.log({ name: value });
    setSignUpData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const sendSignUpData = async (e) => {
    e.preventDefault();
    const { name, email, password } = signUpData;

    const res = await fetch("http://localhost:5001/signupuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const data = await res.json();
    console.log(data);

    if (res.status === 422 || !data) {
      alert("Registration failed");
    } else {
      console.log("Registration successfully");
      navigate("/login");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("userId")) {
      navigate("/");
    }
  }, [loggedIn]);

  return (
    <>
      <section className="vh-100">
        <div className="container-fluid h-custom">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-md-9 col-lg-6 col-xl-5">
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                className="img-fluid"
                alt="Sample image"
              />
            </div>
            <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
              <form className="mt-5" method="POST">
                {/* <!-- Email input --> */}
                <div className="form-outline mb-4">
                  <input
                    type="name"
                    id="formName"
                    className="form-control form-control-lg"
                    placeholder="Enter name"
                    value={signUpData.name}
                    name="name"
                    onChange={addSignUpData}
                  />
                  <label className="form-label" htmlFor="form3Example3">
                    Name
                  </label>
                </div>
                <div className="form-outline mb-4">
                  <input
                    type="email"
                    id="formEmail"
                    className="form-control form-control-lg"
                    placeholder="Enter a valid email address"
                    value={signUpData.email}
                    name="email"
                    onChange={addSignUpData}
                  />
                  <label className="form-label" htmlFor="form3Example3">
                    Email address
                  </label>
                </div>

                {/* <!-- Password input --> */}
                <div className="form-outline mb-3">
                  <input
                    type="password"
                    id="formPassword"
                    className="form-control form-control-lg"
                    placeholder="Enter password"
                    value={signUpData.password}
                    onChange={addSignUpData}
                    name="password"
                  />
                  <label className="form-label" htmlFor="form3Example4">
                    Password
                  </label>
                </div>

                <div className="text-center text-lg-start mt-4 pt-2">
                  <button
                    type="button bt"
                    className="btn btn-dark btn-lg"
                    onClick={sendSignUpData}
                  >
                    SignUp
                  </button>
                  <p className="small fw-bold mt-2 pt-1 mb-0">
                    You have already account?{" "}
                    <NavLink to="/login" className="link-danger">
                      Login
                    </NavLink>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Signup;

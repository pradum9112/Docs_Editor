import React, { useState, useEffect, useContext } from "react";
import "./signup.css";
import { NavLink, useNavigate } from "react-router-dom";
import { authdata } from "../context/ContextProvider";
function Login() {
  const { loggedIn, setLoggedIn, userId, setUserId } = useContext(authdata);
  const [loginUserdata, setLoginUserdata] = useState({
    email: "",
    password: "",
  });
  console.log(loginUserdata);

  const addLoginUserdata = (e) => {
    const { name, value } = e.target;
    setLoginUserdata(() => {
      return {
        ...loginUserdata,
        [name]: value,
      };
    });
  };
  const navigate = useNavigate();
  const sendLogInData = async (e) => {
    e.preventDefault();
    const { email, password } = loginUserdata;

    const res = await fetch("http://localhost:5001/loginuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await res.json();
    if (res.status == 422 || !data) {
      console.log("logedIn failed");
    } else {
      console.log("logedIn successfully");
      setLoginUserdata({ ...loginUserdata, email: "", password: "" });
      localStorage.setItem("userId", data._id);
      setUserId(data._id);
      setLoggedIn(true);
      navigate("/");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("userId")) {
      navigate("/");
    }
  }, [loggedIn]);

  return (
    <>
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
                <form method="POST">
                  {/* <!-- Email input --> */}
                  <div className="form-outline mb-4">
                    <input
                      type="email"
                      id="formEmail"
                      className="form-control form-control-lg"
                      placeholder="Enter a valid email address"
                      value={loginUserdata.email}
                      name="email"
                      onChange={addLoginUserdata}
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
                      value={loginUserdata.password}
                      onChange={addLoginUserdata}
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
                      onClick={sendLogInData}
                    >
                      Login
                    </button>
                    <p className="small fw-bold mt-2 pt-1 mb-0">
                      Don't have an account?{" "}
                      <NavLink to="/signup" className="link-danger">
                        Register
                      </NavLink>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </>
    </>
  );
}

export default Login;

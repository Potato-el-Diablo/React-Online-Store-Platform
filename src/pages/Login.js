import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom"
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import {  signInWithEmailAndPassword   } from 'firebase/auth';
import { auth } from './firebase';
import { isValidEmail } from '../functions/SignupValidation';
import {toast} from "react-toastify";
const isValidPassword = (password) => {
    // Add your validation rules for the password, e.g., minimum length, required characters, etc.
    return password.trim().length >= 6;
};


const Login = () => {
    // Login functionality here
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onLogin = (e) => {
        e.preventDefault();

        if (!isValidEmail(email)) {
            toast.error("Invalid email address. Please provide a valid email address.");
            return;
        }

        if (!isValidPassword(password)) {
            toast.error("Invalid password. Password must be at least 6 characters long.");
            return;
        }

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                navigate("/");
                //Not an error
                toast.success("Login Successful")
                console.log(user);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                toast.error(error.message)
                console.log(errorCode, errorMessage);
            });
    };

    return (
        <>
            <Meta title={"Login"}/>
            <BreadCrumb title="Login"/>
            <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/js/bootstrap.min.js"
                    integrity="sha384-Atwg2Pkwv9vp0ygtn1JAojH0nYbwNJLPhwyoVbhoPwBhjQPR5VtM2+xf0Uwh9KtT"
                    crossOrigin="anonymous"></script>

            <div  className="login-wrapper">
                <div className="row">
                        <div className= "col-12">
                            <div className= "auth-card">
                                <h3 className="text-center"> Login</h3>
                                <form action="" className="d-flex flex-column gap-15" onSubmit={onLogin}>
                                    <div>
                                        <input id="email-address"
                                               name="Email"
                                               type="Email"
                                               placeholder="Email address"
                                               className="form-control"
                                               onChange={(e)=>setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <input id="password"
                                               name="password"
                                               type="password"
                                               placeholder="Password"
                                               onChange={(e)=>setPassword(e.target.value)}
                                               className="form-control"
                                        />
                                    </div>
                                    <div>
                                        <Link to ="/forgot-password"> Forgot Password?</Link>

                                        <div className="d-flex justify-content-center gap- align-items-center">
                                            <button className="button" type="submit">Login</button>

                                            <div className="dropdown">
                                                <button className="button dropdown-toggle" type="button"
                                                        data-bs-toggle="dropdown">Sign Up
                                                    </button>
                                                <ul className="dropdown-menu">
                                                    <li><a className="dropdown-item" href="buyerregistration">As a Buyer</a></li>
                                                    <li><a className="dropdown-item" href="sellerregistration">As a Seller</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
import React, {useState} from 'react';
import Meta from "../components/Meta";
import BreadCrumb from "../components/BreadCrumb";
import {useNavigate} from "react-router-dom";
import {  createUserWithEmailAndPassword  } from 'firebase/auth';
import { auth } from './firebase';
import { isValidName, isValidEmail, isValidPassword, doPasswordsMatch, isValidPhoneNumber } from '../functions/SignupValidation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {saveBuyerToFirestore} from "../functions/firestoreFunctions";



const SignupBuyer = () => {
    const navigate = useNavigate();

    //Usestates for setting email, password,password confirmation, name and mobile number
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [mobilenumber, setNumber] = useState('');

    //When the sign up button is clicked, this is the event handler
    const onSubmit = async (e) => {
        e.preventDefault()

        // Check input values for validation
        if (!isValidName(name)) {
            toast.error('Invalid name. Please provide a valid name.');
            return;
        }

        if (!isValidEmail(email)) {
            toast.error('Invalid email address. Please provide a valid email address.');
            return;
        }

        if (!isValidPassword(password)) {
            toast.error('Invalid password. Password must be at least 6 characters long.');
            return;
        }

        if (!isValidPhoneNumber(mobilenumber)) {
            toast.error('Invalid phone number. Please provide a valid phone number.');
            return;
        }
        if (!doPasswordsMatch(password, confirmPassword)) {
            toast.error('Passwords do not match. Please make sure you have entered the same password twice.');
            return;
        }

        // Continue with the signup process if validation passes
        await createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log(user);

                // save the user's details to a Firestore database using the saveBuyerToFirestore function
                await saveBuyerToFirestore(user, name, mobilenumber)
                toast.success('User created successfully!'); // Show the success message
                setTimeout(() => {
                    navigate('/'); // Navigate to the home page after a 1 second delay
                }, 1000);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                // Display the error message as a toast
                toast.error(errorMessage);
            });
    }

    //rendering begins here
    return (
        <>

            <Meta title = {"Sign Up"} />
            <BreadCrumb title = "Sign Up"/>
            <div className="login-wrapper">
                <div className="row">
                    <div className= "col-12">
                        <div className= "auth-card">
                            <h3 className="text-center"> Sign up as a Buyer
                            </h3>
                            <form action="" className="d-flex flex-column gap-15"
                                  onSubmit={onSubmit}>
                                <div>
                                    <input type="name"
                                           label="Name"
                                           value={name}
                                           onChange={(e) => setName(e.target.value)}
                                           placeholder="Name"
                                           className="form-control"
                                           size="20"
                                    />
                                </div>
                                <div>
                                    <input type="email"
                                           label="Email address"
                                           value={email}
                                           onChange={(e) => setEmail(e.target.value)}
                                           placeholder="Email address"
                                           className="form-control"
                                    />
                                </div>
                                <div>
                                    <input type="tel"
                                           label="Mobile Number"
                                           value={mobilenumber}
                                           onChange={(e) => setNumber(e.target.value)}
                                           placeholder="Phone Number"
                                           className="form-control"
                                    />
                                </div>
                                <div>
                                    <input type="password"
                                           label="Password"
                                           value={password}
                                           onChange={(e) => setPassword(e.target.value)}
                                           placeholder="Password (at least 6 characters)"
                                           className="form-control"
                                    />
                                </div>
                                <div className="mt-1" style={{fontSize:12}}>
                                    Passwords must be at least 6 characters.
                                </div>
                                <div>
                                    <input type="password"
                                           name="re-enter password"
                                           value={confirmPassword}
                                           onChange={(e) => setConfirmPassword(e.target.value)}
                                           placeholder="Re-enter password"
                                           className="form-control"
                                    />
                                </div>
                                <div>
                                    <div className="d-flex justify-content-center gap-15 align-items-center">
                                        <button
                                            className="button"
                                            type="submit"
                                        >
                                            Sign up
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};
export default SignupBuyer

import React, {useState} from "react"
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import {useNavigate} from "react-router-dom";
import {  createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider  } from 'firebase/auth';
import { auth } from './firebase';
import { isValidName, isValidEmail, isValidPassword, doPasswordsMatch, isValidPhoneNumber } from '../functions/SignupValidation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {doesEmailExistInSellerCollection, saveSellerToFirestore} from '../functions/firestoreFunctions';




/*lastest commit*/
const SellerRegistration = () => {
    const navigate = useNavigate();

    // Usestates for setting personal and business details
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [mobilenumber, setNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [companyEmail, setCompanyEmail] = useState('');
    const [companyPhone, setCompanyPhone] = useState('');
    const [acceptTsAndCs, setAcceptTsAndCs] = useState(false);


    // When the register button is clicked, this is the event handler
    const onSubmit = async (e) => {
        e.preventDefault();

        // Check input values for validation
        if (!isValidName(firstName) || !isValidName(lastName)) {
            toast.error('Invalid first name or last name. Please provide valid names.');
            return;
        }

        if (!isValidEmail(email)) {
            toast.error('Invalid personal email address. Please provide a valid email address.');
            return;
        }

        if (!isValidPhoneNumber(mobilenumber)) {
            toast.error('Invalid personal phone number. Please provide a valid phone number.');
            return;
        }

        if (!isValidPassword(password)) {
            toast.error('Invalid password. Password must be at least 6 characters long.');
            return;
        }

        if (!doPasswordsMatch(password, confirmPassword)) {
            toast.error('Passwords do not match. Please make sure you have entered the same password twice.');
            return;
        }

        if (!isValidName(companyName)) {
            toast.error('Invalid company name. Please provide a valid company name.');
            return;
        }

        if (!isValidEmail(companyEmail)) {
            toast.error('Invalid company email address. Please provide a valid email address.');
            return;
        }

        if (!isValidPhoneNumber(companyPhone)) {
            toast.error('Invalid company phone number. Please provide a valid phone number.');
            return;
        }
        if (!acceptTsAndCs) {
            toast.error('Please accept the Terms and Conditions to proceed.');
            return;
        }
        const emailExists = await doesEmailExistInSellerCollection(email, 'email');
        if (emailExists) {
            toast.error('An account already exists with this email. Please use a different email.');
            return;
        }

        const companyEmailExists = await doesEmailExistInSellerCollection(companyEmail, 'companyEmail');
        if (companyEmailExists) {
            toast.error('An account already exists with this company email. Please use a different email.');
            return;
        }

        // Continue with the signup process if validation passes
        // (Replace the createUserWithEmailAndPassword() call with your seller registration logic)
        await createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log(user);

                await saveSellerToFirestore(user, firstName, lastName, mobilenumber, companyName, companyPhone, companyEmail);
                toast.success('Seller account created successfully!'); // Show the success message
                setTimeout(() => {
                    navigate('/'); // Navigate to the home page after a 1-second delay
                }, 1000);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                // Display the error message as a toast
                toast.error(errorMessage);
            });
    };

    // eslint-disable-next-line no-unused-vars
    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log(user);

            // Here, you can add code to handle successful sign-in with Google.
            // For example, you might create a new seller account in your database
            // using the user's Google account information.

            toast.success("Seller account created successfully with Google!");
            setTimeout(() => {
                navigate("/");
            }, 1000);
        } catch (error) {
            console.log(error.code, error.message);
            toast.error(error.message);
        }
    };


    return (
        <>
         <Meta title = {"Sign Up"} />
         <BreadCrumb title = "Sign Up"/>

            <div className="login-wraper py-5 home-wrapper-2">
                <div className="row">
                    <div className= "col-12">
                        <div className= "register-card">
                            <h3 className="text-center mb-3" > Create Business Account </h3>
                            <form action="" className="d-flex flex-column gap-15" onSubmit={onSubmit}>
                            <link rel="stylesheet" type="text/css"
                                      href="//fonts.googleapis.com/css?family=Open+Sans"/>
                                {/*the Personal details section*/}
                                <div className="mt-2" style={{fontSize:18, fontWeight:"bold"}}>
                                    Personal details
                                </div>
                                <div className="mt-1">
                                    <input type="text"
                                           name ="firstname"
                                           value={firstName}
                                           onChange={(e) => setFirstName(e.target.value)}
                                           placeholder="First Name"
                                           className="form-control"
                                    />
                                </div>
                                <div className="mt-1">
                                    <input type="text"
                                           name ="lastname"
                                           value={lastName}
                                           onChange={(e) => setLastName(e.target.value)}
                                           placeholder="Last Name"
                                           className="form-control"
                                    />
                                </div>
                                <div className="mt-1">
                                    <input type="text"
                                           name ="email"
                                           value={email}
                                           onChange={(e) => setEmail(e.target.value)}
                                           placeholder="Email"
                                           className="form-control"
                                           data-testid="personal-email"
                                    />
                                </div>
                                <div className= "mt-1">
                                        <input type="tel"
                                               label="Mobile Number"
                                               value={mobilenumber}
                                               onChange={(e) => setNumber(e.target.value)}
                                               placeholder="Phone Number"
                                               className="form-control"
                                        />
                                </div>
                                <div className="mt-1">
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
                                <div className="mt-1">
                                    <input type="password"
                                           name="re-enter password"
                                           value={confirmPassword}
                                           onChange={(e) => setConfirmPassword(e.target.value)}
                                           placeholder="Re-enter password"
                                           className="form-control"
                                    />
                                </div>

                                <div className="mt-2" style={{fontSize:18, fontWeight:"bold"}}>
                                    Business details
                                </div>

                                <div className="mt-1">
                                    <input type="text"
                                           name="company name"
                                           value={companyName}
                                           onChange={(e) => setCompanyName(e.target.value)}
                                           placeholder="Company Name"
                                           className="form-control"
                                    />
                                </div>
                                <div className="mt-1">
                                    <input type="text"
                                           name="company email"
                                           value={companyEmail}
                                           onChange={(e) => setCompanyEmail(e.target.value)}
                                           placeholder="Company Email"
                                           className="form-control"
                                           data-testid="company-email"
                                    />
                                </div>
                                <div className= "mt-1">
                                    <input type="text"
                                           name="company number"
                                           value={companyPhone}
                                           onChange={(e) => setCompanyPhone(e.target.value)}
                                           placeholder="Company Phone"
                                           className="form-control"
                                    />
                                </div>

                                {/*checkbox*/}

                                    <div className= "mt-3">
                                        <label style={{fontSize:11,}}>
                                            <input type="checkbox"
                                                   checked={acceptTsAndCs}
                                                   onChange={(e) => setAcceptTsAndCs(e.target.checked)}
                                            /> I accept the Terms and Conditions and consent to the privacy policy of Potato El Diablo
                                        </label>
                                    </div>


                                <div>
                                    <div className="mt-0 d-flex justify-content-center gap-15 align-items-center">
                                        <button className="button border-0" style={{blockSize:"45px", width:"500px", backgroundColor:"#232f3e",}} type="submit"> Register </button>
                                    </div>
                                </div>
                                <div className="mt-4" style={{fontSize:10, color: "cadetblue"}}>
                                        I would like to receive newsletters and discount offers via email
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};

export default SellerRegistration;

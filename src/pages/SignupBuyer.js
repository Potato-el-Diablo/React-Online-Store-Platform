import React, {useState} from 'react';
import Meta from "../components/Meta";
import BreadCrumb from "../components/BreadCrumb";
import {useNavigate} from "react-router-dom";
import {  createUserWithEmailAndPassword  } from 'firebase/auth';
import { auth } from './firebase';

/*lastest commit*/
const SignupBuyer = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [mobilenumber, setNumber] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault()

        await createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log(user);
                navigate("/login")
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                // ..
            });


    }
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
                            <form action="" className="d-flex flex-column gap-15">
                                <div>
                                    <input type="name"
                                           label="Name"
                                           value={name}
                                           onChange={(e) => setName(e.target.value)}
                                           required
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
                                           required
                                           placeholder="Email address"
                                           className="form-control"
                                    />
                                </div>
                                <div>
                                    <input type="tel"
                                           label="Mobile Number"
                                           value={mobilenumber}
                                           onChange={(e) => setNumber(e.target.value)}
                                           required
                                           placeholder="Phone Number"
                                           className="form-control"
                                    />
                                </div>
                                <div>
                                    <input type="password"
                                           label="Password"
                                           value={password}
                                           onChange={(e) => setPassword(e.target.value)}
                                           required
                                           placeholder="Password (at least 6 characters)"
                                           className="form-control"
                                    />
                                </div>
                                <div className="mt-1" style={{fontSize:12}}>
                                    Passwords must be at least 6 characters.
                                </div>
                                <div>
                                    <input type = "password"
                                           name = "re-enter password"
                                           placeholder="Re-enter password"
                                           className="form-control"
                                    />
                                </div>
                                <div>
                                    <div className="d-flex justify-content-center gap-15 align-items-center">
                                        <a
                                            onClick={onSubmit}
                                            href="/" className="button" role="button" type="submit">Sign up</a>
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

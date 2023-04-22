import React from "react"
import {Link} from "react-router-dom"
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import firebase from "firebase/app";
import "firebase/auth";


/*lastest commit*/

const ForgotPassword = () => {

    // the useState requires you to disable-next-line no-undef
    const [email, setEmail] = useState("");

    // utilizes firebases password reset email protocol
    const handleFormSubmit = (event) => {
        event.preventDefault();
        firebase
            .auth()
            .sendPasswordResetEmail(email)
            .then(() => {
                // Password reset email sent successfully
                alert("Password reset email sent!");
            })
            .catch((error) => {
                // An error occurred
                console.error(error);
                alert("Error sending password reset email");
            });
    };
        
    // this takes in the email input
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    return (
        <>
            <Meta title={"Forgot Password"}/>
            <BreadCrumb title="Forgot Password"/>
            <div  className="login-wrapper py-5 home-wrapper-2">
                <div className="row">
                    <div className= "col-12">
                        <div className= "auth-card">
                            <h3 className="text-center mt-2 mb-3"> Reset Your Password</h3>
                            <p className="text-center mt-2 mb-3">
                                We will send you an email to reset your password
                            </p>
                            <form
                                onSubmit={handleFormSubmit} // passes through the form from firebase protocol
                                className="d-flex flex-column gap-15"
                            >
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    className="form-control"
                                    value={email}
                                    onChange={handleEmailChange} //takes the email that has been entered and passes it through the firebase protocol
                                />
                                <div>
                                    <div className="mt-3 d-flex justify-content-center gap-15 align-items-center">
                                        <button className="button border-0" type="submit">
                                            Submit
                                        </button>
                                       <Link to="/login">Cancel</Link>
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

export default ForgotPassword;

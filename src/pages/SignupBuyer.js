import React from 'react';
import Meta from "../components/Meta";
import BreadCrumb from "../components/BreadCrumb";



const SignupBuyer = () => {
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
                                    <input type="text"
                                           name ="name"
                                           id="name"
                                           placeholder="Name"
                                           className="form-control"
                                           size="20"
                                    />
                                </div>
                                <div>
                                    <input type="email"
                                           name ="email"
                                           placeholder="Email"
                                           className="form-control"
                                    />
                                </div>
                                <div>
                                    <input type="tel"
                                           name ="mobile"
                                           placeholder="Mobile Number"
                                           className="form-control"
                                    />
                                </div>
                                <div>
                                    <input type = "password"
                                           name = "password"
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
                                           placeholder="Re enter password"
                                           className="form-control"
                                    />
                                </div>
                                <div>
                                    <div className="d-flex justify-content-center gap-15 align-items-center">
                                        <a href="home" className="button" role="button" type="submit">Sign up</a>
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

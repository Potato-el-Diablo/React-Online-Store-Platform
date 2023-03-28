import React from "react"
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import {Link} from "react-router-dom";

const SellerRegistration = () => {
    return (
        <>
         <Meta title = {"Sign Up"} />
         <BreadCrumb title = "Sign Up"/>

            <div className="login-wraper py-5 home-wrapper-2">
                <div className="row">
                    <div className= "col-12">
                        <div className= "register-card">
                            <h3 className="text-center mb-3" > Create Business Account </h3>
                            <form action="" className="d-flex flex-column gap-15">

                                <link rel="stylesheet" type="text/css"
                                      href="//fonts.googleapis.com/css?family=Open+Sans"/>
                                <div className="mt-2 d-flex justify-content-center gap-15 align-items-center">
                                    <div className="google-btn">
                                        <div className="google-icon-wrapper">
                                            <img className="google-icon"
                                                 src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"/>
                                        </div>
                                        <p className="btn-text"><b>Register with Google</b></p>
                                    </div>
                                </div>

                                <div className="mt-1" style={{fontSize:12, color: "lightgrey"}}>
                                    ───────────────────Or───────────────────
                                </div>

                                <div className="mt-2" style={{fontSize:18, fontWeight:"bold"}}>
                                    Personal details
                                </div>
                                <div className="mt-1">
                                    <input type="text"
                                           name ="firstname"
                                           placeholder="First Name"
                                           className="form-control"
                                    />
                                </div>
                                <div className="mt-1">
                                    <input type="text"
                                           name ="lastname"
                                           placeholder="Last Name"
                                           className="form-control"
                                    />
                                </div>
                                <div className="mt-1">
                                    <input type="email"
                                           name ="email"
                                           placeholder="Email"
                                           className="form-control"
                                    />
                                </div>
                                <div className= "mt-1">
                                        <input type="tel"
                                               name ="mobile"
                                               placeholder="Mobile Number"
                                               className="form-control"
                                        />
                                </div>
                                <div className="mt-1">
                                    <input type = "password"
                                           name = "password"
                                           placeholder="Password   (at least 6 characters)"
                                           className="form-control"
                                    />
                                </div>
                                <div className="mt-1" style={{fontSize:12}}>
                                    Passwords must be at least 6 characters.
                                </div>
                                <div className="mt-1">
                                    <input type = "password"
                                           name = "re-enter-password"
                                           placeholder="Re-enter Password"
                                           className="form-control"
                                    />
                                </div>

                                <div className="mt-2" style={{fontSize:18, fontWeight:"bold"}}>
                                    Business details
                                </div>

                                <div className="mt-1">
                                    <input type="text"
                                           name ="companyName"
                                           placeholder="Company Name"
                                           className="form-control"
                                    />
                                </div>
                                <div className="mt-1">
                                    <input type="email"
                                           name ="email"
                                           placeholder="Email"
                                           className="form-control"
                                    />
                                </div>
                                <div className= "mt-1">
                                    <input type="tel"
                                           name ="companyMobile"
                                           placeholder="Telephone Number"
                                           className="form-control"
                                    />
                                </div>

                                <form>
                                    <div className= "mt-3">
                                        <label style={{fontSize:11,}}>
                                            <input type="checkbox" /> I want to receive Daily Deals and General newsletters
                                        </label>
                                    </div>
                                </form>

                                <div>
                                    <div className="mt-0 d-flex justify-content-center gap-15 align-items-center">
                                        <button className="button border-0" style={{blockSize:"45px", width:"500px", backgroundColor:"#232f3e",}} type="submit"> Register </button>
                                    </div>
                                </div>
                                <div className="mt-4" style={{fontSize:10, color: "cadetblue"}}>
                                        By creating an account, you agree to Potato el Diablo's Conditions of use and Privacy Notice.
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

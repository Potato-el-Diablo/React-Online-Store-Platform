import React from "react"
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import {Link} from "react-router-dom";

const RegisterSeller = () => {
    return (
        <>
            <Meta title = {"Sign Up"} />
            <BreadCrumb title = "Sign Up"/>

            <div className="login-wraper home-wrapper-2">
                <div className="row">
                    <div className= "col-12">
                        <div className= "login-card">
                            <h3 className="text-center"> Sign Up
                            </h3>
                            <form action="" className="d-flex flex-column gap-15">
                                <div>
                                    <input type="text"
                                           name ="name"
                                           placeholder="Name"
                                           className="form-control"
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
                                           placeholder="Password"
                                           className="form-control"
                                    />
                                </div>
                                <div>
                                    <div className="d-flex justify-content-center gap-15 align-items-center">
                                        <button className="button border-0" type="submit"> Sign Up </button>
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

export default RegisterSeller;
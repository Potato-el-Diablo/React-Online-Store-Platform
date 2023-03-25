import React from "react";
import {Link} from "react-router-dom"
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
const Login = () => {
    return (
        <>
           <Meta title={"Login"}/>
            <BreadCrumb title="Login"/>

            <div className="login-wraper home-wrapper-2">
                <div className="row">
                    <div className= "col-12">
                        <div className= "login-card">
                            <h3 className="text-center"> Login
                            </h3>
                            <form action="" className="d-flex flex-column gap-15">
                                <div>
                                    <input type="email"
                                           name ="email"
                                           placeholder="Password"
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
                                    <Link to ="/forgot-password"> Forgot Password?
                                    </Link>

                                    <div className="d-flex justify-content-center gap-15 align-items-center">
                                        <button className="button border-0" type="submit"> Login </button>
                                        <Link to="/RegisterSeller" className="button register"> RegisterSeller</Link>
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
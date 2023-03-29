import React from "react";
import {Link} from "react-router-dom"
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
/*lastest commit*/
const Login = () => {
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
                                <form action="" className="d-flex flex-column gap-15">
                                    <div>
                                        <input type="email"
                                               name ="email"
                                               placeholder="Email"
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
                                        <Link to ="/forgot-password"> Forgot Password?</Link>

                                        <div className="d-flex justify-content-center gap- align-items-center">
                                            <a href="/" className="button" role="button" type="submit" >login</a>


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
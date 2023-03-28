import React from "react";
import {BsSearch} from "react-icons/bs";

const Footer = () => {
    return (

    <>
        <footer className="py-4">{/*one hr 14 minutes*/}
            <div className="container-xxl">
                <div className="row align-items-center">
                    <div className="col-5">
                        <div className="footer-top-data d-flex gap-30 align-items-center">
                            <img src="/image/newsletter.png" alt="newsletter"/>
                            <h2 className="mb-0 text-white">Sign up for newsletter</h2>
                        </div>
                    </div>
                    <div className="col-7">
                        <div className="input-group">
                            <input type="text"
                                   className="form-control py-1"
                                   placeholder="Enter email address here"
                                   aria-label="Enter email address here"
                                   aria-describedby="basic-addon2"/>
                            <span className="input-group-text p-2" id="basic-addon2">
                                    Subscribe
                                </span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
        <footer className="py-4">

        </footer>
        <footer className="py-4">
            <div className="container-xxl">
                <div className="row">
                    <div className="col-12">
                        <p className="text-center mb-0 text-white">
                            &copy; {new Date().getFullYear()} Powered by Potato El Diablo
                        </p>
                    </div>
                </div>
            </div>
        </footer>

    </>
  );
};

export default Footer;
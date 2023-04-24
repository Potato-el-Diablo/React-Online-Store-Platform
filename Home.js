import React from "react";
import {Link,NavLink} from "react-router-dom"
//import { auth } from './firebase';
/*lastest commit*/
const Home = () => {
    return <>
    <section className="home-wrapper-1 py-5">
        <div className="container-xxl">
            <div className="row">
                <div className="col-6">
                    <div className="main-banner position-relative">
                        <img src="images/main-banner-1.jpg"
                             className="img-fluid rounded-3 "
                             alt="main banner"
                        />
                        <div className="main-banner-content position-absolute">
                            <h4>SUPERCHARGED FOR PROS.</h4>
                            <h5>IPAD S13+ PRO</h5>
                            <p> FROM R4999 or R450/mo.</p>
                            <Link className="button">BUY NOW</Link>
                        </div>
                    </div>
                </div>
                <div className="col-6">
                    <div className="d-flex flex-wrap gap-10 justify-content-between align-items-center">
                        {/*small banner is the smaller block with image of advertised products*/}
                        <div className="small-banner position-relative ">
                            <img src="/images/catbanner-01.jpg"
                                 className="img-fluid rounded-3 "
                                 alt="main banner"
                            />
                            {/*the code for the image within this block is  above
                            and the text is the <div> below*/}
                            <div className="small-banner-content position-absolute">
                                <h4>Best Seller.</h4>
                                <h5>Asus Laptops</h5>
                                <p> FROM R6999 <br/>or R499/mo.</p>
                            </div>
                        </div>
                        {/*small block number 2*/}
                        <div className="small-banner position-relative">
                        <img src="/images/catbanner-02.jpg"
                             className="img-fluid rounded-3 "
                             alt="main banner"
                        />
                        <div className="small-banner-content position-absolute">
                            <h4>NEW ARRIVAL</h4>
                            <h5>Smart Watch</h5>
                            <p> FROM R1999 <br/>or R349/mo.</p>
                        </div>
                    </div>
                        {/*small banner number 3*/}
                        <div className="small-banner position-relative">
                        <img src="/images/catbanner-03.jpg"
                             className="img-fluid rounded-3 "
                             alt="main banner"
                        />
                        <div className="small-banner-content position-absolute">
                            <h4>NEW ARRIVAL</h4>
                            <h5>Buy IPad Air</h5>
                            <p> FROM R4999 <br/>or R450/mo.</p>
                        </div>
                        </div>
                        {/*small banner number 4*/}
                         <div className="small-banner position-relative p-3">
                            <img src="/images/catbanner-04.jpg"
                                className="img-fluid rounded-3 "
                               alt="main banner"
                            />
                         <div className="small-banner-content position-absolute">
                                <h4>NEW ARRIVAL</h4>
                                <h5>JBL Headphones</h5>
                                <p> FROM R1299 <br/>or R199/mo.</p>
                            </div>
                        </div>
                    </div>
                </div> {/*end of small banner section*/}
            </div>
        </div>
    </section>
    <section className="home-wrapper-2 py-5">
        <div className="container-xxl">
            <div className="row">
                <div className="col-12">
                    <div className="services d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-15"><img src="/images/service.png" alt="services"/>
                        <div>
                            <h6>Free Shipping</h6>
                            <p className="mb-0">For all orders over R500</p>
                        </div>
                        </div>
                        <div className="d-flex align-items-center gap-15"><img src="/images/service-02.png" alt="services"/>
                        <div>
                            <h6>Daily Discounts</h6>
                            <p className="mb-0">Save up to 50% on products</p>
                        </div>
                        </div>
                        <div className="d-flex align-items-center gap-15"><img src="/images/service-03.png" alt="services"/>
                        <div>
                            <h6>24/7 Customer Support</h6>
                            <p className="mb-0">Our experts are ready to assist you</p>
                        </div>
                        </div>
                        <div className="d-flex align-items-center gap-15"><img src="/images/service-04.png" alt="services"/>
                        <div>
                            <h6>Affordable Prices</h6>
                            <p className="mb-0">Get Factory Default Prices</p>
                        </div>
                        </div>
                        <div className="d-flex align-items-center gap-15"><img src="/images/service-05.png" alt="services"/>
                        <div>
                            <h6>Secure Payments</h6>
                            <p className="mb-0">Safe and secure payment system</p>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <section className="home-wrapper-2 py-5">
        <div className="container-xxl">
            <div className="row">
                <div className="col-12">
                    <div className="categories d-flex justify-content-between flex-wrap align-items-center">
                        <div className="d-flex gap-30 align-items-center">
                            <div>
                                <h6>Home and Appliances</h6>
                                
                                <Link className="button" to="/product">Explore</Link>
                            </div>
                            <img src="/images/camera.jpg" alt="camera"/>
                        </div>
                        <div className="d-flex gap-30 align-items-center">
                            <div>
                                <h6>TV, Audio, and Media</h6>
                                
                                <Link className="button" to="/product">Explore</Link>
                            </div>
                            <img src="/images/tv.jpg" alt="camera"/>
                        </div>
                        <div className="d-flex gap-30 align-items-center">
                            <div>
                                <h6>Gaming</h6>
                                
                                <Link className="button" to="/product">Explore</Link>
                            </div>
                            <img src="/images/headphone.jpg" alt="headphone"/>
                        </div>
                        
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <div className="categories d-flex justify-content-between flex-wrap align-items-center">
                        <div className="d-flex gap-30 align-items-center">
                            <div>
                                <h6>Books and Courses</h6>
                              
                                <Link className="button" to="/product">Explore</Link>
                            </div>
                            <img src="/images/camera.jpg" alt="camera"/>
                        </div>
                        <div className="d-flex gap-30 align-items-center">
                            <div>
                                <h6>Cellphones and Smartwatches</h6>
                                
                                <Link className="button" to="/product">Explore</Link>
                            </div>
                            <img src="/images/tv.jpg" alt="camera"/>
                        </div>
                        <div className="d-flex gap-30 align-items-center">
                            <div>
                                <h6>Computers and Electronics</h6>
                                
                                <Link className="button" to="/product">Explore</Link>
                            </div>
                            <img src="/images/headphone.jpg" alt="headphone"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    </>;
};

export default Home ;
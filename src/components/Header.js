import React from "react";
import {NavLink, Link} from "react-router-dom";
import {BsSearch} from "react-icons/bs";

const Header = () => {
    return (
         <>
        {/* This header (line 8-22) is the top header with the hotline and free shipping text*/}
        <header className="header-top-strip py-3">
        <div className="container-xxl">
            <div className="row align-items-center">
                <div className="col-6">
                    <p className="text-white mb-0">Free Shipping For Orders Over R500 & free Returns</p>
                </div>
                <div className="col-6">
                    <p className="text-end text-white ">
                        Hotline:
                        <a className="text-white" href="tel:+27848297357">+27 84 829 7357</a>
                    </p>
                </div>
            </div>
        </div>
    </header>

        {/*Header with company logo (HotPotato), search bar, wishlist, login and cart*/}

        <header className="header-upper py-3" >
            <div className="container-xxl">
                <div className="row align-items-center"> {/*centers items in the vertically(vertically in the middle of the container)*/}
                    <div className="col-2">
                        <h2>
                            <Link className="text-white">HotPotato</Link>
                        </h2>
                    </div>
                    <div className="col-5">
                        {/* search bar here*/}
                        <div className="input-group">
                            <input type="text"
                                   className="form-control py-2"
                                   placeholder="Search Product Here"
                                   aria-label="Search Product Here"
                                   aria-describedby="basic-addon2"/>
                                <span className="input-group-text p-3" id="basic-addon2">
                                    <BsSearch className="fs-6"/>
                                </span>
                        </div>
                    </div>
                    <div className="col-5">
                        <div className="header-upper-links d-flex align-items-center justify-content-between">
                            {/*Compare products button (TO BE REMOVED IF NOT REPLACED WITH SOMETHING ELSE)*/}
                            <div>
                                <Link className="d-flex align-items-center gap text-white">
                                    <img src="/image/compare.svg" alt="compare"/>
                                    <p className="mb-0">
                                        Compare <br/> Products
                                    </p>
                                </Link>
                            </div>
                            <div>
                                <Link className="d-flex align-items-center gap text-white">
                                    <img src="image/wishlist.svg" alt="wishlist"/>
                                    <p className="mb-0">
                                        Favourite <br/> Wishlist
                                    </p>
                                </Link>
                            </div>
                            <div>
                                <Link className="d-flex align-items-center gap text-white">
                                    <img src="image/user.svg" alt="user"/>
                                    <p className="mb-0">
                                        <NavLink className="text-white" to = "login">Login <br/> My Account</NavLink>
                                    </p>
                                </Link>
                            </div>
                            <div>
                                {/*Cart*/}
                                <Link className="d-flex align-items-center gap text-white">
                                    <img src="image/cart.svg" alt="cart"/>
                                    <div className="d-flex flex-column">
                                        <span className="badge bg-white text-dark">0</span>
                                        <p className="mb-0">R650</p> {/* CART TOTAL DISPLAYED ON HEADER*/}
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>

             {/*header with Home, Our Store, Blogs and Contact */}
        <header className="header-bottom py-3">
            <div className="container-xxl">
                <div className="row">
                    <div className="col-12">
                        <div className="menu-bottom d-flex align-items-center gap-15">
                            <div>
                                {/*Dropdown button*/}
                                <div className="dropdown">
                                    <button className="btn btn-secondary dropdown-toggle bg-transparent border-0 gap-15 me-5 d-flex align-items-center" type="button"
                                            id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                        {/*Dropdown button text*/}
                                        <img src="image/menu.svg"/>
                                        <span className="me-5 d-inline-block">
                                        Shop categories
                                    </span>
                                    </button>
                                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                        {/*Items under dropdown list*/}
                                        <li><Link className="dropdown-item text-white" to="">Action</Link></li>
                                        <li><Link className="dropdown-item text-white" to="">Another action</Link></li>
                                        <li><Link className="dropdown-item text-white" to="">Something else here</Link></li>
                                    </ul>
                                </div>
                                {/*End of Dropdown button*/}
                            </div>
                            <div className="menu-links">
                                <div className="d-flex align-items-center gap-50">
                                    <NavLink className="text-white" to = "/">Home</NavLink>
                                    <NavLink className="text-white" to = "/">Orders</NavLink>
                                    <NavLink className="text-white" to = "ourstore">Our Store</NavLink>
                                    <NavLink className="text-white" to = "/contact">Contact</NavLink>
                                    <NavLink className="text-white" to = "/MyProducts">My Products</NavLink>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </header>
    </>
    );
};

export default Header;
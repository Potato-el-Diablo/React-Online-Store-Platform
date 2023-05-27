import { NavLink, Link, useNavigate } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import { auth, db } from "../pages/firebase";
import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useCartInfo } from './cartHooks';


const Header = () => {

    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const { cartItems, subtotal } = useCartInfo();


    // Function to handle search form submission
    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/search?q=${searchQuery}`);
    };

    // State to track if the user is logged in
    const [loggedIn, setLoggedIn] = useState(false);

    // State to track if the user is a seller
    // eslint-disable-next-line no-unused-vars
    const [isSeller, setIsSeller] = useState(false);

    // State to store the user's first name
    // eslint-disable-next-line no-unused-vars
    const [userName, setUserName] = useState('');

    // UseEffect hook to user authentication state changes such as logging in
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                setLoggedIn(true);
                // Check if the user is a seller
                const sellerRef = collection(db, "sellers");
                const q = query(sellerRef, where("uid", "==", user.uid));
                const querySnapshot = await getDocs(q);

                // If the user is a seller, set isSeller to true and store their first name
                if (!querySnapshot.empty) {
                    const sellerData = querySnapshot.docs[0];
                    setIsSeller(true);
                    setUserName(sellerData.data().firstName);
                } else {
                    setIsSeller(false);
                    // If the user is not a seller, check if they are a buyer
                    const buyerRef = collection(db, "buyers");
                    const q = query(buyerRef, where("uid", "==", user.uid));
                    const querySnapshot = await getDocs(q);
                    // If the user is a buyer, store their first name
                    if (!querySnapshot.empty) {
                        const buyerData = querySnapshot.docs[0];
                        const fullName = buyerData.data().name;
                        const firstName = fullName.split(" ")[0];
                        setUserName(firstName);
                    }
                }
            } else {
                // If the user is not logged in, reset states
                setLoggedIn(false);
                setIsSeller(false);
                setUserName("");
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);
    // UseEffect to log isSeller and userName states for debugging purposes
    useEffect(() => {
        console.log("Are you a seller? ", isSeller);
        console.log("What is your name?", userName);
    }, [isSeller, userName]);

    return (
        <>
            {/* This header (line 8-22) is the top header with the hotline and free shipping text*/}
            <header className="header-top-strip py-3" data-testid="header">
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
                                <Link className="text-white" to = "/">HotPotato</Link>
                            </h2>
                        </div>
                        <div className="col-5">
                            {/* search bar here*/}
                            <form onSubmit={handleSearch}>
                                <div className="input-group align-items-center d-flex">
                                    <input
                                        type="text"
                                        className="form-control search-input"
                                        placeholder="Search Product Here"
                                        aria-label="Search Product Here"
                                        aria-describedby="basic-addon2"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)} /* sets the search as query*/
                                    />
                                    <span className="input-group-text search-button py-3" id="basic-addon2">
                                        <button type="submit" className="border-0 bg-transparent">
                                            <BsSearch className="fs-6" />
                                        </button>
                                     </span>
                                </div>
                            </form>
                        </div>
                        <div className="col-5">
                            <div className="header-upper-links d-flex align-items-center justify-content-between">
                                {/*Compare products button (TO BE REMOVED IF NOT REPLACED WITH SOMETHING ELSE)*/}
                                <div>
                                    <Link className="d-flex align-items-center gap text-white">
                                        <img src="/images/compare.svg" alt="compare"/>
                                        <p className="mb-0">
                                            Compare <br/> Products
                                        </p>
                                    </Link>
                                </div>
                                <div>
                                    <Link className="d-flex align-items-center gap text-white" to="/wishlist">
                                        <img src="images/wishlist.svg" alt="wishlist"/>
                                        <p className="mb-0">
                                            Favourite <br/> Wishlist
                                        </p>
                                    </Link>
                                </div>
                                <div>
                                    <Link className="d-flex align-items-center gap text-white">
                                        <img src="images/user.svg" alt="user"/>
                                        <p className="mb-0">
                                            <NavLink className="text-white" to="login">
                                                {loggedIn ? (
                                                    <>
                                                        Logged In. <br /> Welcome {userName}
                                                    </>
                                                ) : (
                                                    <>
                                                        Login <br /> My Account
                                                    </>
                                                )}
                                            </NavLink>

                                        </p>
                                    </Link>
                                </div>
                                <div>
                                    {/*Cart*/}
                                    <Link className="d-flex align-items-center gap text-white">
                                        <img src="images/cart.svg" alt="cart"/>
                                        <div className="d-flex flex-column">
                                            <span className="badge bg-white text-dark">{cartItems.length}</span>
                                            <p className="mb-0">
                                                <NavLink className="text-white" to = "cart">R{subtotal.toFixed(2)}</NavLink>
                                            </p> {/* CART TOTAL DISPLAYED ON HEADER*/}
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
                                            {/* eslint-disable-next-line jsx-a11y/alt-text */}
                                            <img src="images/menu.svg"/>
                                            <span className="me-5 d-inline-block">
                                        Shop categories
                                    </span>
                                        </button>
                                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                            {/*Items under dropdown list*/}
                                            <li><Link className="dropdown-item text-white" to="/BooksAndCoursesCategorySearch">Books and Courses</Link></li>
                                        	<li><Link className="dropdown-item text-white" to="/CellphonesAndSmartwatchesCategorySearch">Cellphones and Smartwatches</Link></li>
                                        	<li><Link className="dropdown-item text-white" to="/ComputersAndElectronincsCategorySearch">Computers and Electronins</Link></li>
                                        	<li><Link className="dropdown-item text-white" to="/GamingCategorySearch">Gaming</Link></li>
                                        	<li><Link className="dropdown-item text-white" to="/HomeAndAppliancesCategoricalSearch">Home and Appliances</Link></li>
                                        	<li><Link className="dropdown-item text-white" to="/TvAudioAndMediaCategoricalSearch">TV, Audio and Media</Link></li>
                                        </ul>
                                    </div>
                                    {/*End of Dropdown button*/}
                                </div>
                                <div className="menu-links">
                                    <div className="d-flex align-items-center gap-50">
                                        <NavLink className="text-white" to = "/">Home</NavLink>
                                        <NavLink className="text-white" to = "/">Orders</NavLink>
                                        <NavLink className="text-white" to = "/product">Our Store</NavLink>
                                        <NavLink className="text-white" to = "/contact">Contact</NavLink>
                                        {/* Conditionally renders the MyProducts button if you are a seller */}
                                        {isSeller && <NavLink className="text-white" to="/MyProducts">My Products</NavLink>}
                                        <NavLink className="text-white" to={{
                                            pathname: "/MyAccount",
                                            state: { isSeller: {isSeller} }
                                        }}>My Account</NavLink>
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

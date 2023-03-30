import React from "react";
import ReactStars from "react-rating-stars-component";
import { Link, useLocation } from "react-router-dom";

const SellerProductCard = (props) => {
    const {grid} = props;
    let location = useLocation();
    
  return (
    <>           
        <div
            className={` ${
                location.pathname == "/MyProducts" ? `gr-${grid}` : "col3"
            } `}
        >
            <Link className="seller-product-card position-relative">
                <div className="wishlist-icon position-absolute">
                    <Link>
                        <img src="images/wish.svg" alt="wishlist" />
                    </Link>
                </div>
                <div className="product-image">
                    <img
                        src="images/watch.jpg"
                        className="img-fluid"
                        alt="product image"
                    />
                </div>
                <div className="product-details">
                    <h6 className="brand">Havels</h6>
                    <h5 className="product-title">
                        Kids headphones bulk 10 pack multi colored for students
                    </h5>
                    <ReactStars
                        count={5}
                        size={24}
                        value={4}
                        edit={false}
                        activeColor="#ffd700"
                    />
                    <p className="description">
                        This is the description to this product. It is a very good product so please buy it. Yes you. Buy this product now.
                    </p>
                    <div className="d-grip gap-2 d-md-block">
                    <p className="price">R100.00</p>
                    <p className="stock">Stock Available:12</p>
                    </div>
        
                    <div className="d-grid gap-30 d-md-block">
                        <Link className="button" >View Analytics</Link>
                        <Link className="button" >Update Product</Link>
                        <Link className="button">Remove Product</Link>
                    </div>
                </div>
                <div className="action-bar position-absolute">
                    <div className="d-flex flex-column gap-15">
                        <Link>
                            <img src="images/prodcompare.svg" alt="compare" />
                        </Link>
                        <Link>
                            <img src="images/view.svg" alt="view" />
                        </Link>
                        <Link>
                            <img src="images/add-cart.svg" alt="addcart" />
                        </Link>
                    </div>
                </div>
            </Link>
        </div>
    </>
  )
}

export default SellerProductCard;

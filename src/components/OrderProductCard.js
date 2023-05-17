import React from "react";
import ReactStars from "react-rating-stars-component";
import { Link, useLocation } from "react-router-dom";

const OrderProductCard = ({
                              grid,
                              productImage,
                              brand,
                              productName,
                              productDescription,
                              productPrice,
                              productQuantity
                          }) => {
    let location = useLocation();

    // This is what is displayed when you press "Order Details" in Order History
    return (
        <>
            <div className={` ${location.pathname === "/OrderHistory" ? `gr-${grid}` : "col3"} `}>
                <Link className="seller-product-card position-relative">
                    <div className="product-image">
                        {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                        <img src={productImage} className="img-fluid" alt="product image" />
                    </div>
                    <div className="product-details">
                        <h6 className="brand">{brand}</h6>
                        <h5 className="product-title">{productName}</h5>
                        <ReactStars count={5} size={24} value={4} edit={false} activeColor="#ffd700" />
                        <p className="description">{productDescription}</p>
                        <div className="d-grip gap-2 d-md-block">
                            <p className="price">R{productPrice}</p>
                            <p className="stock">Stock Ordered: {productQuantity}</p>
                        </div>
                    </div>
                </Link>
            </div>
        </>
    );
};

export default OrderProductCard;


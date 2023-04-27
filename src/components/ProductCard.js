// ProductCard.js
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import ReactStars from "react-rating-stars-component";
import { Link, useLocation } from "react-router-dom";

const ProductCard = ({
                         grid,
                         productImage,
                         brand,
                         productName,
                         productDescription,
                         productPrice,
                         productStock,
                         editOnClick,
                         removeOnClick,
                         viewOnClick,
                     }) => {

    let location = useLocation();

    // const handleClick = () =>{
    // history.push('/product/${product.id}')
    // };

    return (
        <>
            <div
                className={` ${location.pathname === "/store" ? `gr-${grid}` : "col-3"} productCard`}
                data-testid="product-card"
                >
            <Link
                to={`/product/${productName}`}
                className="product-card position-relative"
                state={{
                    productImage,
                    brand,
                    productName,
                    productDescription,
                    productPrice,
                    productStock,
                }}>
                    <div className="product-image">
                        <img src={productImage} alt={productName} width="150" height="150"/>
                    </div>
                    <div className="product-details">
                        <h6 className="brand">{brand} </h6>

                        {/* adjusted product name so that it slices long names */}
                        {productName && typeof productName === "string" && (
                            <h5 className="product-title">
                                {productName.length > 25
                                    ? productName.substring(0, 25) + "..."
                                    : productName}
                            </h5>
                        )}
                        <ReactStars
                            count={5}
                            value={3}
                            edit = {false}
                            size={24}
                            activeColor="#ffd700"
                        />
                        <p className="price">R {productPrice}</p>
                        <div className="add-to-cart">
                            <Link><img src="/images/add-cart.svg" alt="addcart"/>
                            </Link>
                            <label> Add to Cart </label>
                        </div>

                    </div>
                    <div className="action-bar position-absolute">
                        <div className="d-flex flex-column">

                            <Link>
                                <img src="/images/wish.svg" alt="wishlist"/>
                            </Link>
                        </div>
                    </div>
                    <div className="add-cart">

                    </div>
                </Link>
            </div>
        </>
    )
}

export default ProductCard;

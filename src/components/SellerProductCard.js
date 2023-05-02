import React from "react";
import ReactStars from "react-rating-stars-component";
import { Link, useLocation } from "react-router-dom";

const SellerProductCard = ({
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

    const handleEditOnClick = () => {
        editOnClick({ productImage, brand, productName, productDescription, productPrice, productStock });
    };

    return (
        <>
            <div className={` ${location.pathname === "/MyProducts" ? `gr-${grid}` : "col3"} `}>
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
                            <p className="stock">Stock Available: {productStock}</p>
                        </div>

                        <div className="d-grid gap-30 d-md-block">
                            <Link className="button" onClick={viewOnClick}>
                                View Analytics
                            </Link>
                            <Link className="button" onClick={handleEditOnClick}>
                                Update Product
                            </Link>
                            <Link className="button" onClick={removeOnClick}>
                                Remove Product
                            </Link>
                        </div>
                    </div>
                </Link>
            </div>
        </>
    );
};

export default SellerProductCard;

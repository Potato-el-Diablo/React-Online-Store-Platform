import React from "react";
import ReactStars from "react-rating-stars-component";
import { useLocation } from "react-router-dom";

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
        editOnClick({
            productImage,
            brand,
            productName,
            productDescription,
            productPrice,
            productStock,
        });
    };

    return (
        <div className={` ${location.pathname === "/MyProducts" ? `gr-${grid}` : "col3"} `}>
            <div className="seller-product-card position-relative">
                <div className="wishlist-icon position-absolute">
                    <button className="link-button">
                        <img src="images/wish.png" alt="wishlist" />
                    </button>
                </div>
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
                        <p className="price">{productPrice}</p>
                        <p className="stock">Stock Available: {productStock}</p>
                    </div>

                    <div className="d-grid gap-30 d-md-block">
                        <button className="link-button" onClick={viewOnClick}>
                            View Analytics
                        </button>
                        <button className="link-button" onClick={handleEditOnClick}>
                            Update Product
                        </button>
                        <button className="link-button" onClick={removeOnClick}>
                            Remove Product
                        </button>
                    </div>
                </div>
                <div className="action-bar position-absolute">
                    <div className="d-flex flex-column gap-15">

                        <button className="link-button">
                             <img src="images/prodcompare.svg" alt="compare" />
                        </button>
                        <button className="link-button">
                            <img src="images/view.svg" alt="view" />
                        </button>
                        <button className="link-button">
                            <img src="images/add-cart.svg" alt="Add to Cart" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerProductCard;

import React from "react";
import ReactStars from "react-rating-stars-component";
import { Link } from "react-router-dom";

const ProductCard = () => {
    
  return (
    <div className="col-3">
        <div className="product-card position-relative">
            <div className="product-image">
                <img src ="images/watch.jpg" alt="watch"/>
            </div>
            <div className="product-details">
                <h6 className="brand">Havels </h6>
                <h5 className="product-title"> Kids headphones</h5>
                <ReactStars
                    count={5}
                    value="3"
                    edit = {true}
                    size={24}
                    activeColor="#ffd700"
                />
                <p className="price">R250</p>
                <div className="add-to-cart">
                <Link><img src="images/add-cart.svg" alt="addcart"/>
                        </Link>
                <label htmlfor=""> Add to Cart </label>
                </div>
                
            </div>
                <div className="action-bar position-absolute">
                    <div className="d-flex flex-column">
                        
                        <Link>
                        <img src ="images/wish.svg" alt="wishlist"/>
                        </Link>
                    </div>
                </div>
                <div className="add-cart">
                    
                </div>
        </div>
    </div>
  )
}

export default ProductCard;
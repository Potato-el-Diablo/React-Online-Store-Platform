import React, {useEffect, useState} from "react";
import ReactStars from "react-rating-stars-component";
import { Link, useLocation } from "react-router-dom";
import { updateDoc, doc } from 'firebase/firestore';
import {db} from "../pages/firebase";

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
                               productId,
                               productSale,
                           }) => {
    let location = useLocation();
    const [salePrice, setSalePrice] = useState(null);
    const [currentSale, setCurrentSale] = useState(productSale);
    const [error, setError] = useState('');

    useEffect(() => {
        setCurrentSale(productSale);
    }, [productSale]);

    //Send product parameters to UpdateProductModal
    const handleEditOnClick = () => {
        editOnClick({ productImage, brand, productName, productDescription, productPrice, productStock });
    };
    const createSaleOnClick = () => {
        setSalePrice('');
        setError('');
    }

    const handleSalePriceChange = (e) => {
        setSalePrice(e.target.value);
        setError('');
    }

    const submitSaleOnClick = async () => {
        if (salePrice !== null && salePrice !== '' && parseFloat(salePrice) < parseFloat(productPrice)) {
            const productRef = doc(db, 'Products', productId);
            await updateDoc(productRef, {
                sale: salePrice
            });
            setCurrentSale(salePrice);
            setSalePrice(null);
        } else {
            setError('Sale Price cannot be more than the original price');
        }
    }

    const removeSaleOnClick = async () => {
        const productRef = doc(db, 'Products', productId);
        await updateDoc(productRef, {
            sale: ''
        });
        setCurrentSale(null);
        setSalePrice(null);
    }

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
                            {productSale && <p className="sale-price">Sale Price: R{currentSale}</p>}
                            {salePrice !== null &&
                                <>
                                    <input
                                        type="text"
                                        value={salePrice}
                                        onChange={handleSalePriceChange}
                                        placeholder="Sale price:"
                                    />
                                    <button onClick={submitSaleOnClick}>
                                        Submit Sale
                                    </button>
                                </>}
                            {error && <p className="error">{error}</p>}
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
                            {productSale ? (
                                <Link className="button" onClick={removeSaleOnClick}>
                                    Remove Sale
                                </Link>
                            ) : (
                                <Link className="button" onClick={createSaleOnClick}>
                                    Create Sale
                                </Link>
                            )}
                        </div>
                    </div>
                </Link>
            </div>
        </>
    );
};

export default SellerProductCard;

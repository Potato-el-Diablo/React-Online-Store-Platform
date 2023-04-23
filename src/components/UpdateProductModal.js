import React, { useState, useEffect} from 'react'
import { Link, useLocation } from 'react-router-dom'
import TagsForm from '../components/TagsForm'
import { doc, updateDoc } from 'firebase/firestore';
import { db } from "../pages/firebase";

export default function UpdateProductModal({
                                               open,
                                               onClose,
                                               productId,
                                               productImage,
                                               brand,
                                               productName,
                                               productDescription,
                                               productPrice,
                                               productStock,
                                               onProductUpdate
                                           }) {
    const [state, setState] = useState({
        brand,
        productName,
        productDescription,
        productPrice,
        productStock,
    });
    useEffect(() => {
        setState({
            brand,
            productName,
            productDescription,
            productPrice,
            productStock,
        });
    }, [brand, productName, productDescription, productPrice, productStock]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setState((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleUpdateProduct = async () => {
        const productRef = doc(db, 'Products', productId);

        await updateDoc(productRef, {
            brand: state.brand,
            name: state.productName,
            description: state.productDescription,
            price: state.productPrice,
            stock: state.productStock,
        });

        onClose();
        onProductUpdate();
    };

    if (!open) return null

    return (
        <>
            <div className='product-overlay' />
            <div className='product-modal'>
                {/* ... */}
                <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                    <div className="product-image">
                        <img src={productImage} className="img-fluid" alt="product image" />
                    </div>

                    <div className="product-details">
                        <div className="mb-3">
                            <label htmlFor="brand" className="form-label">
                                Product Brand:{' '}
                            </label>
                            <input
                                className="form-control"
                                type="text"
                                placeholder="Product Brand"
                                aria-label="default input example"
                                name="brand"
                                value={state.brand}
                                onChange={handleChange}
                            ></input>
                            <label htmlFor="productName" className="form-label">
                                Product Name:{' '}
                            </label>
                            <input
                                className="form-control"
                                type="text"
                                placeholder="Product Name"
                                aria-label="default input example"
                                name="productName"
                                value={state.productName}
                                onChange={handleChange}
                            ></input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="productDescription" className="form-label">
                                Product Description
                            </label>
                            <textarea
                                className="form-control"
                                id="productDescription"
                                rows="3"
                                name="productDescription"
                                value={state.productDescription}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                        {/* ... */}
                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                            <label htmlFor="productStock" className="form-label">
                                Available Stock:{' '}
                            </label>
                            <input
                                className="form-control"
                                type="number"
                                name="productStock"
                                defaultValue={1}
                                min={1}
                                max={99}
                                id="productStock"
                                value={state.productStock}
                                onChange={handleChange}
                            />
                            <label htmlFor="productPrice" className="form-label">
                                Price R*:{' '}
                            </label>
                            <input
                                className="form-control"
                                type="text"
                                placeholder="XXX.cc"
                                aria-label="default input example"
                                name="productPrice"
                                value={state.productPrice}
                                onChange={handleChange}
                            ></input>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <Link className="button" onClick={handleUpdateProduct}>
                        Update Product
                    </Link>
                    <Link className="button" onClick={onClose} >Cancel</Link>
                </div>
            </div>
        </>
    )
}

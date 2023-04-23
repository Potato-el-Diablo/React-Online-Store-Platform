import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import TagsForm from '../components/TagsForm'

export default function UpdateProductModal({
                                               open,
                                               onClose,
                                               productImage,
                                               brand,
                                               productName,
                                               productDescription,
                                               productPrice,
                                               productStock,
                                           }) {
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
                            <label for="exampleFormControlTextarea1" class="form-label">
                                Product Brand:{' '}
                            </label>
                            <input
                                className="form-control"
                                type="text"
                                placeholder="Product Brand"
                                aria-label="default input example"
                                value={brand}
                            ></input>
                            <label for="exampleFormControlTextarea1" class="form-label">
                                Product Name:{' '}
                            </label>
                            <input
                                className="form-control"
                                type="text"
                                placeholder="Product Name"
                                aria-label="default input example"
                                value={productName}
                            ></input>
                        </div>
                        <div className="mb-3">
                            <label for="exampleFormControlTextarea1" class="form-label">
                                Product Description
                            </label>
                            <textarea
                                class="form-control"
                                id="exampleFormControlTextarea1"
                                rows="3"
                                value={productDescription}
                            ></textarea>
                        </div>
                        {/* ... */}
                        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                            <label for="exampleFormControlTextarea1" class="form-label">
                                Available Stock:{' '}
                            </label>
                            <input
                                className="form-control"
                                type="number"
                                name=""
                                defaultValue={1}
                                min={1}
                                max={99}
                                id=""
                                value={productStock}
                            />
                            <label for="exampleFormControlTextarea1" class="form-label">
                                Price R*:{' '}
                            </label>
                            <input
                                className="form-control"
                                type="text"
                                placeholder="XXX.cc"
                                aria-label="default input example"
                                value={productPrice}
                            ></input>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <Link className="button">Update Product</Link>
                    <Link className="button" onClick={onClose} >Cancel</Link>
                </div>
            </div>
        </>
    )
}

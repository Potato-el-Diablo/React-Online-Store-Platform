import React from 'react'
import { Link } from 'react-router-dom'
import TagsForm from '../components/TagsForm'

export default function UpdateProductModal({open,onClose}){
    if(!open) return null

  return (
    <>
        <div className='product-overlay'/>
        <div className='product-modal'>
            <div className='modal-header'>
                <header>Update Product</header>
            </div>

            <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                <div className="product-image">
                    <img src="images/watch.jpg" className="img-fluid" alt="product image"/>
                </div>

                <div className="product-details">
                    <div className="mb-3">
                        <label for="exampleFormControlTextarea1" class="form-label">Product Brand: </label>
                        <input className="form-control" type="text" placeholder="Product Brand" aria-label="default input example" value="Havels"></input>
                        <label for="exampleFormControlTextarea1" class="form-label">Product Name: </label>
                        <input className="form-control" type="text" placeholder="Product Name" aria-label="default input example" value="Kids headphones bulk 10 pack multi colored for students"></input>
                    </div>
                    <div className="mb-3">
                        <label for="exampleFormControlTextarea1" class="form-label">Product Description</label>
                        <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" value="This is the description to this product. It is a very good product so please buy it. Yes you. Buy this product now."></textarea>
                    </div>
                    <div className="mb-3">
                        <TagsForm initialLabels={['Tech','Jewellery','Beauty']}></TagsForm> 
                    </div>
                    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                        <label for="exampleFormControlTextarea1" class="form-label">Available Stock: </label>
                        <input className="form-control" type="number" name="" defaultValue={1} min={1} max={99} id="" value="12"/>
                        <label for="exampleFormControlTextarea1" class="form-label">Price R*: </label>
                        <input className="form-control" type="text" placeholder="XXX.cc" aria-label="default input example" value="100.00"></input>
                    </div>
                </div>
            </div>

            <div className="modal-footer">
                <Link className="button">Update Proudct</Link>
                <Link className="button" onClick={onClose} >Cancel</Link>
            </div>
            
            
        </div>
    </>
  )
}

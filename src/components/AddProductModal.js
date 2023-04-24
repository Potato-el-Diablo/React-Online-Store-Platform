import React, { useState, useEffect} from 'react'
import { Link, useLocation } from 'react-router-dom'
import TagsForm from '../components/TagsForm'
import { addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from "../pages/firebase";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { saveProductToFirestore } from '../functions/firestoreFunctions';

export default function AddProductModal({
    open,
    onClose,
    productId,
    brand,
    productName,
    productDescription,
    productTags,
    productPrice,
    productStock,
    onProductAdd}){


        const [state, setState] = useState({
            brand,
            productName,
            productDescription,
            productPrice,
            productStock,
            imageLink:'',
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
    
        const handleChange = (event) => {
            const { name, value } = event.target;
            console.log(name,value)
            setState((prevState) => ({ ...prevState, [name]: value }));
        };

    const handleAddProduct = async () => {
        try {
            await saveProductToFirestore(state.brand, state.productName, state.productDescription, state.productPrice, state.productStock, state.imageLink);
            toast.success('Product created successfully!');
        } catch {
            toast.success('Product invalid');
        }
        onProductAdd();
        onClose();
    };

        const handleAddTag = (event) => {
            const { tags } = this.state;
        
            this.setState({
                tags: [...tags, event.target.text]
            });
        
        }

        const handleRemoveTag = (index) => {
            const { tags } = this.state;
            this.setState({
              tags: tags.filter((tag, i) => i !== index)
            });
        
        }

    const ImageInput = ({ value, onChange }) => {
        const handleInputChange = (event) => {
            onChange(event.target.value);
        };


    return (
        <div>
            <div className="product-image">
                {value && <img src={value} className="img-fluid" alt="product image" />}
            </div>
            <div className="image-link-input">
                <input
                    type="text"
                    value={value}
                    onChange={handleInputChange}
                    placeholder="Enter image link"
                />
            </div>
        </div>
    );
        };
        
    if(!open) return null;

  return (
    <>
        <div className='product-overlay'/>
        <div className='product-modal'>
            <div className='modal-header'>
                <header>Add Product</header>
            </div>

            <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                <ImageInput
                    value={state.imageLink}
                    onChange={(value) => setState({ ...state, imageLink: value })}
                />


                <div className="product-details">
                    <div className="mb-3">
                        <label for="exampleFormControlTextarea1" class="form-label">Product Brand: </label>
                        <input className="form-control" type="text" placeholder="Product Brand" aria-label="default input example" name="brand" onChange={handleChange}></input>
                        <label for="exampleFormControlTextarea1" class="form-label">Product Name: </label>
                        <input className="form-control" type="text" placeholder="Product Name" aria-label="default input example" name="productName" onChange={handleChange}></input>
                    </div>
                    <div className="mb-3">
                        <label for="exampleFormControlTextarea1" class="form-label">Product Description</label>
                        <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" name="productDescription" onChange={handleChange}></textarea>
                    </div>
                    <div className="mb-3">
                    </div>                   
                    <div class="d-grid gap-2 d-md-flex justify-content-md-center">
                        <label for="exampleFormControlTextarea1" class="form-label">Available Stock: </label>
                        <input className="form-control" type="number" name="productStock" defaultValue={1} min={1} max={99} id="productStock" onChange={handleChange}/>
                        <label for="exampleFormControlTextarea1" class="form-label">Price R*: </label>
                        <input className="form-control" type="text" name="productPrice" placeholder="XXX.cc" aria-label="default input example" onChange={handleChange}></input>
                    </div>
                </div>
            </div>

            <div className="modal-footer">
                <Link className="button" onClick={handleAddProduct}>Add Product</Link>
                <Link className="button" onClick={onClose} >Cancel</Link>
            </div>
              
        </div>
    </>
  )
}

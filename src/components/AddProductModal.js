import React, { useState} from 'react'
import { Link } from 'react-router-dom'
import TagsForm from '../components/TagsForm'
//import { addDoc, doc, updateDoc } from 'firebase/firestore';
//import { db } from "../pages/firebase";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { saveProductToFirestore } from '../functions/firestoreFunctions';
import { auth } from "../pages/firebase";


export default function AddProductModal({
    open,
    onClose,
    onProductAdd}){

        const [brand, setBrand] = useState("");
        const [productName, setProductName] = useState("");
        const [productDescription, setProductDescription] = useState("");
        const [productPrice, setProductPrice] = useState("");
        const [productStock, setProductStock] = useState("");
        const [imageLink, setImageLink] = useState("");
        const [productTags, setProductTags] = useState([]);


        const myHandleAddTag= (event) =>{
            setProductTags((prevTags) => {
                if (prevTags && Array.isArray(prevTags)) { // Check if prevTags is defined and an array
                  return [...prevTags, event.target.text]; // If it is, add the new tag to the array
                } else {
                  return [event.target.text]; // Otherwise, create a new array with the new tag
                }
              });
        };

        const myHandleRemoveTag = (index) => {
            setProductTags(prevTags => prevTags.filter((_, i) => i !== index));  
        };

    const handleAddProduct = async () => {
        try {
            const email = auth.currentUser.email;
            await saveProductToFirestore(brand, productName, productDescription, productTags, productPrice, productStock, imageLink, email);
            toast.success('Product created successfully!');
        } catch {
            toast.success('Product invalid');
        }
        onProductAdd();
        onClose();
    };  

    const handleChange = (event) => {
        setImageLink(event.target.value);
      };

    // const ImageInput = () => {
    //     const handleInputChange = (event) => {
    //         onChange(event.target.value);
    //     };
    


    //     return (
    //         <div>
    //             <div className="product-image">
    //                 {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
    //                 {value && <img src={value} className="img-fluid" alt="product image" />}
    //             </div>
    //             <div className="image-link-input">
    //                 <input
    //                     type="text"
    //                     value={value}
    //                     onChange={ImageInput}
    //                     placeholder="Enter image link"
    //                 />
    //             </div>
    //         </div>
    //     );
    // };
        
    if(!open) return null;

  return (
    <>
        <div className='product-overlay'/>
        <div className='product-modal'>
            <div className='modal-header'>
                <header>Add Product</header>
            </div>

            <div class="d-grid gap-2 d-md-flex justify-content-md-end">
            <div className="image-link-input">
                {imageLink && <img src={imageLink} alt="Uploud Image" />}
                    <input
                        type="text"
                        value=""
                        onChange={handleChange}
                        placeholder="Enter image link"
                    />
                </div>
               {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
               


                <div className="product-details">
                    <div className="mb-3">
                        <label for="exampleFormControlTextarea1" class="form-label">Product Brand: </label>
                        <input className="form-control" type="text" placeholder="Product Brand" aria-label="default input example" name="brand" onChange={(event) =>setBrand(event.target.value)}></input>
                        <label for="exampleFormControlTextarea1" class="form-label">Product Name: </label>
                        <input className="form-control" type="text" placeholder="Product Name" aria-label="default input example" name="productName" onChange={(event) =>setProductName(event.target.value)}></input>
                    </div>
                    <div className="mb-3">
                        <label for="exampleFormControlTextarea1" class="form-label">Product Description</label>
                        <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" name="productDescription" onChange={(event) =>setProductDescription(event.target.value)}></textarea>
                    </div>
                    <div className="mb-3">
                        <TagsForm onAddTag={myHandleAddTag} onRemoveTag={myHandleRemoveTag}></TagsForm>
                    </div>                   
                    <div class="d-grid gap-2 d-md-flex justify-content-md-center">
                        <label for="exampleFormControlTextarea1" class="form-label">Available Stock: </label>
                        <input className="form-control" type="number" name="productStock" defaultValue={1} min={1} max={99} id="productStock" onChange={(event) =>setProductStock((event.target.value))}/>
                        <label for="exampleFormControlTextarea1" class="form-label">Price R*: </label>
                        <input className="form-control" type="text" name="productPrice" placeholder="XXX.cc" aria-label="default input example" onChange={(event) =>setProductPrice(event.target.value)}></input>
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

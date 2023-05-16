import React, { useState, useEffect } from 'react';
import ProductCard from "../components/ProductCard";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import {collection, getDocs, addDoc, doc, setDoc, updateDoc, getDoc} from "firebase/firestore";
import ReactStars from "react-rating-stars-component";
import { db } from "./firebase";
//import ReactImageZoom from "react-image-zoom";
import { AiOutlineHeart} from "react-icons/ai";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {onAuthStateChanged, getAuth} from "firebase/auth";
import { Timestamp } from "firebase/firestore";



import { useLocation  } from "react-router-dom";
 const grid = 12;
const SingleProduct = () => {

  const [userId, setUserId] = useState('');
  const [reviews, setReviews] = useState([]); //used to fetch old reviews
  const [userReview, setUserReview] = useState(null); //checks if user has already made a review

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId('');
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);

  // eslint-disable-next-line no-unused-vars
  const [orderedProduct, setorderedProduct] = useState(true);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState(''); //used to make a new review
  const [averageRating, setAverageRating] = useState(null);

  let location = useLocation();
  const { productImage, brand, productName, productDescription, productPrice, productStock, productId } = location.state;

  useEffect(() => {
    const fetchData = async () => {
      const data = await getDocs(collection(db, 'Products'));
      setProducts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    fetchData();
  }, []);

  console.log(products);
  // const history = useHistory();

  // In the fetchReviews useEffect, check for and store the current user's review
  useEffect(() => {
    const fetchReviews = async () => {
      const querySnapshot = await getDocs(collection(db, 'reviews'));
      const productReviews = querySnapshot.docs
          .map((doc) => ({ ...doc.data(), id: doc.id }))
          .filter((review) => review.productId === productId);

      setReviews(productReviews);

      // If the current user has a review, set it to the userReview state
      const currentUserReview = productReviews.find(review => review.userId === userId);
      setUserReview(currentUserReview);
    };

    fetchReviews();
  }, [productId, userId]) // Add userId as a dependency

  useEffect(() => {
    if (reviews.length > 0) {
      const newAverageRating =
          reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
      setAverageRating(newAverageRating);
    }
  }, [reviews]);

  const handleAddToCart = async (productId, quantity) => {
    try {
      // Show toast messages
    /*  toast.success(`User ID: ${userId}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      toast.success(`The product you are adding is: ${productId}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });  */

      // Add the product to the user's cart
      const userCartRef = doc(db, 'Carts', userId);
      const cartSnapshot = await getDoc(userCartRef);

      if (cartSnapshot.exists()) {
        // Update the existing cart with the new product ID and quantity
        const existingProducts = cartSnapshot.data().products;
        const productIndex = existingProducts.findIndex(
            (product) => product.productId === productId
        );

        if (productIndex !== -1) {
          // The product already exists in the cart, update the quantity
          existingProducts[productIndex].quantity += quantity;
        } else {
          // Add a new product to the cart with the specified quantity
          existingProducts.push({ productId, quantity });
        }

        await updateDoc(userCartRef, { products: existingProducts });
      } else {
        // Create a new cart with the product ID and quantity
        await setDoc(userCartRef, {
          products: [{ productId, quantity }],
        });
      }


      // Show success message
      toast.success('Product added to cart successfully', {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } catch (error) {
      // Show error message
      toast.error('Failed to add product to cart', {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      console.error('Error adding product to cart:', error);
    }
  };
  const addReview = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert('Please sign in to submit a review.');
      return;
    }


    try {
      // Create new review object
      const newReview = {
        userId,
        productId: location.state.productId,
        productName: location.state.productName,
        rating: reviewRating,
        comment: reviewComment,
        createdAt: Timestamp.fromDate(new Date()),
      };

      let docRef;
      if (userReview) {
        // If a review by this user for this product already exists, update it
        docRef = doc(db, 'reviews', userReview.id);
        await updateDoc(docRef, newReview);
      } else {
        // Add the new review to the Firestore collection
        docRef = await addDoc(collection(db, 'reviews'), newReview);
      }

      // Add the new review to the local state, and include the id from Firestore
      const newReviewWithId = { ...newReview, id: docRef.id };
      setReviews([...reviews.filter(review => review.id !== userReview?.id), newReviewWithId]);

      // Set userReview to the new review
      setUserReview(newReviewWithId);

      // Clear the form
      setReviewComment('');
      setReviewRating(0);

      alert(userReview ? 'Review updated successfully.' : 'Review submitted successfully.');
    } catch (error) {
      console.error('Error adding review: ', error);
    }
  };
  console.log("the average rating:", averageRating)

  //The reviews will render differently based on whether a user has made a review before or not
  return (
    <>
      <ToastContainer/>
      <Meta title={"Product Name"}/>
      <BreadCrumb title={productName}/>
      <div className = "main-product-wrapper py-5 home-wrapper-2">
        <div className = "container-xxl">
          <div className="row">
            <div className="col-6">
              <div className="main-product-image" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', height: '500px'}}>
                <img src={productImage} alt={productName} style={{maxWidth: '100%', maxHeight: '100%', height: 'auto', width: 'auto'}}/>
              </div>

              {/* removed additional images to avoid issues for now  */}
                {/* <div className="other-product-images d-flex flex-wrap gap-15"> */}
                  {/* <div><img src="/images/watch.jpg" alt="watch"/></div> */}
                  {/* <div><img src="/images/watch.jpg" alt="watch"/></div>  */}
                {/* </div>  */}
             </div>
              
            <div className="col-6"> 
              <div className="main-product-details">
               <div className="border-bottom">
               <h3 className="title">{productName}</h3>
               </div>
               <div className="border-bottom py-3">
                  <p className="price">R {productPrice}</p>
                  <div className="d-flex align-items-center gap-10">
                    {averageRating !== null && (
                        <ReactStars
                            count={5}
                            value={averageRating}
                            edit={false}
                            size={24}
                            activeColor="#ffd700"
                        />
                    )}
                    <p className="mb-0 t-review">{reviews.length} reviews</p>
                  </div>
                  <a className="review-btn" href="#review" >Write a Review</a>
               </div>
                <div className="border-bottom py-3">
                  {/* removed for convenience */}
                  {/* <div className="d-flex gap-10 align-items-center my-2"> */}
                    {/* <h3 className="product-heading">Type :</h3><p className="product-data">Watch</p> */}
                  {/* </div> */}
                  <div className="d-flex gap-10 align-items-center my-2">
                    <h3 className="product-heading">Brand :</h3><p className="product-data">{brand}</p>
                  </div>
                  
                  <div className="d-flex gap-10 align-items-center my-2">
                    <h3 className="product-heading">Availability :</h3><p className="product-data">{productStock}</p>
                  </div>
                  <div className="d-flex gap-10 flex-column mt-2 mb-3">
                    <h3 className="product-heading">Size :</h3>
                      <div className="d-felx flex-wrap gap-15">
                        <span className="badge border border-1 bg-white text-dark border-secondary">S</span>
                        <span className="badge border border-1 bg-white text-dark border-secondary">M</span>
                        <span className="badge border border-1 bg-white text-dark border-secondary">L</span>
                      </div>
                  </div>
                  
                  <div className="d-flex gap-10 flex-row mt-2 mb-3">
                    <h3 className="product-heading">Quantity :</h3>
                    <div className="">
                      <input
                          type="number"
                          name=""
                          min={1}
                          max={location.state.quantity}
                          className="form-control"
                          style={{ width: "70px" }}
                          value={quantity}
                          onChange={(e) => setQuantity(parseInt(e.target.value))}
                      />

                    </div>
                    <div className="d-flex align-items-center gap-30">
                      <button
                          className="button border-0"
                          style={{ blockSize: "45px", width: "200px", backgroundColor: "#232f3e" }}
                          type="submit"
                          onClick={() => handleAddToCart(location.state.productId, quantity)}
                      >
                        Add to Cart
                      </button>
                    <button className="button border-0" style={{blockSize:"45px", width:"200px", backgroundColor:"#febd69",}} type="submit"> Buy Now </button>

                    </div>
                    <div className="d-flex align-items-center gap-15">
                      
                    </div>
                    
                  </div>
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <div><a href=""><AiOutlineHeart className="fs-5 me-2"/>Add to Wishlist</a></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="description-wrapper py-5 home-wrapper-2">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <h4>Description</h4>
              <div className="bg-white p-3">
                
                <p >
                  {productDescription}
                </p>

              </div>
            </div>
          </div>
        </div>
      </div>
      <section id="review" className="reviews-wrapper home-wrapper-2">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12"> 
            <h3>Reviews</h3>
              <div className="review-inner-wrapper">


                <div  className="review-form py-4">
                  <h4>{userReview ? 'Update your previous review' : 'Write a Review'}</h4>
                  <form onSubmit={addReview}>
                    <div>
                      <ReactStars
                          count={5}
                          value={userReview?.rating || "3"}
                          edit = {true}
                          size={24}
                          activeColor="#ffd700"
                          onChange={(newRating) => setReviewRating(newRating)}
                      />
                    </div>
                    <div>
        <textarea
            name=""
            id=""
            className="w-100 form-control"
            cols="30"
            rows="4"
            placeholder="Comments"
            value={reviewComment || userReview?.comment}
            onChange={(event) => setReviewComment(event.target.value)}
        ></textarea>
                    </div>
                    <div className="d-flex justify-content-end">
                      <button className="button border-0">{userReview ? 'Update Review' : 'Submit Review'}</button>
                    </div>
                  </form>
                </div>
                <div>
                  <h4 className="mb-2">Customer Reviews</h4>
                  <div className="d-flex align-items-center gap-10">
                    {averageRating !== null && (
                        <ReactStars
                            count={5}
                            value={averageRating}
                            edit={false}
                            size={24}
                            activeColor="#ffd700"
                        />
                    )}
                    <p className="mb-0">Based on {reviews.length} reviews</p>
                  </div>
                </div>
                {/*filters to the most recently created review of a product*/}
                <div className="scrollable-reviews">
                  {reviews.length > 0 ? (
                      reviews
                          .sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis())
                          .map((review, index) => (
                              <div key={index} className="review">
                                <div className="d-flex gap-10 align-items-center">
                                  <h6 className="mb-0">Customer {index + 1}</h6>
                                  <ReactStars
                                      count={5}
                                      value={review.rating}
                                      edit={false}
                                      size={24}
                                      activeColor="#ffd700"
                                  />
                                </div>
                                <p className="mt-3">{review.comment}</p>
                              </div>
                          ))
                  ) : (
                      <p>No reviews yet. Be the first to review!</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </section>

      <section className = "popular-wrapper py-5 home-wrapper-2">  
        <div className="container-xxl"> 
          <div className="row">
            <div className="col-12"> 
              <h3 className="section-heading"> Our Popular Products </h3>
            </div>
          </div>
          <div className="row"> 
          {products.slice(0,4).map((product) => (
                                <ProductCard 
                                key={product.id}
                                grid={grid}
                                productImage={product.image}
                                brand={product.brand}
                                productName={product.name}
                                productDescription={product.description}
                                productPrice={product.price}
                                productStock={product.stock || 'Not available'}
                                productId={product.id}
                                // editOnClick={() => handleEditOnClick(product)}
                                // onClick={() => handleProductCardClick(product.id)}
                                
                                />
                            ))}    
          </div>
        </div>
      </section>
    </>
  ) ;
};

export default SingleProduct;
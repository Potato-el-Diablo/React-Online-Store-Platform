import React, { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import { db } from "./firebase";
import ProductCard from "../components/ProductCard";


/*lastest commit*/
// added productSale

const OurStore = () => {
    const grid = 12;
    const [products, setProducts] = useState([]);
    
    
    // this is for tracking user clicks
    // const history = useHistory();
    // const handleClick = () =>{
        // history.push('/product/{product.id}')
    // };
    
    useEffect(() => {
        const fetchData = async () => {
            const data = await getDocs(collection(db, 'Products'));
            setProducts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        };
        fetchData();
    }, []);

    console.log(products);

    
    // find how many products in stock
    
  return (
    <>
    <Meta title={"OurStore"}/>
    <BreadCrumb title="Our Store"/> 
    <div className="store-wrapper home-wrapper-2 py-5" >
        <div className="container-xxl">
            <div className="row" style={{"width":"1500px"}}>
                <div className="col-2">
                    {/* removed this since redundancy can add back if necessary */}
                    
                    <div className="filter-card mb-3">
                        <h3 className="filter-title">Filter By</h3>
                        <div> 
                            <h5 className="sub-title">Availability</h5>
                            <div>
                            <div class="form-check">
                                <input className="form-check-input" type="checkbox" value="checked" id="" />
                                <label className="form-check-label" htmlfor="">
                                    
                                    In Stock({products.length})

                                </label>
                            </div>
                            <div class="form-check">
                                <input className="form-check-input" type="checkbox" value="" id="" />
                                <label className="form-check-label" htmlfor="">
                                    Out of Stock(0)
                                </label>
                            </div>
                            </div>
                            <h5 className="sub-title">Price</h5>
                            <div className="d-flex align-items-center gap-10">
                                <div className="form-floating ">
                                    <input type="" className="form-control py-1" id="" placeholder="From"/>
                                    <label htmlfor="floatingInput">From</label>
                                </div>
                                <div className="form-floating ">
                                    <input type="" className="form-control py-1" id="" placeholder="To"/>
                                    <label htmlfor="floatingInput">To</label>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                    <div className="filter-card mb-3">
                        <h3 className="filter-title mb-3">Product Tags</h3>
                        <div>
                            <div className="product-tags d-flex flex-wrap align-items-center gap-10">
                                <span className="badge bg-light text-secondary rounder-3 py-2 px-3">Headphone</span>
                                <span className="badge bg-light text-secondary rounder-3 py-2 px-3">Watches</span>
                                <span className="badge bg-light text-secondary rounder-3 py-2 px-3">Laptop</span>
                                <span className="badge bg-light text-secondary rounder-3 py-2 px-3">Mobile</span>
                                <span className="badge bg-light text-secondary rounder-3 py-2 px-3">Apple</span>
                            </div>
                        </div>
                    </div>
                    
                </div>
                <div className="col-10">
                    <div className="filter-sort-grid mb-4">
                        <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-10">
                            <p className="mb-0 d-block" style={{"width":"100px"}}>Sort By</p>
                            <select name="" className="form-control form-select" id="">
                                <option value="manual" >Featured</option>
                                <option value="best-selling" selected="selected" >Best Selling</option>
                                <option value="title-ascending" >Alphabetically A-Z</option>
                                <option value="title-descedning" >Alphabetically Z-A</option>
                                <option value="price-ascending" >Price, low to high</option>
                                <option value="price-descending" >Price, high to low</option>
                                
                            </select>
                        </div>
                            <div className="d-flex align-items-center gap-10">
                                <p className="totalproducts">Total Products: {products.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="products-list ">
                        <div className="d-flex flex-wrap gap-20">

                            {products
                            .filter((product) => product.stock > 0) // Filter products with stock > 0
                            .map((product) => (
                                <ProductCard
                                    key={product.id}
                                    productId={product.id}
                                    grid={grid}
                                    productImage={product.image}
                                    brand={product.brand}
                                    productName={product.name}
                                    productDescription={product.description}
                                    productPrice={product.price}
                                    productSale={product.sale || ''}
                                    productCategory={product.category}
                                    productStock={product.stock || 'Not available'}
                                    averageRating={product.averageRating || 0}
                                    // editOnClick={() => handleEditOnClick(product)}
                                    // onClick={() => handleProductCardClick(product.id)}
                                    className="productCard"
                                    sale = {product.stock}
                                />
                            ))}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default OurStore;
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import { db } from "./firebase";
import ProductCard from "../components/ProductCard";


/*lastest commit*/
const BooksAndCoursesCategoricalSearch = () => {
    const grid = 12;
    const [products, setProducts] = useState([]);
    
    //running a query to return all the products in the database
    useEffect(() => {
        const fetchData = async () => {
            const data = await getDocs(collection(db, 'Products'));
            setProducts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        };
        fetchData();
    }, []);

    //defining the category we wish to filter on
    const searchQuery = "Books and Courses";

    // Filtering products to remove any that arent in the given category
    const filteredProducts = products.filter((product) =>
        (product.category &&
        product.category.toLowerCase().includes(searchQuery.toLowerCase())) 
    );

   


  return (
    <>
    <Meta title={"OurStore"}/>
    <BreadCrumb title="Our Store"/> 
    <div className="store-wrapper home-wrapper-2 py-5" >
        <div className="container-xxl">
            <div className="row" style={{"width":"1500px"}}>
                <div className="col-2">
                    {/* removed this since redundancy can add back if necessary */}
                    {/* <div className="filter-card mb-3">
                        <h3 className="filter-title">Shop By Catergory</h3>
                        <div >
                            <ul ps-0>
                                <li>Watch</li>
                                <li>TV</li>
                                <li>Camera</li>
                                <li>Laptop</li>
                            </ul>
                        </div>
                    </div> */}
                    <div data-testid="filterBox" className="filter-card mb-3">
                        <h3 className="filter-title">Filter By</h3>
                        <div> 
                            <h5 className="sub-title">Availability</h5>
                            <div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" value="checked" id="" />
                                <label className="form-check-label" htmlFor="">
                                    
                                    In Stock({filteredProducts.length})

                                </label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" value="" id="" />
                                <label className="form-check-label" htmlFor="">
                                    Out of Stock(0)
                                </label>
                            </div>
                            </div>
                            <h5 className="sub-title">Price</h5>
                            <div className="d-flex align-items-center gap-10">
                                <div className="form-floating ">
                                    <input type="" className="form-control py-1" id="" placeholder="From"/>
                                    <label htmlFor="floatingInput">From</label>
                                </div>
                                <div className="form-floating ">
                                    <input type="" className="form-control py-1" id="" placeholder="To"/>
                                    <label htmlFor="floatingInput">To</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div data-testid="tagBox" className="filter-card mb-3">
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
                                <option value="best-selling" defaultValue="selected" >Best Selling</option>
                                <option value="title-ascending" >Alphabetically A-Z</option>
                                <option value="title-descedning" >Alphabetically Z-A</option>
                                <option value="price-ascending" >Price, low to high</option>
                                <option value="price-descending" >Price, high to low</option>
                                
                            </select>
                        </div>
                            <div className="d-flex align-items-center gap-10">
                                <p className="totalproducts">Total Products: {filteredProducts.length}</p>
                            </div>
                        </div>
                    </div>
                    <div data-testid="productsList" className="products-list ">
                        <div className="d-flex flex-wrap gap-20">

                            {filteredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    productId={product.id}
                                    grid={grid}
                                    productImage={product.image}
                                    brand={product.brand}
                                    productName={product.name}
                                    productDescription={product.description}
                                    productPrice={product.price}
                                    productStock={product.stock || 'Not available'}
                                    className="productCard"
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

export default BooksAndCoursesCategoricalSearch;
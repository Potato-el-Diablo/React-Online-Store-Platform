import React, { useState, useEffect } from 'react';
import {collection, getDocs, query, where} from "firebase/firestore";
import { auth } from "./firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Meta from '../components/Meta';
import BreadCrumb from '../components/BreadCrumb';
import SellerProductCard from '../components/SellerProductCard';
import { Link } from 'react-router-dom';
import { db } from "./firebase";
import AddProductModal from '../components/AddProductModal';
import UpdateProductModal from '../components/UpdateProductModal';

const MyProducts = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null); // New state variable
    const grid = 12;

    const [products, setProducts] = useState([]);

    useEffect(() => {
        const authInstance = getAuth();
        const unsubscribe = onAuthStateChanged(authInstance, async (user) => {
            if (user) {
                const email = user.email;
                const productsRef = collection(db, 'Products');
                const productsQuery = where('sellerEmail', '==', email);
                const data = await getDocs(query(productsRef, productsQuery));

                setProducts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    console.log(products);

    const handleEditOnClick = (product) => {
        setSelectedProduct(product);
        setIsUpdateOpen(true);
    };

    const refreshProducts = async () => {
        const email = auth.currentUser.email;
        const productsRef = collection(db, 'Products');
        const productsQuery = where('sellerEmail', '==', email);
        const data = await getDocs(query(productsRef, productsQuery));

        setProducts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    return (
        <>
            <Meta title={'My Products'} />
            <BreadCrumb title="My Products" />
            <div className="store-wrapper home-wrapper-2 py-5">
                <div className="row">
                    <div className="col-9">
                        <div className="filter-sort-grid mb-4">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center gap-10">
                                    <p className="mb-0 d-block" style={{ width: '100px' }}>
                                        Sort By:
                                    </p>
                                    <select name="" className="form-control form-select" id="">
                                        <option value="manual">Featured</option>
                                        <option value="best-selling">
                                            Best Selling
                                        </option>
                                        <option value="title-ascending">Alphabetically, A-Z</option>
                                        <option value="title-descending">Alphabetically, Z-A</option>
                                        <option value="price-ascending">Price, low to high</option>
                                        <option value="price-descending">Price, high to low</option>
                                        <option value="created-ascending">Date, old to new</option>
                                        <option value="created-descending">Date, new to old</option>
                                    </select>
                                </div>
                                <div className="d-flex align-items-center gap-5">
                                    <Link className="button" onClick={() =>setIsOpen(true)}>Add Product</Link>
                                </div>
                                <div className="d-flex align-items-center gap-10">
                                    <p className="totalproducts">21 products</p>
                                </div>
                            </div>
                        </div>
                        <div className="products-list pb-5">
                            <div className="d-flex gap-10 flex-wrap">
                                {products.map((product) => (
                                    <SellerProductCard
                                        key={product.id}
                                        productId={product.id}
                                        grid={grid}
                                        productImage={product.image}
                                        brand={product.brand}
                                        productName={product.name}
                                        productDescription={product.description}
                                        productPrice={product.price}
                                        productStock={product.stock || 'Not available'}
                                        editOnClick={() => handleEditOnClick(product)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AddProductModal open={isOpen} onClose={() => setIsOpen(false)} onProductAdd={refreshProducts} />
            {selectedProduct && (
                <UpdateProductModal
                    open={isUpdateOpen}
                    onClose={() => setIsUpdateOpen(false)}
                    productId={selectedProduct.id}
                    productImage={selectedProduct.image}
                    brand={selectedProduct.brand}
                    productName={selectedProduct.name}
                    productDescription={selectedProduct.description}
                    productPrice={selectedProduct.price}
                    productStock={selectedProduct.stock || 'Not available'}
                    onProductUpdate={refreshProducts}
                />
            )}
        </>
    );
};

export default MyProducts


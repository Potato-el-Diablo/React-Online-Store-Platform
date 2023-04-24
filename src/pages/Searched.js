import React, {useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom';
import {collection, getDocs} from "firebase/firestore";
import {db} from "./firebase";
import ProductCard from "../components/ProductCard";


const Searched = () => {
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

    //console.log(products);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('q');

    // Filter the products based on the search query in the productName
    const filteredProducts = products.filter((product) =>
        (product.name &&
        product.name.toLowerCase().includes(searchQuery.toLowerCase())) || (product.brand &&
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    console.log(filteredProducts)


    return (
        <div>
            <h1>Searched: {searchQuery}</h1>
            <div className="row">
                {filteredProducts.map((product) => (
                    <ProductCard
                        key={product.id}
                        grid={4}
                        productImage={product.image}
                        brand={product.brand}
                        productName={product.name}
                        productDescription={product.description}
                        productPrice={product.price}
                        productStock={product.stock}
                    />
                ))}
            </div>
        </div>
    );
};

export default Searched;
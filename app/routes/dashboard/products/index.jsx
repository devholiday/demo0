import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore"; 
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import ProductAdmin from "~/components/ProductAdmin";
import { Link } from "@remix-run/react";

export default function Products() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const db = getFirestore();
        const storage = getStorage();
        
        const fetchProducts = async () => {
          const products = [];
          
          const querySnapshot = await getDocs(collection(db, "products"));
          querySnapshot.forEach((doc) => {
            products.push({
              id: doc.id,
              ...doc.data(),
              filepath: doc.data().image ? 'images/' + doc.id + '/' + doc.data().image : null
            });
          });
    
          for (let p of products) {
            const url = p.filepath ? await getDownloadURL(ref(storage, p.filepath)) : null;
            p.url = url;
          }
    
          setProducts(products);
        };
    
        fetchProducts();
      }, []);

    return (
        <>
            <h1>Product list</h1>
            <div>
                <Link to="/dashboard/products/new">Add product</Link>
            </div>
            <div className="row row-cols-1 row-cols-md-3 g-4">
                {products.map(p => <ProductAdmin key={p.id} product={p} />)}
            </div>
        </>
    )
}
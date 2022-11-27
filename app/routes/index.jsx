import { useEffect, useState } from "react";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, getRedirectResult, getAdditionalUserInfo } from "firebase/auth";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import Product from "~/components/Product";

export default function Index() {  
  const [products, setProducts] = useState([]);
  
  const storage = getStorage();

  useEffect(() => {
      const auth = getAuth();
      const db = getFirestore();

      getRedirectResult(auth)
        .then(async (result) => {
            // This gives you a Google Access Token. You can use it to access Google APIs.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
      
            // The signed-in user info.
            const user = result.user;
            
            try {
                const {isNewUser} = getAdditionalUserInfo(result);
                if (isNewUser) {
                    const {accessToken, displayName, email, emailVerified, uid} = user;
              
                    const docRef = await addDoc(collection(db, "users"), {accessToken, displayName, email, emailVerified, uid});
                    console.log("Document written with ID: ", docRef.id);
                }
              } catch (e) {
                console.log(e);
                console.error("Error adding document: ", e);
              }
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
      
            if (error.customData) {
                const email = error.customData.email;
            }
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
        });
  }, []);

  useEffect(() => {
    const db = getFirestore();
    
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

  const buy = productId => {
    let cart = localStorage.getItem('cart');
    if (!cart) {
        cart = {
            products: {}
        };
    } else {
        cart = JSON.parse(cart);
    }

    if (!cart.products[productId]) {
        cart.products[productId] = 1;
        localStorage.setItem('cart', JSON.stringify(cart));   
    } else {
        cart.products[productId] += 1;
        localStorage.setItem('cart', JSON.stringify(cart));   
    }
};

  return (
    <>
      <h1>Products</h1>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {products.map(p => <Product key={p.id} product={p} buy={buy} />)}
      </div>
    </>
  );
}

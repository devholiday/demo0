import { useState, useEffect } from "react";
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, limit, serverTimestamp } from "firebase/firestore"; 
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";
import ProductCart from "~/components/ProductCart";
import { useForm, useFieldArray } from "react-hook-form";
import { useOutletContext, useNavigate } from "react-router-dom";

const Cart = () => {
    const {isAuth} = useOutletContext();
    const navigate = useNavigate();

    const db = getFirestore();
    const storage = getStorage();

    const { register, control, reset, setValue, getValues, handleSubmit} = useForm();
    const { fields, remove } = useFieldArray({control, name: "products"});

    useEffect(() => {
        const fetchProducts = async productsCart => {
            const productIds = Object.keys(productsCart);
            if (productIds.length === 0) return;

            const products = [];

            const q = query(collection(db, "products"), where('__name__', 'in', productIds));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                products.push({
                  id: doc.id,
                  ...doc.data(),
                  quantity: productsCart[doc.id],
                  total: doc.data().price,
                  filepath: doc.data().image ? 'images/' + doc.id + '/' + doc.data().image : null
                });
              });

            for (let p of products) {
                const url = p.filepath ? await getDownloadURL(ref(storage, p.filepath)) : null;
                p.url = url;
            }

            reset({'products': products});
        }

        const cart = localStorage.getItem('cart');
        if (!cart) return;

        const productsCart = JSON.parse(cart).products;
        fetchProducts(productsCart);
    }, []);
    
    const onSubmit = async data => {
        try {
            const auth = getAuth();

            const user = auth.currentUser;
            if (user) {
                let lastNum = 0;
                const q = query(collection(db, "orders"), orderBy("createdAt", "desc"), limit(1));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    console.log(doc.id);
                    lastNum = doc.data().number;
                });

                const total = getValues('products').reduce((acc, p) => acc + p.price, 0);
                const docRef = await addDoc(collection(db, "orders"), 
                {userUID: user.uid, displayName: user.displayName, email: user.email, products: getValues('products'), total, number: lastNum + 1,
                    createdAt: serverTimestamp()});
                console.log("Order with ID has completed: ", docRef.id);

                localStorage.removeItem('cart');

                navigate('/');
            } else {
                console.log("Order failed.");
            }
          } catch (e) {
            console.log(e);
            console.error("Error adding document: ", e);
          }
    };

    const removeProduct = (index, productId) => {
        remove(index);
        
        let cart = localStorage.getItem('cart');
        if (!cart) return;
        cart = JSON.parse(cart);
        if (cart.products[productId]) {
            delete cart.products[productId];
            localStorage.setItem('cart', JSON.stringify(cart));   
        }
    };

    return (
        <>
            <h1>Cart</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                
            <div className="row row-cols-1 row-cols-md-3 mb-3 text-center">
                    {fields.map((item, index) => (
                        <div key={item.id} className="col">
                            <div className="card" style={{width: "18rem"}} >
                                <div className="card-body">
                                    <h5 className="card-title">{item.title}</h5>
                                    {item.url && <img className="img-thumbnail" src={item.url} />}
                                    <p>${item.price}</p>
                                
                                    <div>
                                    <button type="button" onClick={() => setValue(`products.${index}.quantity`, getValues(`products.${index}.quantity`)+1)}>+</button>
                                    <input {...register(`products.${index}.quantity`)} className="form-control" style={{width: '60px', display: 'inline-block'}}/>
                                    <button type="button" onClick={() => setValue(`products.${index}.quantity`, getValues(`products.${index}.quantity`)-1)}>-</button>
                                    </div>
                                    <button type="button" className="btn btn-danger mt-3" onClick={() => removeProduct(index, getValues(`products.${index}.id`))}>Delete</button>
                                </div>
                            </div>
                        </div>
                        ))}
                    </div>

                    {fields.length > 0 ? 
                     isAuth ? <input type="submit" className="btn btn-primary mt-3" value="Checkout" /> : <p>Please sign-in by Google to checkout</p> : 
                    <p>Cart is empty</p> }
                </form>
        </>
    );
};

export default Cart;
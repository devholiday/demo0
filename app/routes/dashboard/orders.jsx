import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, orderBy, limit, query } from "firebase/firestore"; 
import Order from "~/components/Order";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const db = getFirestore();

    useEffect(() => {    
        const fetchOrders = async () => {
          let orders = [];
          
          const q = query(collection(db, "orders"), orderBy("createdAt", "desc"), limit(35));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach(doc => {
            const data = doc.data();

            orders.push({
              id: doc.id,
              ...doc.data()
            });
          });

          setOrders(orders);
        };
    
        fetchOrders();
      }, []);

    return (
        <>
            <h1>Orders</h1>
            <div>
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">OrderID</th>
                      <th scope="col">Name</th>
                      <th scope="col">Email</th>
                      <th scope="col">Products</th>
                      <th scope="col">Total</th>
                      <th scope="col">Created at</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => <Order key={o.id} order={o} />)}
                  </tbody>
                </table>
            </div>
        </>
    )
}
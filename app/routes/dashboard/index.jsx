import { Link } from "@remix-run/react";

const Index = () => {
    return (
        <>
            <h1>Dashboard</h1>
            <ul>
                <li>
                    <Link to="/dashboard/products" className="nav-link">Products</Link>
                </li>
                <li>
                    <Link to="/dashboard/orders" className="nav-link">Orders</Link>
                </li>
            </ul>
        </>
    );
};

export default Index;
import { Link } from "@remix-run/react";

const Product = ({product:p}) => {
    return (
        <div className="col">
            <div className="card h-100">
            {p.url && <img src={p.url} className="card-img-top" alt={p.title} />}
            <div className="card-body">
                <h5 className="card-title">{p.title}</h5>
                <p className="card-text">${p.price}</p>
            </div>
            <div className="card-footer">
                <Link to={'/dashboard/products/'+p.id+'/edit'}>Edit</Link>
            </div>
            </div>
        </div>
    );
};

export default Product;
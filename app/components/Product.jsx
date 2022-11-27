const Product = ({product:p, buy}) => {
    return (
        <div className="col">
            <div className="card h-100">
            {p.url && <img src={p.url} className="card-img-top" alt={p.title} />}
            <div className="card-body">
                <h5 className="card-title">{p.title}</h5>
                <p className="card-text">${p.price}</p>
            </div>
            <div className="card-footer">
                <button onClick={() => buy(p.id)}>Buy</button>
            </div>
            </div>
        </div>
    );
};

export default Product;
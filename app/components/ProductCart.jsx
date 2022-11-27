const ProductCart = ({product:p, actions}) => {
    const {deleteProductFromCart} = actions;

    return (
          <div className="card mb-3" style={{maxWidth: '540px'}}>
        <div className="row g-0">
          <div className="col-md-4">
            <img src={p.url} className="img-fluid rounded-start" alt={p.title} />
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h5 className="card-title">{p.title}</h5>
              <p className="card-text">${p.price}</p>
              <div>
                <button>+</button>
                <input />
                <button>-</button>
              </div>
              <p className="card-text">
                <button onClick={() => deleteProductFromCart(p.id)}>Delete</button>
                </p>
            </div>
          </div>
        </div>
      </div>
    );
};

export default ProductCart;
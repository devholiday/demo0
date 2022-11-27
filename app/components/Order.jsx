const Order = ({order:o}) => {
    const date = new Date(+(o.createdAt.seconds+'000'));
    const createdAt = `${date.getDate()}.${date.getMonth()}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;

    return (
        <tr>
            <th scope="row">#{o.number}</th>
            <td>{o.displayName}</td>
            <td>{o.email}</td>
            <td>
                <table className="table mb-0">
                    <thead>
                        <tr>
                            <th scope="col">Title</th>
                            <th scope="col">Price</th>
                            <th scope="col">Quantity</th>
                            <th scope="col">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                       {o.products.map(p => <tr key={p.id}>
                            <th scope="row">{p.title}</th>
                            <td>${p.price}</td>
                            <td>{p.quantity}</td>
                            <td>${p.total}</td>
                         </tr>)}
                    </tbody>
                </table>
            </td>
            <td>${o.total}</td>
            <td>{createdAt}</td>
        </tr>
    );
};

export default Order;
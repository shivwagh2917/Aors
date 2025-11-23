import React, { useEffect, useState } from 'react';
import API from '../api';

export default function AdminProducts(){
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: 0, stock: 0 });

  const fetchProducts = async () => {
    const res = await API.get('/products');
    setProducts(res.data);
  };

  useEffect(() => { fetchProducts(); }, []);

  const create = async () => {
    try {
      await API.post('/products', form);
      setForm({ name: '', description: '', price: 0, stock: 0 });
      fetchProducts();
    } catch (e) {
      alert(e.response?.data?.message || 'Error creating product');
    }
  };

  const remove = async id => {
    try {
      await API.delete(`/products/${id}`);
      fetchProducts();
    } catch (e) {
      alert('Error deleting product');
    }
  };

  return (
    <div className="container">
      <h2>Admin — Products</h2>
      <div>
        <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <input placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
        <input placeholder="Stock" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
        <button onClick={create}>Add Product</button>
      </div>
      <table>
        <thead>
          <tr><th>Name</th><th>Price</th><th>Stock</th><th>Action</th></tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>{p.stock}</td>
              <td><button onClick={() => remove(p._id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

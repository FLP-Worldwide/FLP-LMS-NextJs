// src/app/admin/products/page.jsx
"use client";

import React, { useState } from "react";

const initialProducts = [
  {
    id: 1,
    name: "Handmade Wooden Bowl",
    categoryId: 3,
    price: 1499,
    currency: "INR",
    image: "",
    variants: [{ id: "v1", name: "Small" }, { id: "v2", name: "Large" }],
    createdAt: "2025-12-02",
  },
  {
    id: 2,
    name: "Embroidered Cushion",
    categoryId: 2,
    price: 799,
    currency: "INR",
    image: "",
    variants: [],
    createdAt: "2025-11-20",
  },
];

const sampleCategories = [
  { id: 1, name: "Home Decor" },
  { id: 2, name: "Handicrafts" },
  { id: 3, name: "Wooden Bowls" },
];

export default function ProductsPage() {
  const [products, setProducts] = useState(initialProducts);
  const [categories] = useState(sampleCategories);

  // form state
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [variants, setVariants] = useState([{ id: Date.now().toString(), name: "" }]);

  const resetForm = () => {
    setEditing(null);
    setName("");
    setCategoryId("");
    setPrice("");
    setImage("");
    setVariants([{ id: Date.now().toString(), name: "" }]);
  };

  const openCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setName(p.name);
    setCategoryId(p.categoryId || "");
    setPrice(p.price || "");
    setImage(p.image || "");
    setVariants(p.variants.length ? p.variants.map(v => ({ ...v })) : [{ id: Date.now().toString(), name: "" }]);
    setShowModal(true);
  };

  const saveProduct = () => {
    if (!name.trim()) return alert("Product name required");
    if (!categoryId) return alert("Select category");
    const payload = {
      id: editing ? editing.id : Date.now(),
      name: name.trim(),
      categoryId: Number(categoryId),
      price: Number(price || 0),
      currency: "INR",
      image: image.trim(),
      variants: variants.filter(v => v.name.trim()),
      createdAt: editing ? editing.createdAt : new Date().toISOString().slice(0,10),
    };

    if (editing) {
      setProducts(prev => prev.map(p => p.id === editing.id ? payload : p));
    } else {
      setProducts(prev => [payload, ...prev]);
    }
    setShowModal(false);
    resetForm();
  };

  const deleteProduct = (id) => {
    if (!confirm("Delete product?")) return;
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // variants helpers
  const updateVariant = (id, value) => {
    setVariants(prev => prev.map(v => v.id === id ? { ...v, name: value } : v));
  };
  const addVariant = () => setVariants(prev => [...prev, { id: Date.now().toString(), name: "" }]);
  const removeVariant = (id) => setVariants(prev => prev.filter(v => v.id !== id));

  const findCategory = (id) => categories.find(c => c.id === id)?.name || "—";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Products</h2>
          <p className="text-sm text-gray-500">Manage products, categories, pricing and variants.</p>
        </div>

        <div>
          <button onClick={openCreate} className="px-3 py-2 rounded-md bg-emerald-600 text-white text-sm hover:bg-emerald-700 transition">
            + Add Product
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-xs border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold">Product List</h3>
          <div className="text-sm text-gray-500">{products.length} total</div>
        </div>

        <div className="overflow-x-auto rounded-md">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-2 px-4 text-xs font-medium text-gray-600">Product</th>
                <th className="py-2 px-4 text-xs font-medium text-gray-600">Category</th>
                <th className="py-2 px-4 text-xs font-medium text-gray-600">Price</th>
                <th className="py-2 px-4 text-xs font-medium text-gray-600">Variants</th>
                <th className="py-2 px-4 text-xs font-medium text-gray-600">Image</th>
                <th className="py-2 px-4 text-xs font-medium text-gray-600">Action</th>
              </tr>
            </thead>

            <tbody className="border-t border-gray-300 divide-y divide-gray-200">
              {products.map(p => (
                <tr key={p.id}>
                  <td className="py-2 px-4 text-sm font-medium">{p.name}</td>
                  <td className="py-2 px-4 text-sm text-gray-700">{findCategory(p.categoryId)}</td>
                  <td className="py-2 px-4 text-sm">{p.currency} {p.price.toLocaleString()}</td>
                  <td className="py-2 px-4 text-sm">
                    {p.variants.length ? p.variants.map(v => v.name).join(", ") : "—"}
                  </td>
                  <td className="py-2 px-4 text-sm">
                    {p.image ? <img src={p.image} alt={p.name} className="h-10 w-10 object-cover rounded" /> : "—"}
                  </td>
                  <td className="py-2 px-4 text-sm">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(p)} className="px-3 py-1 rounded-md border border-gray-200 text-sm hover:bg-gray-50">Edit</button>
                      <button onClick={() => deleteProduct(p.id)} className="px-3 py-1 rounded-md border border-red-200 text-sm text-red-600 hover:bg-red-50">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-end">
          <div className="text-sm text-gray-500">1</div>
        </div>
      </div>

      {/* modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-xl p-6">
            <h3 className="text-lg font-semibold mb-3">{editing ? "Edit Product" : "Add Product"}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-600">Product name</label>
                <input className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={name} onChange={e => setName(e.target.value)} />
              </div>

              <div>
                <label className="text-sm text-gray-600">Category</label>
                <select className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={categoryId} onChange={e => setCategoryId(e.target.value)}>
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600">Price</label>
                <input type="number" className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={price} onChange={e => setPrice(e.target.value)} />
              </div>

              <div>
                <label className="text-sm text-gray-600">Image URL (optional)</label>
                <input className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={image} onChange={e => setImage(e.target.value)} />
                {image && <img src={image} alt="preview" className="mt-2 h-20 w-20 object-cover rounded" />}
              </div>

              <div className="md:col-span-2">
                <label className="text-sm text-gray-600">Variants</label>
                <div className="space-y-2 mt-1">
                  {variants.map(v => (
                    <div key={v.id} className="flex items-center gap-2">
                      <input className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm" value={v.name} onChange={e => updateVariant(v.id, e.target.value)} />
                      <button onClick={() => removeVariant(v.id)} className="px-2 py-1 rounded-md border border-red-200 text-sm text-red-600">Remove</button>
                    </div>
                  ))}
                  <div>
                    <button onClick={addVariant} className="px-3 py-1 rounded-md border border-gray-200 text-sm">+ Add variant</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button onClick={() => { setShowModal(false); resetForm(); }} className="px-3 py-1 rounded-md border border-gray-200">Cancel</button>
              <button onClick={saveProduct} className="px-3 py-1 rounded-md bg-emerald-600 text-white">{editing ? "Save" : "Create"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

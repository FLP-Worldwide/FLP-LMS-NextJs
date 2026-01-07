"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { api } from "@/utils/api";

/* ---------------- FORMS ---------------- */
const emptyCategoryForm = {
  name: "",
  code: "",
  description: "",
};

const emptyAssetForm = {
  code: "",
  name: "",
  asset_category_id: "",
  quantity: "",
  condition: "",
  asset_location_id: "",
};

export default function ItemsCategoryTab() {
  /* ---------------- CATEGORY ---------------- */
  const [categoriesTable, setCategoriesTable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [categoryForm, setCategoryForm] = useState(emptyCategoryForm);
  const [assets, setAssets] = useState([]);
const [showCategoryDrawer, setShowCategoryDrawer] = useState(false);
const [editingAssetId, setEditingAssetId] = useState(null);


  /* ---------------- ASSET ---------------- */
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [assetForm, setAssetForm] = useState(emptyAssetForm);
  const [categoriesDropdown, setCategoriesDropdown] = useState([]);
  const [locationsDropdown, setLocationsDropdown] = useState([]);

  /* =====================================================
     CATEGORY APIs
  ===================================================== */
  const fetchAssets = async () => {
    setLoading(true);
    try {
      const res = await api.get("/assets");
      setAssets(res.data?.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const openEditAsset = (asset) => {
    fetchCategoryDropdown();
    fetchLocationsDropdown();

    setAssetForm({
      code: asset.code || "",
      name: asset.name || "",
      asset_category_id: asset.asset_category_id || asset.category?.id || "",
      asset_location_id: asset.asset_location_id || asset.location?.id || "",
      quantity: asset.quantity || "",
      condition: asset.condition || "",
    });

    setEditingAssetId(asset.id);
    setShowAssetModal(true);
  };

  const fetchCategoryTable = async () => {
    setLoading(true);
    try {
      const res = await api.get("/asset-categories");
      setCategoriesTable(res.data?.data || []);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryDropdown = async () => {
    const res = await api.get("/asset-categories");
    setCategoriesDropdown(res.data?.data || []);
  };

  const saveCategory = async () => {
    try {
      if (editingCategoryId) {
        await api.patch(
          `/asset-categories/${editingCategoryId}`,
          categoryForm
        );
      } else {
        await api.post("/asset-categories", categoryForm);
      }

      setShowCategoryModal(false);
      setCategoryForm(emptyCategoryForm);
      setEditingCategoryId(null);

      fetchCategoryTable();
      fetchCategoryDropdown(); // 🔥 refresh asset dropdown
    } catch {
      alert("Failed to save category");
    }
  };

  const deleteCategory = async (id) => {
    if (!confirm("Delete category?")) return;

    try {
      await api.delete(`/asset-categories/${id}`);

      // 🔥 Refresh everywhere
      fetchCategoryTable();      // if you still keep table data
      fetchCategoryDropdown();   // refresh drawer + asset modal dropdown
    } catch {
      alert("Failed to delete category");
    }
  };

  const openEditCategory = (c) => {
    setCategoryForm({
      name: c.name || "",
      code: c.code || "",
      description: c.description || "",
    });
    setEditingCategoryId(c.id);
    setShowCategoryModal(true);
  };

  /* =====================================================
     ASSET APIs
  ===================================================== */

  const fetchLocationsDropdown = async () => {
    const res = await api.get("/asset-locations");
    setLocationsDropdown(res.data?.data || []);
  };

  const openAssetModal = () => {
    fetchCategoryDropdown();
    fetchLocationsDropdown();
    setAssetForm(emptyAssetForm);
    setShowAssetModal(true);
  };


  const saveAsset = async () => {
    try {
      if (editingAssetId) {
        // UPDATE
        await api.patch(`/assets/${editingAssetId}`, assetForm);
      } else {
        // CREATE
        await api.post("/assets", assetForm);
      }

      setShowAssetModal(false);
      setAssetForm(emptyAssetForm);
      setEditingAssetId(null);

      fetchAssets(); // 🔥 refresh table
    } catch {
      alert("Failed to save asset");
    }
  };

  const deleteAsset = async (id) => {
    if (!confirm("Delete asset?")) return;

    try {
      await api.delete(`/assets/${id}`);
      fetchAssets(); // 🔥 refresh table
    } catch {
      alert("Failed to delete asset");
    }
  };


  useEffect(() => {
    fetchCategoryTable();
  }, []);

  /* =====================================================
     UI
  ===================================================== */

  return (
    <>
      {/* ACTION BUTTONS */}
      <div className="flex justify-end gap-2">
        <PrimaryButton name="+ Add Asset" onClick={openAssetModal} />
 
        <PrimaryButton
          name="Manage Categories"
          onClick={() => {
            fetchCategoryDropdown();
            setShowCategoryDrawer(true);
          }}
        />

      </div>

      {/* CATEGORY TABLE */}
      {loading ? (
        <div className="text-sm text-gray-500">Loading...</div>
      ) : assets.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-sm text-gray-500 text-center">
          No assets available
        </div>
      ) : (
        <table className="w-full text-sm bg-white border border-gray-200 rounded-xl">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Code</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Location</th>
              <th className="px-4 py-2 text-left">Qty</th>
              <th className="px-4 py-2 text-left">Condition</th>
              <th className="px-4 py-2 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {assets.map((a) => (
              <tr key={a.id}>
                <td className="px-4 py-2">{a.code}</td>
                <td className="px-4 py-2">{a.name}</td>
                <td className="px-4 py-2">{a.category?.code}</td>
                <td className="px-4 py-2">{a.location?.name}</td>
                <td className="px-4 py-2">{a.quantity}</td>
                <td className="px-4 py-2">{a.condition}</td>
                <td className="px-4 py-2 text-right">
                  <EditOutlined
                    className="mr-3 cursor-pointer text-blue-600"
                    onClick={() => openEditAsset(a)}
                  />
                  <DeleteOutlined
                    className="cursor-pointer text-rose-600"
                    onClick={() => deleteAsset(a.id)}
                  />
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ================= CATEGORY MODAL (TOP) ================= */}
      {showCategoryModal && (
        <Modal title="Add Item Category" onClose={() => setShowCategoryModal(false)} zIndex={100}>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="soft-label">Category Name *</label>
              <input
                className="soft-input"
                value={categoryForm.name}
                onChange={(e) =>
                  setCategoryForm({ ...categoryForm, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="soft-label">Code</label>
              <input
                className="soft-input"
                value={categoryForm.code}
                onChange={(e) =>
                  setCategoryForm({ ...categoryForm, code: e.target.value })
                }
              />
            </div>

            <div className="col-span-3">
              <label className="soft-label">Description</label>
              <input
                className="soft-input"
                value={categoryForm.description}
                onChange={(e) =>
                  setCategoryForm({
                    ...categoryForm,
                    description: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              className="soft-btn-outline"
              onClick={() => setShowCategoryModal(false)}
            >
              Cancel
            </button>
            <PrimaryButton name="Save" onClick={saveCategory} />
          </div>
        </Modal>
      )}


      {/* ================= ASSET MODAL ================= */}
      {showAssetModal && (
        <Modal title="Add Asset" onClose={() => setShowAssetModal(false)}>
          <div className="grid grid-cols-2 gap-4">
            
             <div>
              <label className="soft-label">Location</label>
              <select
                className="soft-select"
                value={assetForm.asset_location_id}
                onChange={(e) =>
                  setAssetForm({
                    ...assetForm,
                    asset_location_id: e.target.value,
                  })
                }
              >
                <option value="">Select Location</option>
                {locationsDropdown.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="soft-label">Category *</label>
              <div className="flex gap-2">
                <select
                  className="soft-select flex-1"
                  value={assetForm.asset_category_id}
                  onChange={(e) =>
                    setAssetForm({
                      ...assetForm,
                      asset_category_id: e.target.value,
                    })
                  }
                >
                  <option value="">Select category</option>
                  {categoriesDropdown.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code}
                    </option>
                  ))}
                </select>

                {/* ADD CATEGORY INLINE */}
                <button
                  className="soft-btn-outline"
                  onClick={() => setShowCategoryModal(true)}
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="soft-label">Code (Eg: LATP01)</label>
              <input
                className="soft-input"
                value={assetForm.code}
                onChange={(e) =>
                  setAssetForm({ ...assetForm, code: e.target.value })
                }
              />
            </div>

           

            <div>
              <label className="soft-label">Name *</label>
              <input
                className="soft-input"
                value={assetForm.name}
                onChange={(e) =>
                  setAssetForm({ ...assetForm, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="soft-label">Quantity *</label>
              <input
                type="number"
                className="soft-input"
                value={assetForm.quantity}
                onChange={(e) =>
                  setAssetForm({ ...assetForm, quantity: e.target.value })
                }
              />
            </div>

            <div>
              <label className="soft-label">Condition *</label>
              <select
                className="soft-select"
                value={assetForm.condition}
                onChange={(e) =>
                  setAssetForm({ ...assetForm, condition: e.target.value })
                }
              >
                <option value="">Select condition</option>
                <option>New</option>
                <option>Good</option>
                <option>Damaged</option>
              </select>
            </div>

           
          </div>

          <div className="flex justify-end gap-2 pt-6">
            <button
              className="soft-btn-outline"
              onClick={() => setShowAssetModal(false)}
            >
              Cancel
            </button>
            <PrimaryButton name="Add Asset" onClick={saveAsset} />
          </div>
        </Modal>
      )}

      {/* ================= CATEGORY DRAWER ================= */}
      {showCategoryDrawer && (
        <div className="fixed inset-y-0 right-0 w-96 bg-white border-l border-gray-200 shadow-xl z-40 flex flex-col">
          
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h3 className="font-semibold">Item Categories</h3>
            <button onClick={() => setShowCategoryDrawer(false)}>✕</button>
          </div>

          {/* Body (SCROLLABLE) */}
          <div className="flex-1 p-4 space-y-2 overflow-y-auto">
            {categoriesDropdown.length === 0 ? (
              <p className="text-sm text-gray-500">No categories found</p>
            ) : (
              categoriesDropdown.map((c) => (
                <div
                  key={c.id}
                  className="flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-xs text-gray-500">{c.code}</p>
                  </div>

                  <div className="flex gap-2">
                    <EditOutlined
                      className="text-blue-600 cursor-pointer"
                      onClick={() => openEditCategory(c)}
                    />
                    <DeleteOutlined
                      className="text-rose-600 cursor-pointer"
                      onClick={() => deleteCategory(c.id)}
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer (FIXED AT BOTTOM) */}
          <div className="p-4 border-t border-gray-200 bg-white sticky bottom-0">
            <PrimaryButton
              name="+ Add Category"
              onClick={() => {
                setEditingCategoryId(null);
                setCategoryForm(emptyCategoryForm);
                setShowCategoryModal(true);
              }}
            />
          </div>
        </div>
      )}

      
    </>
  );
}

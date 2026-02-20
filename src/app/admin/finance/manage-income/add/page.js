"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import PrimaryButton from "@/components/ui/PrimaryButton";
import Modal from "@/components/ui/Modal";

export default function IncomePage() {

  /* ================= DATA ================= */
  const [payers, setPayers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [items, setItems] = useState([]);
  const emptyPayerForm = {
    title: "Mr.",
    display_name: "",
    name: "",
    company_name: "",
    vendor_type: "Customer",
    email: "",
    contact_no: "",
    address: "",
  };

  const [showPayerModal, setShowPayerModal] = useState(false);
  const [payerForm, setPayerForm] = useState(emptyPayerForm);

    const emptyAccountForm = {
      owner_type: "payer", // default because income me payer hi hoga
      owner_id: "",
      account_name: "",
      account_type: "Cash",
      upi_id: "",
      bank_name: "",
      account_no: "",
      ifsc: "",
      description: "",
    };
  
    const [showAccountModal, setShowAccountModal] = useState(false);
    const [accountForm, setAccountForm] = useState(emptyAccountForm);
  
  
    const emptyCategoryForm = {
      name: "",
      description: "",
      type: "Income", // 🔥 default because Expense page
    };
  
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [categoryForm, setCategoryForm] = useState(emptyCategoryForm);



      const saveAccount = async () => {
        if (!accountForm.account_name) {
          return alert("Account Name required");
        }
    
        await api.post("/finance/accounts", {
          account_for: "payer",
          accountable_id: accountForm.owner_id,
          account_name: accountForm.account_name,
          account_type: accountForm.account_type,
          upi_id:
            accountForm.account_type === "UPI"
              ? accountForm.upi_id
              : null,
          bank_name:
            accountForm.account_type === "Bank"
              ? accountForm.bank_name
              : null,
          account_no:
            accountForm.account_type === "Bank"
              ? accountForm.account_no
              : null,
          ifsc:
            accountForm.account_type === "Bank"
              ? accountForm.ifsc
              : null,
          description: accountForm.description,
        });
    
        alert("Account added successfully");
    
        setShowAccountModal(false);
        setAccountForm(emptyAccountForm);
    
        // 🔥 refresh accounts dropdown
        handlePayerChange(form.payer_id);
      };
    
    
      const saveCategory = async () => {
        if (!categoryForm.name) {
          return alert("Category name required");
        }
    
        try {
          await api.post("/finance/category", categoryForm);
    
          alert("Category added successfully");
    
          setShowCategoryModal(false);
          setCategoryForm(emptyCategoryForm);
    
          // 🔥 refresh category dropdown
          fetchInitial();
    
        } catch (e) {
          alert("Failed to save category");
        }
      };
    


  /* ================= FORM ================= */
  const [form, setForm] = useState({
    payment_mode: "Cash",
    payer_id: "",
    finance_account_id: "",
    payment_date: "",
    transaction_id: "",
    cheque_no: "",
    remark: "",
    category: "",
    description: "",
    quantity: 1,
    amount: "",
  });

  /* ================= FETCH INITIAL ================= */
  useEffect(() => {
    fetchInitial();
  }, []);

  const fetchInitial = async () => {
    const [p, c] = await Promise.all([
      api.get("/finance/payer"),
      api.get("/finance/category?type=Income"),
    ]);

    setPayers(Array.isArray(p.data) ? p.data : []);
    setCategories(Array.isArray(c.data.data) ? c.data.data : []);
  };

  /* ================= FETCH ACCOUNTS ================= */
  const handlePayerChange = async (payerId) => {
    setForm({
      ...form,
      payer_id: payerId,
      finance_account_id: "",
    });

    if (!payerId) {
      setAccounts([]);
      return;
    }

    const res = await api.get(`/finance/accounts/payer/${payerId}`);
    setAccounts(Array.isArray(res.data?.data) ? res.data.data : []);
  };

  /* ================= ADD ITEM ================= */
  const addItem = () => {
    if (!form.category || !form.amount) {
      return alert("Category and Amount required");
    }

    const newItem = {
      category: form.category,
      description: form.description,
      quantity: Number(form.quantity),
      amount: Number(form.amount),
    };

    setItems([...items, newItem]);

    setForm({
      ...form,
      category: "",
      description: "",
      quantity: 1,
      amount: "",
    });
  };

  /* ================= SAVE INCOME ================= */
  const saveIncome = async () => {
    if (!form.payer_id || !form.finance_account_id || !form.payment_date) {
      return alert("Fill required details");
    }

    if (items.length === 0) {
      return alert("Add at least one item");
    }

    const payload = {
      payer_id: Number(form.payer_id),
      finance_account_id: Number(form.finance_account_id),
      payment_date: form.payment_date,
      payment_mode: form.payment_mode,
      transaction_id: form.transaction_id || null,
      cheque_no: form.cheque_no || null,
      remark: form.remark,
      items: items.map((i) => ({
        category: i.category,
        description: i.description,
        quantity: i.quantity,
        amount: i.amount,
      })),
    };

    await api.post("/finance/incomes", payload);

    alert("Income saved successfully");

    setItems([]);
    setForm({
      payment_mode: "Cash",
      payer_id: "",
      finance_account_id: "",
      payment_date: "",
      transaction_id: "",
      cheque_no: "",
      remark: "",
      category: "",
      description: "",
      quantity: 1,
      amount: "",
    });
  };


  const savePayer = async () => {
    if (!payerForm.display_name || !payerForm.contact_no) {
      return alert("Display Name & Contact required");
    }

    await api.post("/finance/payer", payerForm);

    alert("Payer added successfully");

    setShowPayerModal(false);
    setPayerForm(emptyPayerForm);

    fetchInitial(); // refresh dropdown
  };

  /* ================= TOTAL ================= */
  const totalAmount = items.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  return (
    <div className="space-y-6 p-6">

      <div className="bg-white border border-gray-200 rounded-xl p-6">

        {/* PAYMENT MODE */}
        <div className="mb-6">
          <label className="soft-label">Payment Mode *</label>
          <div className="flex gap-6 mt-2">
            {["Cash", "Bank", "Cheque", "Card"].map((mode) => (
              <label key={mode} className="flex items-center gap-2">
                <input
                  type="radio"
                  value={mode}
                  checked={form.payment_mode === mode}
                  onChange={(e) =>
                    setForm({ ...form, payment_mode: e.target.value })
                  }
                />
                {mode}
              </label>
            ))}
          </div>
        </div>

        {/* BASIC DETAILS */}
        <div className="grid grid-cols-4 gap-4">

          <div>
            <div className="flex justify-between items-center">
              <label className="soft-label">
                Payer <span className="text-red-500">*</span>
              </label>

              <button
                type="button"
                className="text-xs text-blue-600 hover:underline"
                onClick={() => {
                  setPayerForm(emptyPayerForm);
                  setShowPayerModal(true);
                }}
              >
                + Add Payer
              </button>
            </div>
            <select
              className="soft-select"
              value={form.payer_id}
              onChange={(e) => handlePayerChange(e.target.value)}
              disabled={items.length > 0}
            >
              <option value="">Select Payer</option>
              {payers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.display_name || p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center">
            <label className="soft-label">
              Account Name <span className="text-red-500">*</span>
            </label>

            <button
                type="button"
                className="text-xs text-blue-600 hover:underline"
                onClick={() => {
                  if (!form.payer_id) {
                    return alert("Select Payer first");
                  }

                  setAccountForm({
                    ...emptyAccountForm,
                    owner_id: form.payer_id,
                  });

                  setShowAccountModal(true);
                }}
              >
                + Add Account
              </button>
          </div>
            <select
              className="soft-select"
              value={form.finance_account_id}
              onChange={(e) =>
                setForm({ ...form, finance_account_id: e.target.value })
              }
              disabled={!form.payer_id}
            >
              <option value="">Select Account</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.account_type} ({a.account_name})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="soft-label">Date *</label>
            <input
              type="date"
              className="soft-input"
              value={form.payment_date}
              onChange={(e) =>
                setForm({ ...form, payment_date: e.target.value })
              }
            />
          </div>

          

          <div>

            <div className="flex justify-between items-center">
              <label className="soft-label">
                Item/ Category * <span className="text-red-500">*</span>
              </label>

              <button
                type="button"
                className="text-xs text-blue-600 hover:underline"
                onClick={() => {
                  setCategoryForm(emptyCategoryForm);
                  setShowCategoryModal(true);
                }}
              >
                + Add Category
              </button>
            </div>
            <select
              className="soft-select"
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="soft-label">Description</label>
            <input
              className="soft-input"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <div>
            <label className="soft-label">Quantity</label>
            <input
              type="number"
              className="soft-input"
              value={form.quantity}
              onChange={(e) =>
                setForm({ ...form, quantity: e.target.value })
              }
            />
          </div>

          <div>
            <label className="soft-label">Amount *</label>
            <input
              className="soft-input"
              type="number"
              value={form.amount}
              onChange={(e) =>
                setForm({ ...form, amount: e.target.value })
              }
            />
          </div>


          {/* Conditional fields */}
          {form.payment_mode === "Bank" || form.payment_mode === "Card" ? (
            <div>
              <label className="soft-label">Transaction ID *</label>
              <input
                className="soft-input"
                value={form.transaction_id}
                onChange={(e) =>
                  setForm({ ...form, transaction_id: e.target.value })
                }
              />
            </div>
          ) : null}

          {form.payment_mode === "Cheque" ? (
            <div>
              <label className="soft-label">Cheque No *</label>
              <input
                className="soft-input"
                value={form.cheque_no}
                onChange={(e) =>
                  setForm({ ...form, cheque_no: e.target.value })
                }
              />
            </div>
          ) : null}

          
        </div>

        <div className="flex justify-end pt-6">
          <PrimaryButton name="Add" onClick={addItem} />
        </div>
      </div>

      {/* ITEMS TABLE */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Qty</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {items.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No items added
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-2">{item.category}</td>
                  <td className="px-4 py-2">{item.description}</td>
                  <td className="px-4 py-2">{item.quantity}</td>
                  <td className="px-4 py-2 font-medium">
                    ₹{item.amount}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button
                      onClick={() =>
                        setItems(items.filter((_, i) => i !== index))
                      }
                      className="text-red-600"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="flex justify-between p-6">
          <div className="text-lg font-semibold">
            Total: ₹{totalAmount}
          </div>

          <PrimaryButton name="Save Income" onClick={saveIncome} />
        </div>
      </div>


      {showAccountModal && (
        <Modal
          title="Add Account"
          onClose={() => setShowAccountModal(false)}
        >
          <div className="space-y-4 p-6">
      
            <div>
              <label className="soft-label">
                Account Name <span className="text-red-500">*</span>
              </label>
              <input
                className="soft-input"
                value={accountForm.account_name}
                onChange={(e) =>
                  setAccountForm({
                    ...accountForm,
                    account_name: e.target.value,
                  })
                }
              />
            </div>
      
            <div>
              <label className="soft-label">
                Account Type <span className="text-red-500">*</span>
              </label>
              <select
                className="soft-select"
                value={accountForm.account_type}
                onChange={(e) =>
                  setAccountForm({
                    ...accountForm,
                    account_type: e.target.value,
                  })
                }
              >
                <option>Cash</option>
                <option>UPI</option>
                <option>Bank</option>
                <option>Cheque</option>
              </select>
            </div>
      
            {accountForm.account_type === "UPI" && (
              <div>
                <label className="soft-label">UPI ID</label>
                <input
                  className="soft-input"
                  value={accountForm.upi_id}
                  onChange={(e) =>
                    setAccountForm({
                      ...accountForm,
                      upi_id: e.target.value,
                    })
                  }
                />
              </div>
            )}
      
            {accountForm.account_type === "Bank" && (
              <>
                <div>
                  <label className="soft-label">Bank Name</label>
                  <input
                    className="soft-input"
                    value={accountForm.bank_name}
                    onChange={(e) =>
                      setAccountForm({
                        ...accountForm,
                        bank_name: e.target.value,
                      })
                    }
                  />
                </div>
      
                <div>
                  <label className="soft-label">Account Number</label>
                  <input
                    className="soft-input"
                    value={accountForm.account_no}
                    onChange={(e) =>
                      setAccountForm({
                        ...accountForm,
                        account_no: e.target.value,
                      })
                    }
                  />
                </div>
      
                <div>
                  <label className="soft-label">IFSC</label>
                  <input
                    className="soft-input"
                    value={accountForm.ifsc}
                    onChange={(e) =>
                      setAccountForm({
                        ...accountForm,
                        ifsc: e.target.value,
                      })
                    }
                  />
                </div>
              </>
            )}
      
            <div>
              <label className="soft-label">Description</label>
              <textarea
                className="soft-input"
                value={accountForm.description}
                onChange={(e) =>
                  setAccountForm({
                    ...accountForm,
                    description: e.target.value,
                  })
                }
              />
            </div>
          </div>
      
          <div className="flex justify-end gap-2 pt-4">
            <button
              className="soft-btn-outline"
              onClick={() => setShowAccountModal(false)}
            >
              Cancel
            </button>
            <PrimaryButton name="Save" onClick={saveAccount} />
          </div>
        </Modal>
      )}
      
      {showCategoryModal && (
        <Modal
          title="Add Category"
          onClose={() => setShowCategoryModal(false)}
        >
          <div className="space-y-4 p-6">
      
            <div>
              <label className="soft-label">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                className="soft-input"
                value={categoryForm.name}
                onChange={(e) =>
                  setCategoryForm({
                    ...categoryForm,
                    name: e.target.value,
                  })
                }
              />
            </div>
      
            <div>
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
      
            {/* Type hidden but fixed */}
            <input type="hidden" value="Income" />
      
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
      
{showPayerModal && (
  <Modal
    title="Add Payer"
    onClose={() => setShowPayerModal(false)}
  >
    <div className="grid grid-cols-3 gap-4">

      <div>
        <label className="soft-label">Title</label>
        <select
          className="soft-input"
          value={payerForm.title}
          onChange={(e) =>
            setPayerForm({ ...payerForm, title: e.target.value })
          }
        >
          <option>Mr.</option>
          <option>Ms.</option>
        </select>
      </div>

      <div>
        <label className="soft-label">
          Display Name <span className="text-red-500">*</span>
        </label>
        <input
          className="soft-input"
          value={payerForm.display_name}
          onChange={(e) =>
            setPayerForm({
              ...payerForm,
              display_name: e.target.value,
            })
          }
        />
      </div>

      <div>
        <label className="soft-label">Payer Name</label>
        <input
          className="soft-input"
          value={payerForm.name}
          onChange={(e) =>
            setPayerForm({
              ...payerForm,
              name: e.target.value,
            })
          }
        />
      </div>

      <div>
        <label className="soft-label">Vendor Type</label>
        <select
          className="soft-input"
          value={payerForm.vendor_type}
          onChange={(e) =>
            setPayerForm({
              ...payerForm,
              vendor_type: e.target.value,
            })
          }
        >
          <option>Customer</option>
        </select>
      </div>

      <div>
        <label className="soft-label">Email</label>
        <input
          className="soft-input"
          value={payerForm.email}
          onChange={(e) =>
            setPayerForm({
              ...payerForm,
              email: e.target.value,
            })
          }
        />
      </div>

      <div>
        <label className="soft-label">
          Contact <span className="text-red-500">*</span>
        </label>
        <input
          className="soft-input"
          value={payerForm.contact_no}
          onChange={(e) =>
            setPayerForm({
              ...payerForm,
              contact_no: e.target.value,
            })
          }
        />
      </div>

      <div>
        <label className="soft-label">Company</label>
        <input
          className="soft-input"
          value={payerForm.company_name}
          onChange={(e) =>
            setPayerForm({
              ...payerForm,
              company_name: e.target.value,
            })
          }
        />
      </div>

      <div className="col-span-3">
        <label className="soft-label">Address</label>
        <textarea
          className="soft-input"
          value={payerForm.address}
          onChange={(e) =>
            setPayerForm({
              ...payerForm,
              address: e.target.value,
            })
          }
        />
      </div>
    </div>

    <div className="flex justify-end gap-2 pt-4">
      <button
        className="soft-btn-outline"
        onClick={() => setShowPayerModal(false)}
      >
        Cancel
      </button>
      <PrimaryButton name="Save" onClick={savePayer} />
    </div>
  </Modal>
)}

    </div>
  );
}

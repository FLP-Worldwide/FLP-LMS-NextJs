"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import PrimaryButton from "@/components/ui/PrimaryButton";
import Modal from "@/components/ui/Modal";

export default function ExpensePage() {
  /* ================= DATA ================= */
  const [payees, setPayees] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]); // ✅ NEW
    const [items, setItems] = useState([]);


  const emptyPayeeForm = {
    title: "Mr.",
    display_name: "",
    name: "",
    vendor_type: "Supplier",
    email: "",
    contact_no: "",
    address: "",
  };

  const [showPayeeModal, setShowPayeeModal] = useState(false);
  const [payeeForm, setPayeeForm] = useState(emptyPayeeForm);

  const emptyAccountForm = {
    owner_type: "payee", // default because expense me payee hi hoga
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
    type: "Expense", // 🔥 default because Expense page
  };

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryForm, setCategoryForm] = useState(emptyCategoryForm);

  const savePayee = async () => {
    try {
      if (!payeeForm.display_name || !payeeForm.contact_no) {
        return alert("Display Name & Contact No required");
      }

      await api.post("/finance/payee", payeeForm);

      alert("Payee added successfully");

      setShowPayeeModal(false);
      setPayeeForm(emptyPayeeForm);

      fetchInitial(); // 🔥 refresh payee dropdown
    } catch (e) {
      alert("Failed to save payee");
    }
  };

  const saveAccount = async () => {
    if (!accountForm.account_name) {
      return alert("Account Name required");
    }

    await api.post("/finance/accounts", {
      account_for: "payee",
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
    handlePayeeChange(form.payee_id);
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
    payee_id: "",
    finance_account_id: "",
    payment_date: "",
    transaction_id: null,
    cheque_no: null,
    remark: "",
    category: "",
    description: "",
    quantity: 1,
    amount: "",
  });

  /* ================= FETCH MASTER DATA ================= */
  useEffect(() => {
    fetchInitial();
    fetchExpenses(); // ✅ NEW
  }, []);

  const fetchInitial = async () => {
    const [p, c] = await Promise.all([
      api.get("/finance/payee"),
      api.get("/finance/category?type=Expense"),
    ]);

    console.log(c);

    setPayees(Array.isArray(p.data) ? p.data : []);
    setCategories(Array.isArray(c.data.data) ? c.data.data : []);
  };

  /* ================= FETCH EXPENSE LIST ================= */
  const fetchExpenses = async () => {
    const res = await api.get("/finance/expenses");
    setExpenses(Array.isArray(res.data.data) ? res.data.data : []);
  };

  /* ================= FETCH ACCOUNTS BY PAYEE ================= */
  const handlePayeeChange = async (payeeId) => {
    setForm({
      ...form,
      payee_id: payeeId,
      finance_account_id: "",
    });

    if (!payeeId) {
      setAccounts([]);
      return;
    }

    const res = await api.get(`/finance/accounts/payee/${payeeId}`);
    setAccounts(Array.isArray(res.data?.data) ? res.data.data : []);
  };

  /* ================= SUBMIT ================= */
  const submitExpense = async () => {
    if (
      !form.payee_id ||
      !form.finance_account_id ||
      !form.payment_date ||
      !form.category ||
      !form.amount
    ) {
      return alert("Please fill all required fields");
    }

    const payload = {
      payee_id: Number(form.payee_id),
      finance_account_id: Number(form.finance_account_id),
      payment_date: form.payment_date,
      transaction_id: form.transaction_id,
      cheque_no: form.cheque_no,
      remark: form.remark,
      items: [
        {
          category: form.category,
          description: form.description,
          quantity: Number(form.quantity),
          amount: Number(form.amount),
        },
      ],
    };

    await api.post("/finance/expenses", payload);

    alert("Expense added successfully");

    fetchExpenses(); // ✅ REFRESH LIST

    setForm({
        payment_mode: "Cash",
        payee_id: "",
        finance_account_id: "",
        payment_date: "",
        transaction_id: null,
        cheque_no: null,
        remark: "",
        category: "",
        description: "",
        quantity: 1,
        amount: "",
        });

    setAccounts([]);
  };

const addItem = () => {
  if (!form.payee_id || !form.finance_account_id) {
    alert("Select Payee & Account first");
    return;
  }

  if (!form.category || !form.amount) {
    alert("Category and Amount required");
    return;
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



const saveExpense = async () => {
  if (!form.payee_id || !form.finance_account_id || !form.payment_date) {
    return alert("Fill required details");
  }

  if (items.length === 0) {
    return alert("Add at least one item");
  }

  const payload = {
    payee_id: Number(form.payee_id),
    finance_account_id: Number(form.finance_account_id),
    payment_date: form.payment_date,
    payment_mode: form.payment_mode,
    transaction_id: form.transaction_id,
    cheque_no: form.cheque_no,
    remark: form.remark,
    items: items.map((i) => ({
      category: i.category,
      description: i.description,
      quantity: i.quantity,
      amount: i.amount,
    })),
  };

  await api.post("/finance/expenses", payload);

  alert("Expense saved successfully");

  setItems([]);
  fetchExpenses();
};


  return (
    <div className="space-y-6 p-6">

      {/* ================= FORM (UNCHANGED) ================= */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">

        <div className="mb-4">
            <label className="soft-label">
                Choose Payment Mode <span className="text-red-500">*</span>
            </label>

            <div className="flex gap-6 mt-2">
                {["Cash", "Bank", "Cheque", "Card"].map((mode) => (
                <label key={mode} className="flex items-center gap-2 cursor-pointer">
                    <input
                    type="radio"
                    name="payment_mode"
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

        


        <div className="grid grid-cols-4 gap-4">
          {/* Payee */}
          <div>
           <div className="flex justify-between items-center">
            <label className="soft-label">
              Payee Name <span className="text-red-500">*</span>
            </label>

            <button
              type="button"
              className="text-xs text-blue-600 hover:underline"
              onClick={() => setShowPayeeModal(true)}
            >
              + Add Payee
            </button>

          </div>
            <select
            className="soft-input"
            value={form.payee_id}
            onChange={(e) => handlePayeeChange(e.target.value)}
            disabled={items.length > 0}   // 🔒 lock after first item
            >

              <option value="">Select Payee</option>
              {payees.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.display_name}
                </option>
              ))}
            </select>
          </div>

          {/* Account */}
          <div>
           <div className="flex justify-between items-center">
            <label className="soft-label">
              Account Name <span className="text-red-500">*</span>
            </label>

            <button
                type="button"
                className="text-xs text-blue-600 hover:underline"
                onClick={() => {
                  if (!form.payee_id) {
                    return alert("Select Payee first");
                  }

                  setAccountForm({
                    ...emptyAccountForm,
                    owner_id: form.payee_id,
                  });

                  setShowAccountModal(true);
                }}
              >
                + Add Account
              </button>
          </div>
            <select
                className="soft-input"
                value={form.finance_account_id}
                onChange={(e) =>
                    setForm({ ...form, finance_account_id: e.target.value })
                }
                disabled={!form.payee_id || items.length > 0}  // 🔒 lock
                >

              <option value="">Select Account</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.account_name} 
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="soft-label">Payment Date *</label>
            <input
              type="date"
              className="soft-input"
              value={form.payment_date}
              onChange={(e) =>
                setForm({ ...form, payment_date: e.target.value })
              }
            />
          </div>

          {/* Category */}
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
              onChange={(e) => {
              const selectedName = e.target.value;

              const selectedCategory = categories.find(
                (c) => c.name === selectedName
              );

              setForm({
                ...form,
                category: selectedName,
                description: selectedCategory?.description || "",
              });
            }}

            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

            {form.payment_mode !== "Cash" && (
            <div className="grid grid-cols-1 gap-4 mb-4">
                {form.payment_mode === "Bank" && (
                <div>
                    <label className="soft-label">Transaction ID *</label>
                    <input
                    className="soft-input"
                    value={form.transaction_id || ""}
                    onChange={(e) =>
                        setForm({ ...form, transaction_id: e.target.value })
                    }
                    />
                </div>
                )}

                    {form.payment_mode === "Cheque" && (
                    <div>
                        <label className="soft-label">Cheque No *</label>
                        <input
                        className="soft-input"
                        value={form.cheque_no || ""}
                        onChange={(e) =>
                            setForm({ ...form, cheque_no: e.target.value })
                        }
                        />
                    </div>
                    )}

                    {form.payment_mode === "Card" && (
                    <div>
                        <label className="soft-label">Transaction ID *</label>
                        <input
                        className="soft-input"
                        value={form.transaction_id || ""}
                        onChange={(e) =>
                            setForm({ ...form, transaction_id: e.target.value })
                        }
                        />
                    </div>
                    )}
                </div>
                )}


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
            <label className="soft-label">Remark</label>
            <input
              className="soft-input"
              value={form.remark}
              onChange={(e) =>
                setForm({ ...form, remark: e.target.value })
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
            <label className="soft-label">Amount (Rs) *</label>
            <input
              className="soft-input"
              type="number"
              value={form.amount}
              onChange={(e) =>
                setForm({ ...form, amount: e.target.value })
              }
            />
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <PrimaryButton name="Add" onClick={addItem} />

        </div>
      </div>

      {/* ================= EXPENSE LIST TABLE ================= */}

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
           <thead className="bg-blue-50">
                <tr>
                    <th className="px-4 py-3 text-left">Item Category</th>
                    <th className="px-4 py-3 text-left">Description</th>
                    <th className="px-4 py-3 text-center">Quantity</th>
                    <th className="px-4 py-3 text-right">Amount (₹)</th>
                    <th className="px-4 py-3 text-right">Action</th>
                </tr>
            </thead>


            <tbody className="divide-y">
            {items.length === 0 ? (
                <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500">
                    No items added
                </td>
                </tr>
            ) : (
                <>
                {items.map((item, index) => (
                    <tr key={index}>
                    <td className="px-4 py-3 font-medium">
                        {item.category}
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                        {item.description || "—"}
                    </td>

                    <td className="px-4 py-3 text-center">
                        {item.quantity}
                    </td>

                    <td className="px-4 py-3 text-right font-semibold">
                        ₹{(item.quantity * item.amount).toFixed(2)}
                    </td>

                    <td className="px-4 py-3 text-right">
                        <button
                        onClick={() =>
                            setItems(items.filter((_, i) => i !== index))
                        }
                        className="text-red-600 hover:text-red-800 text-sm"
                        >
                        Remove
                        </button>
                    </td>
                    </tr>
                ))}

                {/* GRAND TOTAL ROW */}
                <tr className="bg-gray-50 font-semibold">
                    <td colSpan="3" className="px-4 py-3 text-right">
                    Grand Total :
                    </td>
                    <td className="px-4 py-3 text-right text-lg text-blue-700">
                    ₹
                    {items
                        .reduce(
                        (sum, i) => sum + i.quantity * i.amount,
                        0
                        )
                        .toFixed(2)}
                    </td>
                    <td />
                </tr>
                </>
            )}
            </tbody>



          </table><div className="flex justify-end mt-6">
            <PrimaryButton name="Save Bill" onClick={saveExpense} />
            </div>



        </div>



{showPayeeModal && (
  <Modal title="Add Payee" onClose={() => setShowPayeeModal(false)}>
    <div className="grid grid-cols-3 gap-4">
      <div>
        <label className="soft-label">Title</label>
        <select
          className="soft-input"
          value={payeeForm.title}
          onChange={(e) =>
            setPayeeForm({ ...payeeForm, title: e.target.value })
          }
        >
          <option>Mr.</option>
          <option>Ms.</option>
        </select>
      </div>

      <div>
        <label className="soft-label">
          Display Payee Name <span className="text-red-500">*</span>
        </label>
        <input
          className="soft-input"
          value={payeeForm.display_name}
          onChange={(e) =>
            setPayeeForm({ ...payeeForm, display_name: e.target.value })
          }
        />
      </div>

      <div>
        <label className="soft-label">Payee Name</label>
        <input
          className="soft-input"
          value={payeeForm.name}
          onChange={(e) =>
            setPayeeForm({ ...payeeForm, name: e.target.value })
          }
        />
      </div>

      <div>
        <label className="soft-label">Vendor Type</label>
        <select
          className="soft-input"
          value={payeeForm.vendor_type}
          onChange={(e) =>
            setPayeeForm({ ...payeeForm, vendor_type: e.target.value })
          }
        >
          <option>Supplier</option>
          <option>Employee</option>
        </select>
      </div>

      <div>
        <label className="soft-label">Email</label>
        <input
          className="soft-input"
          value={payeeForm.email}
          onChange={(e) =>
            setPayeeForm({ ...payeeForm, email: e.target.value })
          }
        />
      </div>

      <div>
        <label className="soft-label">
          Contact No <span className="text-red-500">*</span>
        </label>
        <input
          className="soft-input"
          value={payeeForm.contact_no}
          onChange={(e) =>
            setPayeeForm({ ...payeeForm, contact_no: e.target.value })
          }
        />
      </div>

      <div className="col-span-3">
        <label className="soft-label">Address</label>
        <input
          className="soft-input"
          value={payeeForm.address}
          onChange={(e) =>
            setPayeeForm({ ...payeeForm, address: e.target.value })
          }
        />
      </div>
    </div>

    <div className="flex justify-end gap-2 pt-4">
      <button
        className="soft-btn-outline"
        onClick={() => setShowPayeeModal(false)}
      >
        Cancel
      </button>
      <PrimaryButton name="Save" onClick={savePayee} />
    </div>
  </Modal>
)}

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
      <input type="hidden" value="Expense" />

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

    </div>
  );
}

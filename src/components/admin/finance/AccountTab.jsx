"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { DeleteOutlined } from "@ant-design/icons";
import { api } from "@/utils/api";

const emptyForm = {
  owner_type: "", // payer | payee
  owner_id: "",
  account_name: "",
  account_type: "Cash",
  upi_id: "",
  bank_name: "",
  account_no: "",
  ifsc: "",
  description: "",
};

export default function AccountTab() {
  const [accounts, setAccounts] = useState([]);
  const [vendors, setVendors] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);

  /* ================= FETCH ================= */
  const fetchAccounts = async () => {
    const res = await api.get("/finance/accounts");
    setAccounts(res.data.data || []);
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  /* ================= PAYEE / PAYER CHANGE ================= */
  const handleOwnerTypeChange = async (type) => {
    setForm({ ...emptyForm, owner_type: type });

    if (type === "payee") {
      const res = await api.get("/finance/payee");
      setVendors(res.data || []);
    } else if (type === "payer") {
      const res = await api.get("/finance/payer");
      setVendors(res.data || []);
    } else {
      setVendors([]);
    }
  };

  /* ================= SAVE ================= */
  const saveAccount = async () => {
    await api.post("/finance/accounts", {
      account_for: form.owner_type,
      accountable_id: form.owner_id,
      account_name: form.account_name,
      account_type: form.account_type,
      upi_id: form.account_type === "UPI" ? form.upi_id : null,
      bank_name: form.account_type === "Bank" ? form.bank_name : null,
      account_no: form.account_type === "Bank" ? form.account_no : null,
      ifsc: form.account_type === "Bank" ? form.ifsc : null,
      description: form.description,
    });

    setShowModal(false);
    setForm(emptyForm);
    fetchAccounts();
  };

  /* ================= DELETE ================= */
  const deleteAccount = async (id) => {
    if (!confirm("Delete account?")) return;
    await api.delete(`/finance/accounts/${id}`);
    fetchAccounts();
  };

  return (
    <>
      {/* HEADER */}
      <div className="flex justify-end">
        <PrimaryButton name="+ Add Account" onClick={() => setShowModal(true)} />
      </div>

      {/* TABLE */}
      {accounts.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-sm text-gray-500 text-center">
          No account data available
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Account Name</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Owner</th>
                <th className="px-4 py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {accounts.map((a) => (
                <tr key={a.id} className="border-gray-200 ">
                  <td className="px-4 py-2">{a.account_name} - ({a.accountable.display_name})</td>
                  <td className="px-4 py-2">{a.account_type}</td>
                  <td className="px-4 py-2">
                    {a.accountable.vendor_type || "—"}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <DeleteOutlined
                      className="text-rose-600 cursor-pointer"
                      onClick={() => deleteAccount(a.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <Modal title="Add Account" onClose={() => setShowModal(false)}>
          <div className="space-y-4">

            {/* PAYEE / PAYER */}
            <div>
              <label className="soft-label">
                Payee / Payer <span className="text-red-500">*</span>
              </label>
              <select
                className="soft-select"
                value={form.owner_type}
                onChange={(e) => handleOwnerTypeChange(e.target.value)}
              >
                <option value="">Select payee/payer</option>
                <option value="payee">Payee</option>
                <option value="payer">Payer</option>
              </select>
            </div>

            {/* OWNER */}
            {form.owner_type && (
              <div>
                <label className="soft-label">
                  Select {form.owner_type}
                </label>
                <select
                  className="soft-select"
                  value={form.owner_id}
                  onChange={(e) =>
                    setForm({ ...form, owner_id: e.target.value })
                  }
                >
                  <option value="">Select</option>
                  {vendors.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.display_name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* ACCOUNT NAME */}
            <div>
              <label className="soft-label">
                Account Name <span className="text-red-500">*</span>
              </label>
              <input
                className="soft-input"
                value={form.account_name}
                onChange={(e) =>
                  setForm({ ...form, account_name: e.target.value })
                }
              />
            </div>

            {/* ACCOUNT TYPE */}
            <div>
              <label className="soft-label">
                Account Type <span className="text-red-500">*</span>
              </label>
              <select
                className="soft-select"
                value={form.account_type}
                onChange={(e) =>
                  setForm({ ...form, account_type: e.target.value })
                }
              >
                <option>Cash</option>
                <option>UPI</option>
                <option>Bank</option>
                <option>Cheque</option>
              </select>
            </div>

            {/* CONDITIONAL FIELDS */}
            {form.account_type === "UPI" && (
              <div>
                <label className="soft-label">UPI ID</label>
                <input
                  className="soft-input"
                  value={form.upi_id}
                  onChange={(e) =>
                    setForm({ ...form, upi_id: e.target.value })
                  }
                />
              </div>
            )}

            {form.account_type === "Bank" && (
              <>
                <div>
                  <label className="soft-label">Bank Name</label>
                  <input
                    className="soft-input"
                    value={form.bank_name}
                    onChange={(e) =>
                      setForm({ ...form, bank_name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="soft-label">Account Number</label>
                  <input
                    className="soft-input"
                    value={form.account_no}
                    onChange={(e) =>
                      setForm({ ...form, account_no: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="soft-label">IFSC</label>
                  <input
                    className="soft-input"
                    value={form.ifsc}
                    onChange={(e) =>
                      setForm({ ...form, ifsc: e.target.value })
                    }
                  />
                </div>
              </>
            )}

            {/* DESCRIPTION */}
            <div>
              <label className="soft-label">Description</label>
              <textarea
                className="soft-input"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-2 pt-4">
            <button
              className="soft-btn-outline"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <PrimaryButton name="Save" onClick={saveAccount} />
          </div>
        </Modal>
      )}
    </>
  );
}

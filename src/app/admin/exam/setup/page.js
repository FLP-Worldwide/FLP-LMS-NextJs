"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/utils/api";
import PrimaryButton from "@/components/ui/PrimaryButton";

export default function ExamGradesPage() {
  const [grades, setGrades] = useState([]);
  const [gradeName, setGradeName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= FETCH ================= */
  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    const res = await api.get("/exam-grades");
    setGrades(res.data?.data || []);
  };

  /* ================= ADD ================= */
  const handleAdd = async () => {
    if (!gradeName.trim()) return alert("Grade name is required");

    setLoading(true);
    try {
      await api.post("/exam-grades", {
        grade_name: gradeName,
        description,
      });

      setGradeName("");
      setDescription("");
      fetchGrades();
    } catch (e) {
      alert("Failed to add grade");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!confirm("Delete this grade?")) return;

    await api.delete(`/exam-grades/${id}`);
    fetchGrades();
  };

  return (
    <div className="space-y-2">
      {/* ================= HEADER ================= */}
      <div>
        <h2 className="text-xl font-semibold">Exam Grades</h2>
        <p className="text-sm text-gray-500">
          Manage grading structure for exams
        </p>
      </div>

      {/* ================= ADD FORM ================= */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex gap-3 items-center">
          <input
            className="soft-input w-64"
            placeholder="Grade Name*"
            value={gradeName}
            onChange={(e) => setGradeName(e.target.value)}
          />

          <input
            className="soft-input "
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <PrimaryButton
            onClick={handleAdd}
            disabled={loading}
            name={`Add`}
          />
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-xl border border-gray-200">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr className="text-sm text-gray-600">
              <th className="px-4 py-3 text-left">Id</th>
              <th className="px-4 py-3 text-left">Grade</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-left">Created Date</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {grades.map((g) => (
              <tr key={g.id} className="text-sm">
                <td className="px-4 py-3">{g.id}</td>
                <td className="px-4 py-3 font-medium">
                  {g.grade_name}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {g.description || "—"}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(g.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleDelete(g.id)}
                    className="text-red-600 text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {grades.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="p-6 text-center text-gray-400"
                >
                  No grades found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

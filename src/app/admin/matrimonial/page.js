// src/app/admin/matrimonial/page.jsx
"use client";

import React, { useState } from "react";

const sampleProfiles = [
  {
    id: 1,
    name: "Rohit Verma",
    caste: "Brahmin",
    age: 29,
    city: "Jaipur",
    address: "123 MG Road, Jaipur",
    bio: "Software engineer, loves travel and cooking. Looking for a partner who values family and stability. Graduated from MNIT, working at a fintech startup. Enjoys hiking and reading.",
    education: "B.E. Computer Science",
    occupation: "Software Engineer",
    height: "5'9\"",
    maritalStatus: "Single",
    hobbies: ["Hiking", "Cooking", "Reading"],
    contact: "9998887771",
    createdAt: "2025-11-30",
  },
  {
    id: 2,
    name: "Neha Sharma",
    caste: "Kshatriya",
    age: 26,
    city: "Delhi",
    address: "45 Connaught Place, New Delhi",
    bio: "Teacher and part-time content writer. Family oriented, loves music and cultural events. Seeks a partner who is respectful and career-oriented.",
    education: "M.A. English",
    occupation: "School Teacher",
    height: "5'4\"",
    maritalStatus: "Single",
    hobbies: ["Music", "Writing"],
    contact: "9876543210",
    createdAt: "2025-10-12",
  },
];

export default function MatrimonialPage() {
  const [profiles, setProfiles] = useState(sampleProfiles);
  const [viewProfile, setViewProfile] = useState(null);

  const handleView = (p) => setViewProfile(p);
  const handleClose = () => setViewProfile(null);

  const sendInterest = (id) => {
    // demo: mark interest or call API
    alert("Interest sent (demo) for profile id: " + id);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Matrimonial Matches</h2>
          <p className="text-sm text-gray-500">Browse profiles and view detailed bios.</p>
        </div>

        <div>
          <button
            className="px-3 py-2 rounded-md bg-emerald-600 text-white text-sm hover:bg-emerald-700 transition"
            onClick={() => alert("Create new profile flow")}
          >
            + Create Profile
          </button>
        </div>
      </div>

      {/* List card */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold">Profiles</h3>
          <div className="text-sm text-gray-500">{profiles.length} total</div>
        </div>

        <div className="overflow-x-auto rounded-md">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-2 px-4 text-xs font-medium text-gray-600">Name</th>
                <th className="py-2 px-4 text-xs font-medium text-gray-600">Caste</th>
                <th className="py-2 px-4 text-xs font-medium text-gray-600">Age</th>
                <th className="py-2 px-4 text-xs font-medium text-gray-600">City</th>
                <th className="py-2 px-4 text-xs font-medium text-gray-600">Address</th>
                <th className="py-2 px-4 text-xs font-medium text-gray-600">Actions</th>
              </tr>
            </thead>

            <tbody className="border-t border-gray-300 divide-y divide-gray-200">
              {profiles.map((p) => (
                <tr key={p.id}>
                  <td className="py-3 px-4 text-sm font-medium">{p.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{p.caste}</td>
                  <td className="py-3 px-4 text-sm">{p.age}</td>
                  <td className="py-3 px-4 text-sm">{p.city}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{p.address}</td>
                  <td className="py-3 px-4 text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleView(p)}
                        className="px-3 py-1 rounded-md border border-gray-200 text-sm hover:bg-gray-50 transition"
                      >
                        View
                      </button>

                      <button
                        onClick={() => sendInterest(p.id)}
                        className="px-3 py-1 rounded-md bg-emerald-600 text-white text-sm hover:bg-emerald-700 transition"
                      >
                        Send Interest
                      </button>
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

      {/* Profile detail modal */}
      {viewProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40" onClick={handleClose} />

          <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">{viewProfile.name}</h3>
                <div className="text-sm text-gray-500 mt-1">{viewProfile.city} • Age {viewProfile.age}</div>
              </div>

              <div>
                <button onClick={handleClose} className="px-3 py-1 rounded-md border border-gray-200">Close</button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500">Bio</div>
                <div className="text-sm mt-1">{viewProfile.bio}</div>

                <div className="mt-3 text-xs text-gray-500">Education</div>
                <div className="text-sm mt-1">{viewProfile.education}</div>

                <div className="mt-3 text-xs text-gray-500">Occupation</div>
                <div className="text-sm mt-1">{viewProfile.occupation}</div>

                <div className="mt-3 text-xs text-gray-500">Hobbies</div>
                <div className="text-sm mt-1">{viewProfile.hobbies.join(", ")}</div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Details</div>
                <ul className="text-sm mt-1 space-y-1">
                  <li><strong>Height:</strong> {viewProfile.height}</li>
                  <li><strong>Marital status:</strong> {viewProfile.maritalStatus}</li>
                  <li><strong>Contact:</strong> {viewProfile.contact}</li>
                  <li><strong>Address:</strong> {viewProfile.address}</li>
                  <li><strong>Profile created:</strong> {viewProfile.createdAt}</li>
                </ul>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => { alert("Contact flow (demo): " + viewProfile.contact); }}
                    className="px-3 py-1 rounded-md bg-emerald-600 text-white"
                  >
                    Contact
                  </button>

                  <button
                    onClick={() => { alert("Shortlist flow (demo)"); }}
                    className="px-3 py-1 rounded-md border border-gray-200"
                  >
                    Shortlist
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

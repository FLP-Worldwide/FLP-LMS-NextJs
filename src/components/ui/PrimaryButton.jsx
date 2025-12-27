import React from 'react'

export default function PrimaryButton({ name, className = "", onClick }) {
  return (
    <button
      onClick={onClick}
      className={`bg-blue-800 px-4 py-1  text-white text-sm rounded-lg border border-blue-900 hover:bg-blue-900 ${className}`}
    >
      {name}
    </button>
  );
}

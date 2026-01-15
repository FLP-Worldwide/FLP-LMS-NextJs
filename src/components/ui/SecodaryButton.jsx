import React from 'react'

export default function SecondaryButton({ name, className = "", onClick }) {
  return (
    <button
      onClick={onClick}
      className={`bg-gray-50 px-3  py-1 text-gray-800 text-sm rounded-lg border border-gray-300 hover:bg-gray-100 ${className}`}
    >
      {name}
    </button>
  );
}

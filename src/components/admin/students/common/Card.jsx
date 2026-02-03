export default function Card({ title, children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
      <h3 className="text-sm font-semibold border-b border-gray-200 pb-1">{title}</h3>
      {children}
    </div>
  );
}

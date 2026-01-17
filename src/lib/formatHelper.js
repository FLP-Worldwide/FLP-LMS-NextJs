export const formatRupees = (value) => {
  if (value === null || value === undefined || value === "") return "N/A";

  return `₹${Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

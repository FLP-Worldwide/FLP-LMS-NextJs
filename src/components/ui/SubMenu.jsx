// components/ui/SubMenu.jsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SubMenu({ items }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeType = searchParams.get("type") || "source";

  const onClick = (href) => {
    router.replace(href, { scroll: false });
  };

  return (
    <div className="flex gap-6 border-b border-gray-200">
      {items.map((item) => {
        const itemType =
          new URLSearchParams(item.href.split("?")[1]).get("type") || "source";

        const isActive = activeType === itemType;

        return (
          <button
            key={item.label}
            onClick={() => onClick(item.href)}
            className={`pb-3 text-sm font-medium transition
              ${
                isActive
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

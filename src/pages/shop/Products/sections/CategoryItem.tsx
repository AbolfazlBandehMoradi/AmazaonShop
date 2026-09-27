import { useState } from "react";
import { Check, ChevronDown, ChevronLeft, ChevronRight, Minus } from "lucide-react";
import { Category } from "@/types";
import { useShopStore } from "@/stores/productsFilterStore";
import { useLangStore } from "@/stores/languageStore";
import { getAllCategoryIds, getCategoryChildren } from "@/utils/categoryHelpers";
import { cn } from "@/utils/cn";

type Props = {
  category: Category;
  level?: number;
};

export default function CategoryItem({ category, level = 0 }: Props) {
  const { categoryIds, setCategoryIds } = useShopStore();
  const lang = useLangStore((s) => s.lang);
  const isRTL = lang === "fa";

  const children = getCategoryChildren(category);
  const [isOpen, setIsOpen] = useState(false);

  const branchIds = getAllCategoryIds(category);

  const checked = branchIds.every((id) => categoryIds.includes(id));
  const indeterminate = !checked && branchIds.some((id) => categoryIds.includes(id));
  const indent = Math.min(level, 3) * 0.375;

  const toggleCategoryTree = () => {
    if (checked) {
      setCategoryIds(categoryIds.filter((id) => !branchIds.includes(id)));
    } else {
      setCategoryIds(Array.from(new Set([...categoryIds, ...branchIds])));
    }
  };

  return (
    <div
      className="relative min-w-0 max-w-full overflow-hidden"
      style={{ paddingInlineStart: `${indent}rem` }}
    >
      <div className="group flex min-w-0 max-w-full items-center justify-between rounded-xl px-2 py-1.5 text-sm select-none transition-colors hover:bg-first/5">
        <label className="flex min-w-0 max-w-full flex-1 cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={checked}
            aria-checked={indeterminate ? "mixed" : checked}
            ref={(el) => {
              if (el) el.indeterminate = indeterminate;
            }}
            onChange={toggleCategoryTree}
            className="peer sr-only"
          />

          <span
            className={cn(
              'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors',
              checked || indeterminate
                ? 'border-first bg-first text-white'
                : 'border-first-100 bg-color-for-layer-on-body text-transparent group-hover:border-first/40 group-hover:bg-first/5',
            )}
            aria-hidden="true"
          >
            {indeterminate ? (
              <Minus className="h-3.5 w-3.5" strokeWidth={2.2} />
            ) : (
              <Check className="h-3.5 w-3.5" strokeWidth={2.2} />
            )}
          </span>

          <span
            className={cn(
              'min-w-0 truncate first-text-color-for-paragraph',
              (checked || indeterminate) && 'font-f-sbold',
            )}
          >
            {category.name}
          </span>
        </label>

        {children.length > 0 && (
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg first-text-color-for-paragraph-low transition-colors hover:bg-secound/10 hover:text-secound"
            aria-label={category.name}
          >
            {isOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : isRTL ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {children.length > 0 && isOpen && (
        <div
          className={cn(
            "mt-1 min-w-0 max-w-full space-y-1 overflow-hidden border-secound/15",
            isRTL ? "me-2 border-r pe-2" : "ms-2 border-l ps-2"
          )}
        >
          {children.map((child) => (
            <CategoryItem key={child.id} category={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

import { Category } from "@/types";
import CategoryItem from "./CategoryItem";

type Props = {
  categories?: Category[];
};

export default function CategoryTree({ categories }: Props) {
  if (!categories) return null;

  return (
    <div className="min-w-0 max-w-full space-y-2 overflow-hidden">
      {categories.map((category) => (
        <CategoryItem key={category.id} category={category} />
      ))}
    </div>
  );
}


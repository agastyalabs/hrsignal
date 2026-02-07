import { redirect } from "next/navigation";

export default function CategoriesPage() {
  // v1: categories are surfaced via /tools filters.
  redirect("/tools");
}

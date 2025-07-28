import { redirect } from "next/navigation";

export default function DashboardPagesRedirect() {
  redirect("/dashboard/home");
  return null;
}

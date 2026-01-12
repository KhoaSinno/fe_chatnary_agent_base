import { redirect } from "next/navigation";

export default function Home() {
  // Redirect to landing page for guests
  // In production, this would check auth status
  redirect("/landing");
}

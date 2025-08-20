"use client";

import { useSearchParams } from "next/navigation";
import ProfileForm from "../components/form/profile-form";

export default function edit() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  
  return <div><ProfileForm type="update" email={email} /></div>;
}

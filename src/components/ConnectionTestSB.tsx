"use client";

import { supabase } from "@/lib/supabase-client";

export default function ConnectionSB() {
  const test = async () => {
    const { data, error } = await supabase.auth.getSession();
    console.log("session:", data, error);
  };

  return (
    <div>
      <button onClick={test}>Test Supabase</button>
    </div>
  );
}

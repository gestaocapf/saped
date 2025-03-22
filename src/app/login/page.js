"use client";
import Navbar from "@/components/Navbar";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/board");
    }
  }, [session]);

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center mt-[250px]">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => signIn("google")}
        >
          Login com Google
        </button>
      </div>
    </div>
  );
}

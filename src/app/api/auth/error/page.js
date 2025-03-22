"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        <Navbar />
        <div className="flex flex-col items-center justify-center mt-[200px]">
          <h1 className="text-2xl font-bold">Erro de Autenticação</h1>

          <a
            href="/login"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Voltar para Login
          </a>

          <p className="mt-2 text-sm w-[400px] text-center text-red-500">
            {error === "AccessDenied"
              ? "Você não tem permissão para acessar esta aplicação. Caso acredite que isso seja um erro, consulte o CAPF."
              : "Ocorreu um erro inesperado."}
          </p>
        </div>
      </div>
    </Suspense>
  );
}

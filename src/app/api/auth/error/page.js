"use client";
import Navbar from "@/components/Navbar";

export default function AuthErrorPage() {
  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center  justify-center mt-[200px]">
        <h1 className="text-2xl font-bold">Erro de Autenticação</h1>

        <a
          href="/login"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Voltar para Login
        </a>

        <p className="mt-2 text-sm w-[400px] text-center text-red-500">
          Ocorreu um erro inesperado. Consulte o CAPF para obter mais
          informações.
        </p>
      </div>
    </div>
  );
}

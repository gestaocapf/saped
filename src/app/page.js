"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [id, setId] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSearch() {
    setError("");

    if (!id.trim()) {
      setError("Por favor, insira um ID válido.");
      return;
    }

    try {
      const response = await fetch("/api/buscar-chamado", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        throw new Error(data.error || "Erro ao buscar chamado.");
      }

      if (data.ticket == 0) {
        setError("Chamado não encontrado.");
        return;
      }

      router.push(`/chamado/${data.ticket.id}`);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="w-full">
      <Navbar />

      <main className="mx-[45px]">
        <div>
          <h1 className="font-bold text-[20px] text-[#7B7B7B] mt-[52px]">
            Bem-vindo ao SAPed – Serviço de Atendimento ao Discente de Pedagogia
          </h1>
          <p className="text-[#7B7B7B] mt-[20px] text-[13px] text-justify">
            Conecte-se à coordenação e setores acadêmicos de forma rápida! No
            SAPed, você registra solicitações e acompanha seus chamados com
            facilidade.
          </p>
        </div>

        <hr className="my-[42px]" />

        <div>
          <p className="text-[13px]">
            Precisa de ajuda ou relatar algum ocorrido? Crie um novo chamado.
            Estamos aqui para tornar sua experiência acadêmica mais simples e
            eficiente!
          </p>
          <Link
            href="/novo-chamado"
            className="text-[#156160] text-[13px] my-[32px] block underline"
          >
            Clique aqui para abrir um novo chamado
          </Link>
        </div>

        {/* Campo de busca */}
        <div className="relative xl:w-[300px]">
          <input
            type="text"
            placeholder="Pesquisar chamado"
            className="w-full pl-10 pr-4 py-2 text-[13px] border rounded-md focus:outline-none focus:ring-0"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <Image
            aria-hidden
            src="/lupa.svg"
            alt="LUPA icon"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            width={44}
            height={44}
          />
        </div>

        {/* Botão de busca */}
        <button
          type="button"
          className="text-white mt-[30px] bg-[#5BB7B6] rounded-md w-full text-[13px] h-[50px] xl:w-[300px]"
          onClick={handleSearch}
        >
          Pesquisar
        </button>

        {/* Mensagem de erro */}
        {error && <p className="text-red-500 text-[13px] mt-2">{error}</p>}
      </main>

      <Footer />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Link from "next/link";

const Chamado = () => {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [chamado, setChamado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchChamado() {
      try {
        const response = await fetch("/api/buscar-chamado", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Erro ao buscar chamado.");
        }

        setChamado(data.ticket);
      } catch (err) {
        setError("Essa página não existe.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchChamado();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col gap-5 items-center justify-center bg-gray-900 bg-opacity-50">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        <div className="text-white font-bold">Carregando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <p className="text-red-500 font-bold">{error}</p>
        <Link href="/" className="text-blue-500 mt-4 underline">
          Voltar para a página inicial
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <main className="mx-[45px]">
        <div>
          <Link
            href="/"
            className="text-[#156160] text-[13px] my-[52px] block underline"
          >
            Voltar para tela inicial
          </Link>
          <h1 className="font-bold text-[20px] text-[#7B7B7B] mt-[30px]">
            Acompanhar chamado
          </h1>
        </div>

        <div className="mt-20 flex justify-between items-center">
          <div>
            <h2 className="font-bold text-[15px] text-[#7B7B7B]">
              Protocolo {chamado?.id?.toUpperCase()}
            </h2>
            <p className="text-xs text-gray-500">
              Feito em {new Date(chamado.createdAt).toLocaleDateString()} às{" "}
              {new Date(chamado.createdAt).toLocaleTimeString()}
            </p>
          </div>
        </div>
        <div>
          <span
            className="block p-[10px] mt-5 w-fit text-[10px] font-bold rounded-md"
            style={{
              backgroundColor:
                chamado.status === "Aberto" ? "#F3F4F6" : "#D1FAE5",
              color: chamado.status === "EM ANÁLISE" ? "#6B7280" : "#047857",
            }}
          >
            {chamado.status}
          </span>
        </div>

        <hr className="my-[42px]" />

        <div>
          <h3 className="mt-4 text-xl font-bold">{chamado.title}</h3>
          <p className="mt-2 text-gray-700 text-sm break-all">
            {chamado.content}
          </p>
          <hr className="my-[42px]" />

          {chamado.answer ? (
            <div className="mt-20 p-4 bg-gray-100 rounded-lg">
              <h4 className="font-semibold text-gray-700">Resposta</h4>
              <p className="mt-5 text-gray-700 text-sm whitespace-pre-wrap">
                {chamado.answer}
              </p>
              <p className="mt-10 text-gray-600 text-sm">
                Atenciosamente,
                <br />
                Centro Acadêmico Paulo Freire
              </p>
            </div>
          ) : (
            <p className="text-gray-500 text-sm mt-10">
              Ainda não há resposta para este chamado.
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Chamado;

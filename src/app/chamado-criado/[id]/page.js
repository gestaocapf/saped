"use client";
import { useParams } from "next/navigation";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Link from "next/link";

const ChamadoCriado = () => {
  const params = useParams();
  const { id } = params;

  return (
    <div>
      <Navbar />
      <main className="flex items-center justify-center h-[calc(100vh-90px)]">
        <div className="flex flex-col text-center w-[300px]  gap-[10px]">
          <Link
            href="/"
            className="text-[#156160] text-[13px] my-[52px] block underline"
          >
            Voltar para tela inicial
          </Link>
          <h1 className="font-bold text-[20px]">Chamado aberto com sucesso!</h1>
          <p className=" text-[13px] text-center text-[#7B7B7B]">
            Anote o número do seu protocolo para acompanhar sua solicitação.
          </p>
          <p className="font-bold text-[13px] text-[#7B7B7B]">
            N° PROTOCOLO : {id?.toUpperCase()}
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ChamadoCriado;

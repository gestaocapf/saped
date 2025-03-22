"use client";
import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Chamado = () => {
  const router = useRouter();
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "", // Corrigido o nome para "title"
    category: "", // Corrigido o nome para "category"
    content: "",
    senderName: "",
    senderEnrollment: "",
    senderEmail: "",
  });
  const [errors, setErrors] = useState({});
  const [categorias, setCategorias] = useState([]); // Estado para armazenar as categorias

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch("/api/categorias");
        const data = await response.json();
        if (data.success) {
          setCategorias(data.categories); // Atualizar o estado com as categorias
        } else {
          console.error("Erro ao carregar categorias");
        }
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    };

    fetchCategorias();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.title.trim()) newErrors.title = "O assunto é obrigatório."; // Corrigido de "assunto" para "title"
    if (!formData.category) newErrors.category = "Escolha uma categoria."; // Corrigido de "categoria" para "category"
    if (!formData.content.trim())
      newErrors.content = "A descrição é obrigatória."; // Corrigido de "descricao" para "content"

    if (!isAnonymous) {
      if (!formData.senderName.trim())
        newErrors.senderName = "O nome é obrigatório.";
      if (!formData.senderEnrollment.trim())
        newErrors.senderEnrollment = "A matrícula é obrigatória.";
      if (!formData.senderEmail.trim()) {
        newErrors.senderEmail = "O email é obrigatório.";
      } else if (!/\S+@\S+\.\S+/.test(formData.senderEmail)) {
        newErrors.senderEmail = "Digite um email válido.";
      }
    }

    if (!isTermsAccepted)
      newErrors.terms = "Você precisa aceitar os termos e condições.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const ticketData = {
        title: formData.title, // Corrigido de "assunto" para "title"
        categoryId: formData.category, // Corrigido de "categoria" para "category"
        content: formData.content, // Corrigido de "descricao" para "content"
        isAnonymous,
        senderName: isAnonymous ? "" : formData.senderName, // Corrigido de "nome" para "senderName"
        senderEnrollment: isAnonymous ? "" : formData.senderEnrollment, // Corrigido de "matricula" para "senderEnrollment"
        senderEmail: isAnonymous ? "" : formData.senderEmail, // Corrigido de "email" para "senderEmail"
      };

      setIsLoading(true);

      try {
        const response = await fetch("/api/criar-chamado", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(ticketData),
        });

        if (response.ok) {
          const data = await response.json();
          sessionStorage.setItem("redirected", "true");
          setIsLoading(false);
          router.push(`/chamado-criado/${data.ticket.id}`);
        } else {
          const data = await response.json();
          console.error("Erro ao criar chamado:", data.error);
        }
      } catch (error) {
        console.error("Erro ao criar chamado:", error);
      }
    }
  };

  return (
    <div>
      <Navbar />

      <main className=" mx-[45px]">
        {isLoading && (
          <div className="fixed inset-0 flex flex-col gap-5 items-center justify-center">
            <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            <div className="text-black font-bold">
              Seu chamado está sendo enviado
            </div>
          </div>
        )}
        <Link
          href="/"
          className="text-[#156160] text-[13px] my-[52px] block underline"
        >
          Voltar para tela inicial
        </Link>
        <h1 className="font-bold text-[20px] text-[#7B7B7B] mt-[30px]">
          Novo chamado
        </h1>

        <form className="my-[50px]" onSubmit={handleSubmit}>
          {/* Assunto */}
          <input
            type="text"
            name="title" // Corrigido de "assunto" para "title"
            placeholder="Assunto"
            value={formData.title} // Corrigido de "assunto" para "title"
            onChange={handleChange}
            minLength={10}
            className="w-full pl-[14px] xl:w-[400px] pr-4 py-2 text-[13px] text-[#7B7B7B] border rounded-md focus:outline-none focus:ring-0"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title}</p> // Corrigido de "assunto" para "title"
          )}

          {/* Categoria */}
          <div className="relative w-full mt-[14px] xl:w-[400px]">
            <select
              name="category" // Corrigido de "categoria" para "category"
              value={formData.category} // Corrigido de "categoria" para "category"
              onChange={handleChange}
              className="w-full pl-[14px] pr-8 py-2 text-[13px] text-[#7B7B7B] border rounded-md focus:outline-none focus:ring-0 appearance-none"
            >
              <option value="">Categoria</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.name}
                </option>
              ))}
            </select>
            <svg
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          {errors.category && (
            <p className="text-red-500 text-sm my-2">{errors.category}</p> // Corrigido de "categoria" para "category"
          )}

          {/* Descrição */}
          <hr className="my-[42px]" />

          <textarea
            name="content" // Corrigido de "descricao" para "content"
            placeholder="Descrição"
            value={formData.content} // Corrigido de "descricao" para "content"
            minLength={200}
            onChange={handleChange}
            className="w-full pl-[14px] pr-4 py-2 h-[201px] text-[13px] text-[#7B7B7B] border rounded-md focus:outline-none focus:ring-0"
          />
          {errors.content && (
            <p className="text-red-500 text-sm my-2">{errors.content}</p> // Corrigido de "descricao" para "content"
          )}

          {/* Informações de contato */}
          <p className="font-bold text-[13px] text-[#7B7B7B] mt-[31px]">
            Informações de contato
          </p>
          <div className="flex gap-3 mt-[21px]">
            <input
              type="checkbox"
              name="anonimo"
              checked={isAnonymous}
              onChange={() => setIsAnonymous(!isAnonymous)}
              className="border border-[#7B7B7B] w-[19px] h-[19px] rounded-md"
            />
            <p className="text-[13px] text-[#7B7B7B]">Anônimo</p>
          </div>

          {!isAnonymous && (
            <div className="flex flex-col">
              <input
                type="text"
                name="senderName" // Corrigido de "nome" para "senderName"
                placeholder="Nome completo*"
                value={formData.senderName} // Corrigido de "nome" para "senderName"
                onChange={handleChange}
                className="w-full pl-[14px] xl:w-[400px] pr-4 py-2 mt-[33px] text-[13px] text-[#7B7B7B] border rounded-md focus:outline-none focus:ring-0"
              />
              {errors.senderName && (
                <p className="text-red-500 text-sm my-2">{errors.senderName}</p> // Corrigido de "nome" para "senderName"
              )}

              <input
                type="text"
                name="senderEnrollment" // Corrigido de "matricula" para "senderEnrollment"
                placeholder="Matrícula*"
                value={formData.senderEnrollment} // Corrigido de "matricula" para "senderEnrollment"
                onChange={handleChange}
                className="w-full pl-[14px] xl:w-[400px] pr-4 py-2 mt-[14px] text-[13px] text-[#7B7B7B] border rounded-md focus:outline-none focus:ring-0"
              />
              {errors.senderEnrollment && (
                <p className="text-red-500 text-sm my-2">
                  {errors.senderEnrollment}
                </p> // Corrigido de "matricula" para "senderEnrollment"
              )}

              <input
                type="text"
                name="senderEmail" // Corrigido de "email" para "senderEmail"
                placeholder="Email*"
                value={formData.senderEmail} // Corrigido de "email" para "senderEmail"
                onChange={handleChange}
                className="w-full pl-[14px] xl:w-[400px] pr-4 py-2 mt-[14px] text-[13px] text-[#7B7B7B] border rounded-md focus:outline-none focus:ring-0"
              />
              {errors.senderEmail && (
                <p className="text-red-500 text-sm my-2">
                  {errors.senderEmail}
                </p> // Corrigido de "email" para "senderEmail"
              )}
            </div>
          )}

          <div className="flex gap-3 mt-[21px]">
            <input
              type="checkbox"
              name="terms"
              checked={isTermsAccepted}
              onChange={() => setIsTermsAccepted(!isTermsAccepted)}
              className="border border-[#7B7B7B] w-[19px] h-[19px] rounded-md"
            />
            <p className="text-[13px] text-[#7B7B7B]">
              Concordo com os{" "}
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="text-blue-500 underline"
              >
                Termos e Condições
              </button>
            </p>
          </div>
          {errors.terms && (
            <p className="text-red-500 text-sm my-2">{errors.terms}</p>
          )}

          <button
            type="submit"
            className="text-white mt-[30px] bg-[#5BB7B6] rounded-md w-full text-[13px] h-[50px] xl:w-[300px]"
          >
            Criar Chamado
          </button>
        </form>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="flex flex-col justify-between bg-white p-6 rounded-md w-[80%] max-w-[600px] h-[500px]">
            <h2 className="font-bold text-xl mb-4">
              Termos e Condições de Uso
            </h2>
            <p className="h-[300px] text-[13px] overflow-y-auto whitespace-pre-wrap">
              Termos e Condições de Uso do Serviço de Atendimento ao Discente de
              Pedagogia (SAPed) 1. Introdução Bem-vindo ao Serviço de
              Atendimento ao Discente de Pedagogia (SAPed). Ao utilizar este
              serviço, você concorda com os seguintes Termos e Condições de Uso.
              Recomendamos a leitura atenta deste documento antes de enviar
              qualquer chamado. 2. Objetivo do SAPed O SAPed é um sistema criado
              para permitir que estudantes encaminhem chamados relacionados à
              sua experiência acadêmica. O serviço permite o envio de
              reclamações, denúncias, elogios, dúvidas e outras solicitações
              relevantes. 3. Envio de Chamados Ao enviar um chamado, o estudante
              deverá fornecer as seguintes informações: Título: breve descrição
              do chamado; Categoria: indicação do tipo de chamado (reclamação,
              denúncia, elogio, dúvida, etc.); Descrição: detalhamento da
              solicitação. O estudante poderá optar por enviar o chamado de
              forma anônima ou identificada, fornecendo seu nome completo e
              e-mail para contato. 4. Privacidade e Confidencialidade O SAPed
              compromete-se a não divulgar a identidade dos usuários que optarem
              pelo envio anônimo. No entanto, reservamo-nos o direito de
              compartilhar informações gerais do chamado, desde que essas não
              comprometam a identidade do solicitante. Para usuários
              identificados, as informações pessoais fornecidas serão tratadas
              com sigilo e apenas utilizadas para comunicação relacionada ao
              chamado, salvo quando exigido por lei ou mediante consentimento do
              usuário. 5. Uso das Informações O conteúdo dos chamados poderá ser
              analisado e utilizado para fins estatísticos, melhorias
              institucionais e identificação de padrões que auxiliem na
              otimização dos serviços acadêmicos. Qualquer informação
              compartilhada publicamente será apresentada de forma genérica, sem
              expor dados pessoais dos usuários. 6. Responsabilidades do Usuário
              O usuário concorda em: Fornecer informações verídicas e
              pertinentes ao chamado; Utilizar o serviço de maneira ética e
              responsável; Não enviar conteúdos ofensivos, falsos ou que violem
              direitos de terceiros. O SAPed se reserva o direito de não
              processar chamados que contenham informações fraudulentas,
              ofensivas ou que violem as normas institucionais. 7. Alterações
              nos Termos e Condições Estes termos podem ser atualizados
              periodicamente para melhor atender às necessidades dos usuários e
              da instituição. Recomendamos que os usuários revisitem esta página
              regularmente para se manterem informados sobre possíveis mudanças.
              8. Contato Para dúvidas ou esclarecimentos sobre estes Termos e
              Condições, entre em contato pelo canal oficial do SAPed. Ao
              utilizar o SAPed, o usuário declara ter lido, compreendido e
              concordado com os termos aqui estabelecidos.
            </p>{" "}
            <div className="mt-4 text-right">
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-blue-500"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Chamado;

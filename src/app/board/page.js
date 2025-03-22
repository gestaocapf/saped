"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { MdExitToApp } from "react-icons/md";

const initialTickets = {
  Aberto: [],
  "Em Análise": [],
  Concluído: [],
};

const categoryColors = {
  Denúncia: "bg-red-200 text-red-700",
  Elogio: "bg-green-200 text-green-700",
  Reclamação: "bg-yellow-200 text-yellow-700",
  Sugestão: "bg-blue-200 text-blue-700",
};

export default function BoardChamados() {
  const { data: session, status } = useSession();
  const [tickets, setTickets] = useState(initialTickets);
  const [users, setUsers] = useState([]);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpenExcluir, setIsModalOpenExcluir] = useState(false);

  const router = useRouter();

  useEffect(() => {
    console.log(status);
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      console.log(session);
      fetchTickets();
      fetchUsers();
    }
  }, [status]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const fetchTickets = async () => {
    try {
      const response = await fetch("/api/chamados", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();
      if (data.success && Array.isArray(data.tickets)) {
        setTickets({
          Aberto: data.tickets.filter((t) => t.status === "Aberto"),
          "Em Análise": data.tickets.filter((t) => t.status === "Em Análise"),
          Concluído: data.tickets.filter((t) => t.status === "Concluído"),
        });
      }
    } catch (error) {
      console.error("Erro ao buscar chamados:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      const data = await response.json();
      if (data.success) setUsers(data.users);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };

  const handleUpdateTicket = async () => {
    try {
      const response = await fetch("/api/modificar-chamado", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedTicket.id,
          assignedToId: selectedTicket.assignedToId || null,
          answer: selectedTicket.answer || null,
          status: selectedTicket.status,
          categoryId: selectedTicket.categoryId,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar o ticket");
      }

      const updatedTicket = await response.json();

      console.log(updatedTicket);

      setTickets((prevTickets) => {
        const newTickets = { ...prevTickets };
        Object.keys(newTickets).forEach((category) => {
          newTickets[category] = newTickets[category].filter(
            (t) => t.id !== updatedTicket.ticket.id
          );
        });

        if (!newTickets[updatedTicket.ticket.status]) {
          newTickets[updatedTicket.ticket.status] = [];
        }
        newTickets[updatedTicket.ticket.status].push(updatedTicket.ticket);

        return newTickets;
      });

      setSelectedTicket(updatedTicket.ticket);
      alert("Ticket atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar ticket:", error);
      alert("Erro ao atualizar o ticket.");
    }
  };

  const handleExcluir = async () => {
    try {
      const response = await fetch("/api/excluir-chamado", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedTicket.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir o ticket");
      }

      setTickets((prevTickets) => {
        const newTickets = { ...prevTickets };

        Object.keys(newTickets).forEach((category) => {
          newTickets[category] = newTickets[category].filter(
            (ticket) => ticket.id !== selectedTicket.id
          );
        });

        return newTickets;
      });

      alert("Chamado excluído!");
      setSelectedTicket(null);
      setIsModalOpenExcluir(false);
    } catch (error) {
      console.error("Erro ao excluir", error);
      alert("Erro ao excluir o chamado.");
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceColumn = tickets[source.droppableId];
    const destColumn = tickets[destination.droppableId];

    const newSourceColumn = [...sourceColumn];
    const newDestColumn = [...destColumn];

    const [movedTicket] = newSourceColumn.splice(source.index, 1);
    newDestColumn.splice(destination.index, 0, movedTicket);

    setTickets((prev) => ({
      ...prev,
      [source.droppableId]: newSourceColumn,
      [destination.droppableId]: newDestColumn,
    }));

    try {
      await fetch("/api/modificar-chamado", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: movedTicket.id,
          status: destination.droppableId,
        }),
      });
    } catch (error) {
      console.error("Erro ao atualizar status do chamado:", error);
    }
  };

  const filteredTickets = Object.fromEntries(
    Object.entries(tickets).map(([status, ticketList]) => [
      status,
      ticketList.filter(
        (ticket) =>
          (!filterCategory || ticket.category.name === filterCategory) &&
          (!filterDate || ticket.createdAt.split("T")[0] === filterDate) &&
          (ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.assignedTo?.name
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            ticket.id.toLowerCase().includes(searchTerm.toLowerCase()))
      ),
    ])
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <nav className="flex flex-row justify-between bg-white py-3 px-[45px] text-gray-400 text-sm ">
        <div>Quadro de Chamados</div>
        <div>
          <div className="flex items-center gap-5">
            <div className="flex items-center text-black flex-row gap-2">
              <img
                className="rounded-full w-[30px] h-[30px]"
                src={session?.user?.image}
                alt="profile picture"
              />
              <p>{session?.user?.name}</p>
            </div>
            <button
              className="text-gray-400 text-[20px]"
              onClick={() => handleSignOut()}
            >
              <MdExitToApp />
            </button>
          </div>
        </div>
      </nav>
      <div className="flex flex-row justify-between px-[45px] py-4 gap-4">
        <div className="flex flex-row gap-5">
          <select
            className="border p-2 rounded text-[13px]"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">Todas as Categorias</option>
            {Object.keys(categoryColors).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <input
            type="date"
            className="border p-2 rounded text-[13px]"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>
        <input
          type="text"
          placeholder="Pesquisar chamado"
          className="border p-2 rounded text-[13px]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col px-[45px] md:flex-row gap-4 py-4">
          {Object.keys(filteredTickets).map((status) => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex-1 p-4 rounded-lg bg-gray-100"
                >
                  <h2 className="text-[15px] font-semibold mb-3">{status}</h2>
                  <hr />
                  <div className="space-y-3 mt-5">
                    {filteredTickets[status].map((ticket, index) => (
                      <Draggable
                        key={ticket.id}
                        draggableId={ticket.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-4 rounded-lg bg-white shadow-md cursor-pointer hover:bg-gray-200 transition ${
                              status === "Concluído" ? "opacity-50" : ""
                            }`}
                            onClick={() => setSelectedTicket(ticket)}
                          >
                            <div className="flex justify-between items-center">
                              <h3 className="font-semibold text-[15px]">
                                {ticket.title}
                              </h3>
                              <span
                                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                  categoryColors[ticket?.category?.name] ||
                                  "bg-gray-200 text-gray-700"
                                }`}
                              >
                                {ticket?.category?.name}
                              </span>
                            </div>
                            <div className="flex items-center mt-5 justify-between">
                              <div className="flex flex-col text-[12px] font-bold text-gray-500">
                                <p>Responsável</p>
                                <p>
                                  {ticket?.assignedTo?.name || "Não atribuído"}
                                </p>
                              </div>
                              <div className="flex flex-col text-[12px] font-bold text-gray-500">
                                <span>Criado em</span>
                                <span>
                                  {new Date(
                                    ticket?.createdAt
                                  ).toLocaleDateString("pt-BR")}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {selectedTicket && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="grid grid-cols-[1fr_200px] gap-5 bg-white p-6 rounded-lg shadow-lg w-[800px]">
            <div>
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">
                      {selectedTicket?.title}
                    </h2>
                    <h2 className="text-sm uppercase font-d text-gray-400">
                      {selectedTicket?.id}
                    </h2>
                  </div>
                  <span
                    className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                      categoryColors[selectedTicket?.category?.name] ||
                      "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {selectedTicket?.category?.name}
                  </span>
                </div>
                <div className="mt-10 text-sm text-gray-600 bg-gray-100 rounded p-5">
                  <p className="text-black-400 font-semibold">
                    INFORMAÇÕES DE CONTATO
                  </p>
                  <div
                    className={` ${
                      selectedTicket?.isAnonymous
                        ? " blur-sm pointer-events-none"
                        : ""
                    }`}
                  >
                    <p>
                      Nome:{" "}
                      {!selectedTicket?.isAnonymous
                        ? selectedTicket?.senderName
                        : " Anônimo"}
                    </p>

                    {!selectedTicket?.isAnonymous ? (
                      <>
                        <p>Matrícula: {selectedTicket?.senderEnrollment}</p>
                        <p>E-mail: {selectedTicket?.senderEmail}</p>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="my-10  whitespace-pre-wrap text-sm max-h-[200px] overflow-y-auto">
                {selectedTicket?.content}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Resposta
                </label>
                <textarea
                  className="border p-2 w-full rounded h-[50px] text-[13px] resize-none overflow-y-auto"
                  value={selectedTicket.answer || ""}
                  onChange={(e) =>
                    setSelectedTicket({
                      ...selectedTicket,
                      answer: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="flex flex-col justify-between">
              <div className="flex justify-end w-full mb-5">
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="text-gray-500 px-4 py-2 rounded"
                >
                  x
                </button>
              </div>

              <div className="text-gray-600 text-[13px]">
                <p>
                  Criado em{" "}
                  {new Date(selectedTicket?.createdAt).toLocaleDateString(
                    "pt-BR"
                  )}
                </p>
                <p>
                  Última atualização{" "}
                  {new Date(selectedTicket?.updatedAt).toLocaleDateString(
                    "pt-BR"
                  )}
                </p>
              </div>
              <div className="mt-5">
                <label className="block text-[13px] font-medium text-gray-700">
                  Atribuir para:
                </label>
                <select
                  className="border p-2 text-[13px] w-full rounded"
                  value={selectedTicket.assignedToId || ""}
                  onChange={(e) =>
                    setSelectedTicket({
                      ...selectedTicket,
                      assignedToId: e?.target?.value,
                    })
                  }
                >
                  <option value="">Selecionar responsável</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user?.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-5 text-[13px]">
                <label className="block text-sm font-medium text-gray-700">
                  Status:
                </label>
                <select
                  className="border p-2 w-full rounded"
                  value={selectedTicket.status}
                  onChange={(e) =>
                    setSelectedTicket({
                      ...selectedTicket,
                      status: e.target.value,
                    })
                  }
                >
                  <option value="Aberto">Aberto</option>
                  <option value="Em Análise">Em Análise</option>
                  <option value="Concluído">Concluído</option>
                </select>
              </div>
              <div className="mt-5  flex flex-col justify-end">
                <button
                  className="bg-blue-500 text-white px-4 w-full py-2 rounded"
                  onClick={handleUpdateTicket}
                >
                  Atualizar
                </button>
                <button
                  className="mt-5 text-[13px] text-red-500"
                  onClick={() => setIsModalOpenExcluir(true)}
                >
                  Excluir Chamado
                </button>

                {isModalOpenExcluir && (
                  <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-5 rounded-lg w-80">
                      <h3 className="text-lg font-semibold">
                        Tem certeza que quer excluir o chamado?
                      </h3>
                      <div className="mt-4 flex justify-between">
                        <button
                          onClick={handleExcluir}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg"
                        >
                          Sim
                        </button>
                        <button
                          onClick={() => setIsModalOpenExcluir(false)}
                          className="bg-gray-300 text-black px-4 py-2 rounded-lg"
                        >
                          Não
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

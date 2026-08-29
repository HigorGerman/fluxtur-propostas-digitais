"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiRequest } from "@/services/api";

interface Hotel {
  id: string;
  nome: string;
  cidade: string;
}

interface Pacote {
  id: string;
  titulo: string;
  destino: string;
}

interface Orcamento {
  id: string;
  token: string;
  clienteNome: string;
  clienteEmail?: string;
  clienteWhatsapp: string;
  validade: string;
  status: string;
  valorTotal: number;
  observacoes?: string;
  criadoEm: string;
  hotelId?: string;
  hotel?: Hotel;
  pacoteId?: string;
  pacote?: Pacote;
  tituloCustomizado?: string;
  destinoCustomizado?: string;
}

export default function AdminOrcamentosPage() {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("TODOS");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const fetchOrcamentos = async () => {
    try {
      setLoading(true);
      const data = await apiRequest<Orcamento[]>("/orcamentos");
      setOrcamentos(data);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar lista de orçamentos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrcamentos();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este orçamento?")) return;
    try {
      await apiRequest(`/orcamentos/${id}`, { method: "DELETE" });
      setOrcamentos(orcamentos.filter((o) => o.id !== id));
    } catch (err: any) {
      alert(err.message || "Erro ao excluir orçamento.");
    }
  };

  const handleCopyLink = (token: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    const fullUrl = `${origin}/proposta/${token}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 3000);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const filteredOrcamentos = orcamentos.filter((item) => {
    const matchesStatus =
      filterStatus === "TODOS" || item.status.toUpperCase() === filterStatus.toUpperCase();

    const query = searchQuery.toLowerCase();
    const matchesQuery =
      item.clienteNome.toLowerCase().includes(query) ||
      item.token.toLowerCase().includes(query) ||
      (item.tituloCustomizado && item.tituloCustomizado.toLowerCase().includes(query)) ||
      (item.pacote?.titulo && item.pacote.titulo.toLowerCase().includes(query));

    return matchesStatus && matchesQuery;
  });

  return (
    <div className="space-[#111827] space-y-6">
      {/* HEADER DAS COTAÇÕES */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-[#0A1A3C]">Gestão de Orçamentos Digitais</h1>
            <span className="text-xs font-bold bg-[#5EA8FF]/10 text-[#5EA8FF] border border-[#5EA8FF]/20 px-2.5 py-0.5 rounded-full uppercase">
              InfoTravel Style
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Crie, envie via WhatsApp e acompanhe propostas interativas para seus clientes.
          </p>
        </div>

        <Link
          href="/admin/orcamentos/novo"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#0A1A3C] hover:bg-[#122A5C] text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Gerar Nova Proposta Digital
        </Link>
      </div>

      {/* TOAST FEEDBACK DE LINK COPIADO */}
      {copiedToken && (
        <div className="p-4 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-between shadow-lg animate-bounce">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Link da Proposta copiado com sucesso para a área de transferência!</span>
          </div>
          <span className="text-[10px] uppercase font-mono bg-white/20 px-2 py-0.5 rounded">Token: {copiedToken}</span>
        </div>
      )}

      {/* BARRA DE FILTROS E BUSCA */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {["TODOS", "PENDENTE", "APROVADO", "EXPIRADO"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                filterStatus === status
                  ? "bg-[#0A1A3C] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {status === "TODOS" ? "Todos os Orçamentos" : status}
            </button>
          ))}
        </div>

        <div className="w-full md:w-72 relative">
          <input
            type="text"
            placeholder="Buscar por cliente, token..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#5EA8FF] outline-hidden"
          />
          <svg
            className="w-4 h-4 text-slate-400 absolute left-3 top-2.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* LISTA / TABELA DE ORÇAMENTOS */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <div className="w-8 h-8 border-4 border-[#5EA8FF] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs font-bold text-[#0A1A3C]">Carregando orçamentos...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 text-red-600 text-xs font-bold rounded-2xl border border-red-200">
          {error}
        </div>
      ) : filteredOrcamentos.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-sm font-bold text-[#0A1A3C]">Nenhum orçamento encontrado</h3>
          <p className="text-xs text-slate-500">Crie seu primeiro orçamento interativo para começar a enviar propostas aos clientes.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0A1A3C] text-white text-[11px] uppercase tracking-wider">
                  <th className="p-4 font-bold">Cliente & WhatsApp</th>
                  <th className="p-4 font-bold">Proposta / Viagem</th>
                  <th className="p-4 font-bold">Valor Total</th>
                  <th className="p-4 font-bold">Validade</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredOrcamentos.map((orc) => {
                  const title = orc.tituloCustomizado || orc.pacote?.titulo || "Proposta Personalizada";
                  const isApproved = orc.status === "Aprovado";
                  const isExpired = orc.status === "Expirado";

                  return (
                    <tr key={orc.id} className="hover:bg-slate-50 transition-colors">
                      {/* CLIENTE */}
                      <td className="p-4">
                        <p className="font-bold text-[#0A1A3C]">{orc.clienteNome}</p>
                        <p className="text-slate-500 text-[11px]">{orc.clienteWhatsapp}</p>
                      </td>

                      {/* PROPOSTA */}
                      <td className="p-4">
                        <p className="font-bold text-slate-800">{title}</p>
                        <span className="text-[10px] font-mono text-slate-400">Token: {orc.token}</span>
                      </td>

                      {/* VALOR */}
                      <td className="p-4 font-black text-[#0A1A3C]">
                        {formatCurrency(orc.valorTotal)}
                      </td>

                      {/* VALIDADE */}
                      <td className="p-4 text-slate-600 font-medium">
                        {formatDate(orc.validade)}
                      </td>

                      {/* STATUS */}
                      <td className="p-4">
                        {isApproved ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            Aprovado
                          </span>
                        ) : isExpired ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                            Expirado
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            Pendente
                          </span>
                        )}
                      </td>

                      {/* AÇÕES */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* BOTÃO COPIAR LINK DA PROPOSTA */}
                          <button
                            onClick={() => handleCopyLink(orc.token)}
                            className="px-3 py-1.5 bg-[#5EA8FF]/10 text-[#0A1A3C] hover:bg-[#5EA8FF]/20 border border-[#5EA8FF]/30 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                            title="Copiar Link da Proposta"
                          >
                            <svg className="w-3.5 h-3.5 text-[#5EA8FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                            Copiar Link
                          </button>

                          {/* LINK VER PÚBLICO */}
                          <a
                            href={`/proposta/${orc.token}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-slate-500 hover:text-[#0A1A3C] hover:bg-slate-100 rounded-lg transition-colors"
                            title="Visualizar Proposta Pública"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </a>

                          {/* BOTÃO EDITAR PROPOSTA */}
                          <Link
                            href={`/admin/orcamentos/${orc.id}/editar`}
                            className="p-1.5 text-[#5EA8FF] hover:text-[#0A1A3C] hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar Proposta em Tempo Real"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>

                          {/* BOTÃO EXCLUIR */}
                          <button
                            onClick={() => handleDelete(orc.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Excluir Orçamento"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

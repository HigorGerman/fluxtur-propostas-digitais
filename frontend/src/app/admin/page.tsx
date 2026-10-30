"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiRequest } from "@/services/api";

interface Orcamento {
  id: string;
  token: string;
  clienteNome: string;
  clienteWhatsapp: string;
  status: string;
  valorTotal: number;
  criadoEm: string;
  validade: string;
  tituloCustomizado?: string;
  hotelNomeCustomizado?: string;
  hotelFotoUrlCustomizada?: string;
  destinoCustomizado?: string;
}

export default function AdminDashboardPage() {
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("");

  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [totalLancadas, setTotalLancadas] = useState(0);
  const [totalPendentes, setTotalPendentes] = useState(0);
  const [totalAprovadas, setTotalAprovadas] = useState(0);
  const [lucroMensal, setLucroMensal] = useState(0);
  const [volumeTotal, setVolumeTotal] = useState(0);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  useEffect(() => {
    const userStr = sessionStorage.getItem("user") || localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserName(user.nome);
        setRole(user.role);
      } catch {}
    }

    const loadMetrics = async () => {
      try {
        setLoadingMetrics(true);
        const data = await apiRequest<Orcamento[]>("/orcamentos");
        setOrcamentos(data);

        setTotalLancadas(data.length);

        const pendentes = data.filter((o) => o.status === "Pendente");
        setTotalPendentes(pendentes.length);

        const aprovadas = data.filter((o) => o.status === "Aprovado");
        setTotalAprovadas(aprovadas.length);

        // Volume total orcado
        const totVal = data.reduce((acc, o) => acc + (o.valorTotal || 0), 0);
        setVolumeTotal(totVal);

        // Lucro / Faturamento mensal (Propostas aprovadas ou lancadas no mes atual)
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const mensalVal = data.reduce((acc, o) => {
          if (!o.criadoEm) return acc;
          const dt = new Date(o.criadoEm);
          if (dt.getMonth() === currentMonth && dt.getFullYear() === currentYear) {
            return acc + (o.valorTotal || 0);
          }
          return acc;
        }, 0);

        setLucroMensal(mensalVal);
      } catch (err) {
        console.error("Erro ao carregar metricas:", err);
      } finally {
        setLoadingMetrics(false);
      }
    };

    loadMetrics();
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val || 0);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleCopyLink = (token: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    const url = `${origin}/proposta/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 3000);
  };

  return (
    <div className="space-y-8 w-full my-4 pb-12">
      {/* HERO BANNER EXECUTIVO */}
      <div className="bg-[#0A1A3C] text-white border border-[#122A5C] rounded-2xl p-6 md:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#38BDF8]/10 border border-[#38BDF8]/30 text-[#38BDF8] mb-3">
              <span className="h-2 w-2 rounded-full bg-[#38BDF8] animate-pulse"></span>
              Painel Executivo de Propostas
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white mb-2">
              Bem-vindo ao Painel, <span className="text-[#38BDF8]">{userName || "Agente Fluxtur"}</span>!
            </h1>
            <p className="text-slate-300 text-xs md:text-sm max-w-2xl leading-relaxed font-medium">
              Acompanhe o desempenho das suas propostas digitais interativas, propostas pendentes e volume financeiro em tempo real.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/"
              className="px-4 py-3 bg-[#122A5C] hover:bg-[#1a3878] text-[#38BDF8] border border-[#38BDF8]/40 text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2 hover:scale-102"
              title="Retornar à tela inicial do sistema"
            >
              <span>🏠</span>
              <span>Tela Inicial</span>
            </Link>

            <Link
              href="/admin/orcamentos/novo"
              className="px-6 py-3 bg-[#38BDF8] hover:bg-[#0284c7] text-[#0A1A3C] text-xs font-black rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2 hover:scale-102"
            >
              <span>✨</span>
              Criar Nova Proposta Digital
            </Link>
          </div>
        </div>
      </div>

      {/* METRICAS PRINCIPAIS DO DASHBOARD */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* CARD 1: PROPOSTAS LANÇADAS */}
        <div className="bg-white border border-[#E5E9F0] rounded-2xl p-6 shadow-xs relative overflow-hidden group hover:border-[#38BDF8] transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Propostas Lançadas</span>
            <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0A1A3C]">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-black text-[#0A1A3C] mb-1">
            {loadingMetrics ? "..." : totalLancadas}
          </div>
          <p className="text-xs text-slate-500 font-medium">Total de orçamentos gerados</p>
        </div>

        {/* CARD 2: PROPOSTAS PENDENTES */}
        <div className="bg-white border border-[#E5E9F0] rounded-2xl p-6 shadow-xs relative overflow-hidden group hover:border-amber-400 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Propostas Pendentes</span>
            <div className="h-10 w-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-black text-amber-600 mb-1">
            {loadingMetrics ? "..." : totalPendentes}
          </div>
          <p className="text-xs text-slate-500 font-medium">Aguardando decisão do cliente</p>
        </div>

        {/* CARD 3: PROPOSTAS APROVADAS */}
        <div className="bg-white border border-[#E5E9F0] rounded-2xl p-6 shadow-xs relative overflow-hidden group hover:border-emerald-400 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Propostas Aprovadas</span>
            <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-600 mb-1">
            {loadingMetrics ? "..." : totalAprovadas}
          </div>
          <p className="text-xs text-slate-500 font-medium">Vendas confirmadas</p>
        </div>

        {/* CARD 4: VOLUME MENSAL */}
        <div className="bg-white border border-[#E5E9F0] rounded-2xl p-6 shadow-xs relative overflow-hidden group hover:border-[#38BDF8] transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lucro / Volume Mensal</span>
            <div className="h-10 w-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-[#38BDF8]">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-2xl font-black text-[#0A1A3C] mb-1">
            {loadingMetrics ? "..." : formatCurrency(lucroMensal)}
          </div>
          <p className="text-xs text-slate-500 font-medium">Volume emitido no mês atual</p>
        </div>
      </div>

      {/* TABELA DE ÚLTIMAS PROPOSTAS LANÇADAS */}
      <div className="bg-white border border-[#E5E9F0] rounded-2xl shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-[#0A1A3C]">Últimas Propostas Lançadas</h2>
            <p className="text-xs text-slate-500 mt-0.5">Gerencie os links e acompanhe as respostas dos clientes.</p>
          </div>
          <Link
            href="/admin/orcamentos"
            className="text-xs font-bold text-[#38BDF8] hover:text-[#0284c7] transition-colors"
          >
            Ver Todas ➔
          </Link>
        </div>

        {loadingMetrics ? (
          <div className="p-8 text-center text-xs text-slate-500 font-bold">
            Carregando propostas...
          </div>
        ) : orcamentos.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 font-bold">
            Nenhuma proposta cadastrada ainda. Clique em "Criar Nova Proposta Digital" acima!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Cliente / WhatsApp</th>
                  <th className="p-4">Título / Acomodação</th>
                  <th className="p-4">Data Emissão</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Valor Total</th>
                  <th className="p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orcamentos.slice(0, 5).map((orc) => (
                  <tr key={orc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-[#0A1A3C]">{orc.clienteNome}</div>
                      <div className="text-[11px] text-slate-500">{orc.clienteWhatsapp}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-[#0A1A3C] flex items-center justify-center relative shadow-xs">
                          {orc.hotelFotoUrlCustomizada ? (
                            <img
                              src={orc.hotelFotoUrlCustomizada}
                              alt="Acomodação"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = "none";
                              }}
                            />
                          ) : (
                            <img
                              src="/logo.png"
                              alt="Fluxtur"
                              className="w-6 h-6 object-contain"
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-800 truncate max-w-xs">
                            {orc.tituloCustomizado || orc.hotelNomeCustomizado || "Proposta Personalizada"}
                          </div>
                          {orc.destinoCustomizado && (
                            <div className="text-[10px] text-[#0284C7] font-semibold truncate max-w-[150px]">
                              📍 {orc.destinoCustomizado}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">{formatDate(orc.criadoEm)}</td>
                    <td className="p-4">
                      {orc.status === "Aprovado" ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          🟢 Aprovado
                        </span>
                      ) : orc.status === "Expirado" ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                          ⚪ Expirado
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          🟡 Pendente
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-black text-[#0A1A3C]">{formatCurrency(orc.valorTotal)}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleCopyLink(orc.token)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#0A1A3C] font-bold rounded-lg text-[11px] transition-all cursor-pointer"
                        >
                          {copiedToken === orc.token ? "Copiado!" : "Copiar Link"}
                        </button>
                        <a
                          href={`/proposta/${orc.token}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-[#0A1A3C] hover:bg-[#122A5C] text-white font-bold rounded-lg text-[11px] transition-all"
                        >
                          Ver
                        </a>
                        <Link
                          href={`/admin/orcamentos/${orc.id}/editar`}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg text-[11px] transition-all"
                        >
                          Editar
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ATALHOS RÁPIDOS MÓDULOS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/orcamentos"
          className="bg-white border border-[#E5E9F0] hover:border-[#38BDF8] rounded-2xl p-6 transition-all shadow-xs flex flex-col justify-between group cursor-pointer"
        >
          <div>
            <div className="h-12 w-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#0A1A3C] mb-4 group-hover:scale-105 transition-transform">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[#0A1A3C] mb-1 group-hover:text-[#38BDF8] transition-colors">
              Propostas Digitais Interativas
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Gerencie todas as cotações criadas, acompanhe aprovações e envie links via WhatsApp.
            </p>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700">
              Propostas
            </span>
            <span className="text-xs font-semibold text-slate-500 group-hover:text-[#38BDF8] transition-colors">
              Acessar propostas ➔
            </span>
          </div>
        </Link>

        <Link
          href="/admin/orcamentos/novo"
          className="bg-white border border-[#E5E9F0] hover:border-[#38BDF8] rounded-2xl p-6 transition-all shadow-xs flex flex-col justify-between group cursor-pointer"
        >
          <div>
            <div className="h-12 w-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-[#0284C7] mb-4 group-hover:scale-105 transition-transform">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[#0A1A3C] mb-1 group-hover:text-[#38BDF8] transition-colors">
              Emitir Nova Proposta
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Gere uma proposta digital personalizada com voos estruturados, hotel e simulador de parcelamento.
            </p>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-sky-50 text-sky-700">
              Construtor Rápido
            </span>
            <span className="text-xs font-semibold text-slate-500 group-hover:text-[#38BDF8] transition-colors">
              Criar agora ➔
            </span>
          </div>
        </Link>

        <Link
          href="/admin/pacotes"
          className="bg-white border border-[#E5E9F0] hover:border-[#38BDF8] rounded-2xl p-6 transition-all shadow-xs flex flex-col justify-between group cursor-pointer"
        >
          <div>
            <div className="h-12 w-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-105 transition-transform">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[#0A1A3C] mb-1 group-hover:text-emerald-600 transition-colors">
              Gestão de Pacotes Base
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Crie templates de pacotes de viagem com itinerários pré-configurados.
            </p>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
              Ofertas
            </span>
            <span className="text-xs font-semibold text-slate-500 group-hover:text-emerald-600 transition-colors">
              Acessar pacotes ➔
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}

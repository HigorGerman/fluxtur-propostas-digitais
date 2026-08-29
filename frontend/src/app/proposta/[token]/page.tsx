"use client";

import { useEffect, useState, use } from "react";

interface Hotel {
  id: string;
  nome: string;
  endereco: string;
  cidade: string;
  estrelas: number;
  fotoUrl: string;
  telefone: string;
  emailContato: string;
}

interface Pacote {
  id: string;
  titulo: string;
  destino: string;
  estadoDestino: string;
  cidadeDestino: string;
  hotelId?: string;
  hotel?: Hotel;
  fotoUrl: string;
  precoBase: number;
}

export interface TrechoVoo {
  origem: string;
  destino: string;
  companhia: string;
  horarioSaida: string;
  horarioChegada: string;
  duracao?: string;
  tempoEspera?: string;
}

interface Orcamento {
  id: string;
  token: string;
  clienteNome: string;
  clienteEmail?: string;
  clienteWhatsapp: string;
  validade: string;
  status: "Pendente" | "Aprovado" | "Rejeitado" | "Expirado" | string;

  valorTotal: number;
  valorProdutos: number;
  valorTaxas: number;

  observacoes?: string;
  criadoEm: string;
  hotelId?: string;
  hotel?: Hotel;
  pacoteId?: string;
  pacote?: Pacote;

  tituloCustomizado?: string;
  destinoCustomizado?: string;

  // Passageiros
  quantidadeAdultos?: number;
  quantidadeCriancas?: number;
  idadesCriancas?: string;

  // Hospedagem Estruturada
  hotelNomeCustomizado?: string;
  hotelFotoUrlCustomizada?: string;
  hotelGaleriaFotos?: string;
  checkInData?: string;
  checkInHorario?: string;
  checkOutData?: string;
  checkOutHorario?: string;
  quantidadeNoites?: number;
  tipoQuarto?: string;
  regimeAlimentacao?: string;
  politicaCancelamento?: string;

  // Voo Ida
  vooIdaCompanhia?: string;
  vooIdaOrigem?: string;
  vooIdaDestino?: string;
  vooIdaDataSaida?: string;
  vooIdaHorarioSaida?: string;
  vooIdaDataChegada?: string;
  vooIdaHorarioChegada?: string;
  vooIdaDuracao?: string;
  vooIdaParadas?: number;
  vooIdaTrechosJson?: string;

  // Voo Volta
  vooVoltaCompanhia?: string;
  vooVoltaOrigem?: string;
  vooVoltaDestino?: string;
  vooVoltaDataSaida?: string;
  vooVoltaHorarioSaida?: string;
  vooVoltaDataChegada?: string;
  vooVoltaHorarioChegada?: string;
  vooVoltaDuracao?: string;
  vooVoltaParadas?: number;
  vooVoltaTrechosJson?: string;

  incluiTransfer: boolean;
  incluiSeguro: boolean;
  observacoesPagamento?: string;
  mensagemCliente?: string;

  // Agente
  agenteNome?: string;
  agenteTelefone?: string;
  agenteEmail?: string;
  agenteFotoUrl?: string;
}

export default function PropostaPublicaPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [orcamento, setOrcamento] = useState<Orcamento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal & Tabs
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [mensagemCliente, setMensagemCliente] = useState("");
  const [approving, setApproving] = useState(false);
  const [approvedSuccess, setApprovedSuccess] = useState(false);

  const [activeTab, setActiveTab] = useState<"visao-geral" | "quarto" | "localizacao">("visao-geral");
  const [selectedCardBrand, setSelectedCardBrand] = useState("Mastercard");

  const fetchOrcamento = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await fetch(`http://localhost:5008/api/orcamentos/public/${token}`);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("Proposta de viagem não encontrada ou token inválido.");
        }
        throw new Error("Erro ao carregar os dados da proposta.");
      }
      const data: Orcamento = await res.json();
      setOrcamento(data);
    } catch (err: any) {
      if (!silent) setError(err.message || "Não foi possível carregar a proposta.");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrcamento(false);
      const interval = setInterval(() => {
        fetchOrcamento(true);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [token]);

  const handleAprovar = async () => {
    try {
      setApproving(true);
      const res = await fetch(`http://localhost:5008/api/orcamentos/public/${token}/aprovar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "Aprovado",
          mensagemCliente: mensagemCliente.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Erro ao aprovar proposta.");
      }

      const resData = await res.json();
      setOrcamento(resData.orcamento);
      setApprovedSuccess(true);
      setShowApprovalModal(false);
    } catch (err: any) {
      alert(err.message || "Erro ao processar aprovação.");
    } finally {
      setApproving(false);
    }
  };

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
      month: "short",
    });
  };

  const buildWhatsappLink = () => {
    if (!orcamento) return "#";
    const rawPhone = orcamento.agenteTelefone || orcamento.clienteWhatsapp || "5518981096649";
    const phone = rawPhone.replace(/\D/g, "");
    const title = orcamento.tituloCustomizado || orcamento.hotelNomeCustomizado || "Proposta de Viagem";
    const message = `Olá ${orcamento.agenteNome || "Fluxtur"}! Vi a proposta de viagem *${title}* e gostaria de tirar dúvidas!`;
    return `https://wa.me/${phone.length <= 11 ? `55${phone}` : phone}?text=${encodeURIComponent(message)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center p-4 font-sans">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="w-12 h-12 border-4 border-[#38BDF8] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#0A1A3C] font-bold text-lg">Carregando Proposta Interativa...</p>
        </div>
      </div>
    );
  }

  if (error || !orcamento) {
    return (
      <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-xl border border-red-100 text-center">
          <h2 className="text-2xl font-black text-[#0A1A3C] mb-2">Proposta Indisponível</h2>
          <p className="text-slate-600 text-sm mb-6">{error || "Não conseguimos localizar o orçamento solicitado."}</p>
          <a
            href="https://wa.me/5518981096649"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 bg-[#0A1A3C] text-white font-bold rounded-xl shadow-md"
          >
            Falar com a Agência
          </a>
        </div>
      </div>
    );
  }

  const title = orcamento.tituloCustomizado || orcamento.hotelNomeCustomizado || orcamento.pacote?.titulo || "Proposta Exclusiva de Viagem";
  const hotelNome = orcamento.hotelNomeCustomizado || orcamento.hotel?.nome || "Vila Galé Cabo Resort - All Inclusive";
  const fotoPrincipal = orcamento.hotelFotoUrlCustomizada || orcamento.hotel?.fotoUrl || orcamento.pacote?.fotoUrl || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80";

  // Galeria de fotos
  let galeriaList = [
    fotoPrincipal,
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80",
  ];

  if (orcamento.hotelGaleriaFotos) {
    const customList = orcamento.hotelGaleriaFotos.split(",").map((s) => s.trim()).filter(Boolean);
    if (customList.length > 0) galeriaList = customList;
  }

  // Parse Trechos JSON
  let trechosIda: TrechoVoo[] = [];
  if (orcamento.vooIdaTrechosJson) {
    try {
      const parsed = JSON.parse(orcamento.vooIdaTrechosJson);
      if (Array.isArray(parsed)) trechosIda = parsed;
    } catch {}
  }

  if (trechosIda.length === 0) {
    // Fallback padrão se não houver JSON
    trechosIda = [
      {
        origem: "PPB (Presidente Prudente)",
        destino: "GRU (Guarulhos)",
        companhia: "GOL 1234",
        horarioSaida: "08:00",
        horarioChegada: "09:15",
        tempoEspera: "Conexão de 02h 15min em GRU",
      },
      {
        origem: "GRU (Guarulhos)",
        destino: "REC (Recife)",
        companhia: "GOL 5678",
        horarioSaida: "11:30",
        horarioChegada: "14:45",
      },
    ];
  }

  let trechosVolta: TrechoVoo[] = [];
  if (orcamento.vooVoltaTrechosJson) {
    try {
      const parsed = JSON.parse(orcamento.vooVoltaTrechosJson);
      if (Array.isArray(parsed)) trechosVolta = parsed;
    } catch {}
  }

  if (trechosVolta.length === 0) {
    // Fallback padrão se não houver JSON
    trechosVolta = [
      {
        origem: "REC (Recife)",
        destino: "CGH (Congonhas)",
        companhia: "Latam 3210",
        horarioSaida: "12:50",
        horarioChegada: "16:00",
        tempoEspera: "Conexão de 02h 00min em CGH",
      },
      {
        origem: "CGH (Congonhas)",
        destino: "PPB (Presidente Prudente)",
        companhia: "Latam 7890",
        horarioSaida: "18:00",
        horarioChegada: "19:20",
      },
    ];
  }

  const isExpired = orcamento.status === "Expirado";
  const isApproved = orcamento.status === "Aprovado";

  // Calculo financeiro
  const totalGeral = orcamento.valorTotal || 17312.52;
  const produtosVal = orcamento.valorProdutos > 0 ? orcamento.valorProdutos : (totalGeral * 0.974);
  const taxasVal = orcamento.valorTaxas > 0 ? orcamento.valorTaxas : (totalGeral - produtosVal);

  // Parcelamento 1x a 12x
  const parcelas = Array.from({ length: 12 }, (_, i) => {
    const num = i + 1;
    let valorParc = totalGeral / num;
    let comJuros = false;
    let totalComJuros = totalGeral;

    if (num > 10) {
      comJuros = true;
      totalComJuros = totalGeral * (1 + (num - 10) * 0.038);
      valorParc = totalComJuros / num;
    }

    return {
      num,
      valor: valorParc,
      total: totalComJuros,
      comJuros,
    };
  });

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#111827] font-sans pb-32">
      {/* HEADER FIXO */}
      <header className="bg-[#0A1A3C] text-white border-b border-[#122A5C] sticky top-0 z-40 shadow-md">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-[#38BDF8]/40 p-0.5 bg-[#0A1128] shrink-0">
              <img src="/logo.png" alt="Fluxtur Logo" className="w-full h-full object-cover rounded-full" />
            </div>
            <span className="text-2xl font-black tracking-widest text-[#38BDF8]">FLUXTUR</span>
            <span className="hidden sm:inline-block text-[10px] tracking-widest bg-[#122A5C] text-slate-300 px-2.5 py-1 rounded font-bold uppercase border border-[#38BDF8]/20">
              PROPOSTA DIGITAL
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => window.print()}
              className="no-print inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#122A5C] hover:bg-[#1a3878] text-[#38BDF8] border border-[#38BDF8]/30 transition-all cursor-pointer shadow-xs"
            >
              <span>🖨️</span>
              <span className="hidden sm:inline">Imprimir / Baixar PDF</span>
            </button>

            <div>
              {isApproved ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Aprovada
                </span>
              ) : isExpired ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  Expirada
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-sky-500/20 text-[#38BDF8] border border-[#38BDF8]/30">
                  Válida até {formatDate(orcamento.validade)}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 mt-6 space-y-6">
        
        {/* GALERIA DE FOTOS DO HOTEL */}
        <section className="bg-white rounded-2xl p-4 md:p-6 shadow-xs border border-slate-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 rounded-2xl overflow-hidden h-[340px] md:h-[420px]">
            <div className="md:col-span-2 relative h-full group overflow-hidden">
              <img
                src={galeriaList[0]}
                alt={hotelNome}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute bottom-3 left-3 bg-[#0A1A3C]/80 backdrop-blur-xs text-[#38BDF8] px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                LAZER & PISCINA
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 h-full">
              {galeriaList.slice(1, 5).map((imgUrl, index) => (
                <div key={index} className="relative h-full overflow-hidden group">
                  <img
                    src={imgUrl}
                    alt={`${hotelNome} foto ${index + 2}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {index === 3 && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center text-white font-bold text-sm">
                      Ver fotos
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ABAS */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3 pt-2">
            <button
              onClick={() => setActiveTab("visao-geral")}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "visao-geral"
                  ? "bg-[#38BDF8] text-[#0A1A3C] shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Visão geral
            </button>
            <button
              onClick={() => setActiveTab("quarto")}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "quarto"
                  ? "bg-[#38BDF8] text-[#0A1A3C] shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Quarto
            </button>
            <button
              onClick={() => setActiveTab("localizacao")}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "localizacao"
                  ? "bg-[#38BDF8] text-[#0A1A3C] shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Localização
            </button>
          </div>

          {/* CARD HOSPEDAGEM */}
          <div className="space-y-4 pt-2">
            <h2 className="text-xl md:text-2xl font-black text-[#0A1A3C] flex items-center gap-2">
              <span>🏨 Hospedagem - {hotelNome}</span>
            </h2>

            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">📅</span>
                <span>{formatDate(orcamento.checkInData || "2026-11-21")} – {formatDate(orcamento.checkOutData || "2026-11-27")}</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">🌙</span>
                <span>{orcamento.quantidadeNoites || 6} noites</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">👥</span>
                <span>
                  {orcamento.quantidadeCriancas && orcamento.quantidadeCriancas > 0
                    ? `${orcamento.quantidadeCriancas} Crianças (${orcamento.idadesCriancas || "1, 2, 6 anos"}) `
                    : ""}
                  {orcamento.quantidadeAdultos || 2} Adultos
                </span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                <span>🍹 {orcamento.regimeAlimentacao || "All Inclusive"}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">🛏️</span>
                <span className="uppercase text-slate-700">{orcamento.tipoQuarto || "APARTAMENTO FAMILIAR SUPERIOR MASTER"}</span>
              </div>
              <div className="text-emerald-600 flex items-center gap-1">
                <span>✓ {orcamento.politicaCancelamento || "Cancelamento grátis até 5 de novembro de 2026"}</span>
              </div>
            </div>
          </div>
        </section>

        {/* CARD DE VOOS DETALHADOS (TRECHO POR TRECHO COM CONEXÕES) */}
        <section className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-6">
          <h2 className="text-xl font-black text-[#0A1A3C] flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="text-xl">✈️</span> Itinerário Detalhado dos Voos
          </h2>

          {/* VOO DE IDA (CRONOGRAMA DE TRECHOS) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <div className="flex items-center gap-2 text-[#0A1A3C] font-black text-sm">
                <span>✈️ VOO DE IDA</span>
              </div>
              <div className="flex items-center gap-4 text-slate-500">
                <span>📅 sáb., 21 de nov.</span>
                <span>👥 {orcamento.quantidadeCriancas || 3} Crianças | {orcamento.quantidadeAdultos || 2} Adultos</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              {trechosIda.map((t, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-[#0A1A3C] bg-blue-100 px-2 py-1 rounded">
                        Trecho {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-[#0A1A3C]">{t.companhia}</span>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <span className="text-base font-black text-[#0A1A3C] block">{t.horarioSaida}</span>
                        <span className="text-[11px] font-bold text-slate-600">{t.origem}</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <span className="text-[10px] text-slate-400 font-bold">➔</span>
                        <div className="w-16 h-0.5 bg-slate-300"></div>
                      </div>

                      <div className="text-center">
                        <span className="text-base font-black text-[#0A1A3C] block">{t.horarioChegada}</span>
                        <span className="text-[11px] font-bold text-slate-600">{t.destino}</span>
                      </div>
                    </div>
                  </div>

                  {/* CONEXÃO ENTRE TRECHOS */}
                  {t.tempoEspera && (
                    <div className="flex items-center justify-center gap-2 p-2 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold my-1">
                      <span>⏱️ {t.tempoEspera}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* VOO DE VOLTA (CRONOGRAMA DE TRECHOS) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <div className="flex items-center gap-2 text-[#0A1A3C] font-black text-sm">
                <span>🛬 VOO DE VOLTA</span>
              </div>
              <div className="flex items-center gap-4 text-slate-500">
                <span>📅 sex., 27 de nov.</span>
                <span>👥 {orcamento.quantidadeCriancas || 3} Crianças | {orcamento.quantidadeAdultos || 2} Adultos</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              {trechosVolta.map((t, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-[#0A1A3C] bg-slate-200 px-2 py-1 rounded">
                        Trecho {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-[#0A1A3C]">{t.companhia}</span>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <span className="text-base font-black text-[#0A1A3C] block">{t.horarioSaida}</span>
                        <span className="text-[11px] font-bold text-slate-600">{t.origem}</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <span className="text-[10px] text-slate-400 font-bold">➔</span>
                        <div className="w-16 h-0.5 bg-slate-300"></div>
                      </div>

                      <div className="text-center">
                        <span className="text-base font-black text-[#0A1A3C] block">{t.horarioChegada}</span>
                        <span className="text-[11px] font-bold text-slate-600">{t.destino}</span>
                      </div>
                    </div>
                  </div>

                  {/* CONEXÃO ENTRE TRECHOS */}
                  {t.tempoEspera && (
                    <div className="flex items-center justify-center gap-2 p-2 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold my-1">
                      <span>⏱️ {t.tempoEspera}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CARD RESUMO DE VALORES */}
          <div className="p-4 bg-[#F5F7FB] rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-lg font-black text-[#0A1A3C] flex items-center gap-2">
              <span>💰 Resumo de Valores</span>
            </h3>

            <div className="flex flex-wrap items-center gap-6 text-xs font-bold">
              <div>
                <span className="text-slate-500 block">Produtos:</span>
                <span className="text-[#0A1A3C] font-black text-sm">{formatCurrency(produtosVal)}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Taxas:</span>
                <span className="text-[#0A1A3C] font-black text-sm">{formatCurrency(taxasVal)}</span>
              </div>
              <div className="pl-4 border-l border-slate-300">
                <span className="text-slate-500 block">Total Geral:</span>
                <span className="text-[#0A1A3C] font-black text-lg">{formatCurrency(totalGeral)}</span>
              </div>
            </div>
          </div>
        </section>

        {/* SIMULAÇÃO DE PAGAMENTO & PARCELAMENTO */}
        <section className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-black text-[#0A1A3C]">Simulação de pagamento</h2>
            <div className="w-16 h-1 bg-[#38BDF8] mx-auto mt-2 rounded-full"></div>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
              💳 Cartão de Crédito
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {["Mastercard", "Visa", "Elo", "Hipercard", "Diners", "Amex"].map((brand) => (
                <button
                  key={brand}
                  onClick={() => setSelectedCardBrand(brand)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    selectedCardBrand === brand
                      ? "bg-[#38BDF8] text-[#0A1A3C] border-[#38BDF8] shadow-xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 p-4 bg-slate-50/60 rounded-2xl border border-slate-200 text-xs">
            {parcelas.map((p) => (
              <div key={p.num} className="flex items-center justify-between py-2 border-b border-slate-200/60 last:border-0">
                <span className="font-bold text-[#0A1A3C]">
                  {p.num}x <span className="font-normal text-slate-600">de {formatCurrency(p.valor)}</span>
                </span>
                <span className="font-bold text-slate-600">
                  Total: <span className="text-blue-600">{formatCurrency(p.total)}</span>
                  {p.comJuros && <span className="text-[10px] text-slate-500 font-normal ml-1">(Com Juros)</span>}
                </span>
              </div>
            ))}
          </div>

          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">📱</span>
              <div>
                <span className="text-xs font-bold text-slate-700 block">Pagamento à Vista via PIX</span>
                <span className="text-[10px] text-slate-500">Desconto aplicado no valor total</span>
              </div>
            </div>
            <span className="text-2xl font-black text-emerald-600">{formatCurrency(totalGeral)}</span>
          </div>
        </section>

        {/* INFORMAÇÕES DE CONTATO DO AGENTE */}
        <section className="bg-white rounded-2xl p-6 md:p-8 shadow-xs border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="flex items-center space-x-4 border-r-0 md:border-r border-slate-200 pr-0 md:pr-6">
              <div className="w-20 h-20 rounded-full bg-slate-200 border-2 border-[#38BDF8] shrink-0 overflow-hidden flex items-center justify-center text-slate-400">
                {orcamento.agenteFotoUrl ? (
                  <img src={orcamento.agenteFotoUrl} alt={orcamento.agenteNome || "Agente"} className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>
              <div>
                <h2 className="text-xl font-black text-[#0A1A3C]">Informações de contato</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Para mais informações sobre seu orçamento, entre em contato com seu agente de viagens.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <span className="text-slate-400">👤</span>
                <span>{orcamento.agenteNome || "Gabriel Aguiar Cordeiro"} | Fluxtur Viagens</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="text-slate-400">📞</span>
                <span>{orcamento.agenteTelefone || "(18) 98109-6649"}</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="text-slate-400">✉️</span>
                <span>{orcamento.agenteEmail || "sp.gabriel@fluxtur.com.br"}</span>
              </div>

              <div className="pt-2">
                <a
                  href={buildWhatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center px-6 py-3 border border-blue-600 text-blue-600 hover:bg-blue-50 font-bold text-xs rounded-xl transition-all"
                >
                  Entrar em contato
                </a>
              </div>
            </div>
          </div>
        </section>

        {approvedSuccess && (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-center space-y-2">
            <h4 className="text-xl font-black text-emerald-800">🎉 Proposta Aprovada com Sucesso!</h4>
            <p className="text-sm">Obrigado, {orcamento.clienteNome}! Nosso agente de viagens entrará em contato em breve para os vouchers.</p>
          </div>
        )}
      </main>

      {/* RODAPÉ FIXO DE AÇÃO */}
      <div className="no-print fixed bottom-0 left-0 right-0 z-50 bg-[#0A1A3C]/95 backdrop-blur-md border-t border-[#122A5C] p-4 shadow-2xl">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="hidden sm:block text-white">
            <p className="text-xs text-slate-400">Total da Viagem:</p>
            <p className="text-2xl font-black text-[#38BDF8]">{formatCurrency(totalGeral)}</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => window.print()}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center px-4 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-[#38BDF8] border border-[#38BDF8]/30 font-bold text-xs shadow-md transition-all gap-1.5 cursor-pointer"
            >
              <span>🖨️</span> Baixar PDF
            </button>

            <a
              href={buildWhatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs shadow-md transition-all gap-2"
            >
              Falar no WhatsApp
            </a>

            {!isExpired && (
              <button
                onClick={() => setShowApprovalModal(true)}
                disabled={isApproved}
                className={`flex-1 sm:flex-initial inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-xs shadow-md transition-all gap-2 cursor-pointer ${
                  isApproved
                    ? "bg-emerald-600 text-white opacity-90 cursor-not-allowed"
                    : "bg-[#38BDF8] text-[#0A1A3C] hover:brightness-110"
                }`}
              >
                {isApproved ? "Proposta Aprovada" : "Aprovar Orçamento"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MODAL DE APROVAÇÃO */}
      {showApprovalModal && (
        <div className="no-print fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-xl font-black text-[#0A1A3C]">Aprovar Proposta de Viagem</h3>
            <p className="text-xs text-slate-600">
              Você está prestes a aprovar a proposta para <span className="font-bold">{orcamento.clienteNome}</span> no valor de{" "}
              <span className="font-bold text-emerald-600">{formatCurrency(totalGeral)}</span>.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mensagem para o Agente (Opcional):
              </label>
              <textarea
                value={mensagemCliente}
                onChange={(e) => setMensagemCliente(e.target.value)}
                placeholder="Ex: Gostaria de confirmar para a data informada..."
                rows={3}
                className="w-full text-xs p-3 border border-slate-300 rounded-xl outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowApprovalModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleAprovar}
                disabled={approving}
                className="px-5 py-2.5 bg-[#0A1A3C] hover:bg-[#122A5C] text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2"
              >
                {approving && <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                Confirmar Aprovação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState, use } from "react";
import { BASE_URL } from "@/services/api";

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
  hotelEnderecoCustomizado?: string;
  hotelFotoUrlCustomizada?: string;
  hotelGaleriaFotos?: string;
  numeroQuarto?: string;
  codigoVoucher?: string;
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
  observacoesVoo?: string;
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

  // Modal & Tabs & Print state
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [mensagemCliente, setMensagemCliente] = useState("");
  const [approving, setApproving] = useState(false);
  const [approvedSuccess, setApprovedSuccess] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [previewPrint, setPreviewPrint] = useState(false);

  const [activeTab, setActiveTab] = useState<"visao-geral" | "quarto" | "localizacao">("visao-geral");
  const [selectedCardBrand, setSelectedCardBrand] = useState("Mastercard");

  const fetchOrcamento = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await fetch(`${BASE_URL}/orcamentos/public/${token}`);
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
      const res = await fetch(`${BASE_URL}/orcamentos/public/${token}/aprovar`, {
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

  const handleBaixarPdf = () => {
    setDownloadingPdf(true);
    setTimeout(() => {
      window.print();
      setDownloadingPdf(false);
    }, 250);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val || 0);
  };

  const formatSafeDate = (dateStr?: string, options?: Intl.DateTimeFormatOptions) => {
    if (!dateStr) return "";
    try {
      const cleanStr = dateStr.includes("T") ? dateStr : `${dateStr}T12:00:00`;
      const d = new Date(cleanStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("pt-BR", options || { day: "2-digit", month: "short", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  const formatDateWithWeekday = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const cleanStr = dateStr.includes("T") ? dateStr : `${dateStr}T12:00:00`;
      const d = new Date(cleanStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("pt-BR", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const WHATSAPP_EMPRESA_LINK = "https://api.whatsapp.com/message/4S7WZNCQT5SUH1?autoload=1&app_absent=0&utm_source=ig";
  const WHATSAPP_EMPRESA_NUMERO = "5518998048355";
  const WHATSAPP_EMPRESA_DISPLAY = "+55 18 99804-8355";

  const buildWhatsappLink = () => {
    if (!orcamento) return WHATSAPP_EMPRESA_LINK;
    const rawPhone = orcamento.agenteTelefone || WHATSAPP_EMPRESA_NUMERO;
    const phone = rawPhone.replace(/\D/g, "");
    const title = orcamento.tituloCustomizado || orcamento.hotelNomeCustomizado || "Proposta de Viagem";
    const message = `Olá! Vi a proposta de viagem *${title}* na Fluxtur e gostaria de tirar dúvidas!`;
    const finalPhone = phone.length <= 11 ? `55${phone}` : phone;
    return `https://wa.me/${finalPhone}?text=${encodeURIComponent(message)}`;
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
            href={WHATSAPP_EMPRESA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 bg-[#0A1A3C] text-white font-bold rounded-xl shadow-md"
          >
            Falar com a Fluxtur no WhatsApp
          </a>
        </div>
      </div>
    );
  }

  const title = orcamento.tituloCustomizado || orcamento.hotelNomeCustomizado || orcamento.pacote?.titulo || "Proposta Exclusiva de Viagem";
  const hotelNome = orcamento.hotelNomeCustomizado || orcamento.hotel?.nome || "Acomodação Selecionada";
  const enderecoHotel = orcamento.hotelEnderecoCustomizado || orcamento.hotel?.endereco || "";
  const queryMaps = (hotelNome || "") + (enderecoHotel ? " " + enderecoHotel : (orcamento.destinoCustomizado ? " " + orcamento.destinoCustomizado : ""));
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(queryMaps)}`;
  const rawFoto = orcamento.hotelFotoUrlCustomizada || orcamento.hotel?.fotoUrl || orcamento.pacote?.fotoUrl || "";
  const fotoPrincipal = rawFoto && !rawFoto.includes("images.unsplash.com") ? rawFoto : (rawFoto || "");

  // Galeria de fotos reais
  let galeriaList: string[] = [];
  if (fotoPrincipal) {
    galeriaList.push(fotoPrincipal);
  }

  if (orcamento.hotelGaleriaFotos) {
    const customList = orcamento.hotelGaleriaFotos
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    customList.forEach((url) => {
      if (!galeriaList.includes(url)) galeriaList.push(url);
    });
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
    trechosIda = [
      {
        origem: orcamento.vooIdaOrigem || "PPB (Presidente Prudente)",
        destino: orcamento.vooIdaDestino || "REC (Recife)",
        companhia: orcamento.vooIdaCompanhia || "GOL Linhas Aéreas",
        horarioSaida: orcamento.vooIdaHorarioSaida || "08:00",
        horarioChegada: orcamento.vooIdaHorarioChegada || "14:45",
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
    trechosVolta = [
      {
        origem: orcamento.vooVoltaOrigem || "REC (Recife)",
        destino: orcamento.vooVoltaDestino || "PPB (Presidente Prudente)",
        companhia: orcamento.vooVoltaCompanhia || "Latam Airlines",
        horarioSaida: orcamento.vooVoltaHorarioSaida || "12:50",
        horarioChegada: orcamento.vooVoltaHorarioChegada || "19:20",
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

  const propostaCodigo = `FLUX-${orcamento.token.substring(0, 8).toUpperCase()}`;
  const dataVooIdaFormatada = orcamento.vooIdaDataSaida
    ? formatDateWithWeekday(orcamento.vooIdaDataSaida)
    : (orcamento.checkInData ? formatDateWithWeekday(orcamento.checkInData) : "A confirmar");
  const dataVooVoltaFormatada = orcamento.vooVoltaDataSaida
    ? formatDateWithWeekday(orcamento.vooVoltaDataSaida)
    : (orcamento.checkOutData ? formatDateWithWeekday(orcamento.checkOutData) : "A confirmar");

  const totalAdultos = orcamento.quantidadeAdultos ?? 2;
  const totalCriancas = orcamento.quantidadeCriancas ?? 0;

  const currentUrl = typeof window !== "undefined" ? window.location.href : `https://fluxtur.com.br/proposta/${token}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(currentUrl)}`;

  return (
    <div className={`min-h-screen font-sans ${previewPrint ? "force-print-view bg-slate-200 py-14 px-4" : "bg-[#F5F7FB] text-[#111827] pb-32 print:bg-white print:text-black print:pb-0"}`}>
      
      {/* BARRA SUPERIOR DE PRÉ-VISUALIZAÇÃO DE IMPRESSÃO */}
      {previewPrint && (
        <div className="no-print fixed top-0 left-0 right-0 z-50 bg-[#0A1A3C] text-white py-3 px-4 md:px-8 shadow-2xl border-b border-[#38BDF8]/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-xs font-bold">
            <span className="text-base">📄</span>
            <span>Pré-visualização do Documento PDF</span>
            <span className="hidden sm:inline text-[11px] text-slate-300 font-normal">
              — Formato oficial para salvar em PDF ou imprimir em folha A4
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleBaixarPdf}
              className="px-4 py-2 rounded-xl bg-[#38BDF8] text-[#0A1A3C] font-black text-xs hover:brightness-110 flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <span>📥</span> Baixar PDF / Imprimir
            </button>
            <button
              onClick={() => setPreviewPrint(false)}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer border border-white/20"
            >
              ✕ Sair
            </button>
          </div>
        </div>
      )}

      {/* NOTIFICAÇÃO / TOAST AO CLICAR EM BAIXAR PDF */}
      {downloadingPdf && (
        <div className="no-print fixed top-6 right-6 z-50 bg-[#0A1A3C] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#38BDF8]/40 flex items-center gap-3 animate-bounce">
          <span className="w-4 h-4 border-2 border-[#38BDF8] border-t-transparent rounded-full animate-spin"></span>
          <span className="text-xs font-bold">Preparando PDF para download / impressão...</span>
        </div>
      )}

      {/* HEADER DE TELA (WEB) */}
      <header className="no-print bg-[#0A1A3C] text-white border-b border-[#122A5C] sticky top-0 z-40 shadow-md">
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

          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => setPreviewPrint(!previewPrint)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-[#122A5C] hover:bg-[#1a3878] border border-[#38BDF8]/20 transition-all cursor-pointer shadow-xs"
              title="Visualizar layout em formato de impressão / PDF"
            >
              <span>👁️</span>
              <span className="hidden md:inline">{previewPrint ? "Modo Interativo" : "Pré-visualizar PDF"}</span>
            </button>

            <button
              onClick={handleBaixarPdf}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#122A5C] hover:bg-[#1a3878] text-[#38BDF8] border border-[#38BDF8]/40 transition-all cursor-pointer shadow-md hover:scale-102"
              title="Baixar proposta em PDF ou imprimir"
            >
              <span className="text-base">📥</span>
              <span className="hidden sm:inline">Baixar PDF / Imprimir</span>
            </button>

            <div>
              {isApproved ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Aprovada
                </span>
              ) : isExpired ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  Expirada
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-sky-500/20 text-[#38BDF8] border border-[#38BDF8]/30">
                  Válida até {formatSafeDate(orcamento.validade, { day: "2-digit", month: "short" })}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className={previewPrint ? "max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-2xl space-y-5 text-black border border-slate-300" : "max-w-6xl mx-auto px-4 md:px-8 mt-6 space-y-6 print:px-0 print:mt-0 print:space-y-4"}>

        {/* CABEÇALHO EXCLUSIVO PARA IMPRESSÃO / PDF (TIMBRADO OFICIAL FLUXTUR) */}
        <div className="print-only border-b-2 border-[#0A1A3C] pb-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-[#0A1A3C] p-0.5 bg-[#0A1A3C]">
                <img src="/logo.png" alt="Fluxtur Logo" className="w-full h-full object-cover rounded-full" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-[#0A1A3C] tracking-wide">FLUXTUR VIAGENS & TURISMO</h1>
                <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-wider">
                  Proposta Comercial de Viagem Personalizada • Documento Oficial
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block bg-[#0A1A3C] text-white px-3 py-1 rounded text-xs font-mono font-black tracking-wider">
                {propostaCodigo}
              </div>
              <div className="text-[10px] text-slate-600 mt-1 space-y-0.5">
                <p>Emissão: <span className="font-bold text-slate-800">{formatSafeDate(orcamento.criadoEm)}</span></p>
                <p>Validade: <span className="font-bold text-slate-800">{formatSafeDate(orcamento.validade)}</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* RESUMO EXECUTIVO DA PROPOSTA (DADOS DO CLIENTE, VIAGEM E AGENTE) */}

        <section className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 print:p-4 print:border-slate-300 print-avoid-break">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-200 mb-1.5">
                Proposta Personalizada
              </span>
              <h2 className="text-xl md:text-2xl font-black text-[#0A1A3C]">{title}</h2>
              {orcamento.destinoCustomizado && (
                <p className="text-xs text-slate-600 mt-0.5 font-medium flex items-center gap-1">
                  <span>📍 Destino:</span>
                  <span className="font-bold text-[#0A1A3C]">{orcamento.destinoCustomizado}</span>
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-center min-w-[130px]">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Status da Cotação</span>
                <span className={`text-xs font-black uppercase tracking-wider ${
                  isApproved ? "text-emerald-700" : isExpired ? "text-rose-700" : "text-blue-700"
                }`}>
                  {isApproved ? "✓ Confirmada" : isExpired ? "Expirada" : "● Em Aberto"}
                </span>
              </div>
              <div className="bg-[#0A1A3C] text-white px-4 py-2.5 rounded-xl text-center min-w-[150px]">
                <span className="text-[10px] uppercase font-bold text-slate-300 block">Valor da Proposta</span>
                <span className="text-sm font-black text-[#38BDF8]">{formatCurrency(totalGeral)}</span>
              </div>
            </div>
          </div>

          {/* DADOS DETALHADOS EM GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 text-xs">
            <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80">
              <span className="text-slate-500 font-bold block text-[11px]">👤 Passageiro Titular / Cliente</span>
              <p className="font-black text-[#0A1A3C] text-sm mt-0.5 truncate">{orcamento.clienteNome}</p>
              <p className="text-[11px] text-slate-600 mt-0.5">{orcamento.clienteWhatsapp}</p>
              {orcamento.clienteEmail && (
                <p className="text-[11px] text-slate-500 truncate">{orcamento.clienteEmail}</p>
              )}
            </div>

            <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80">
              <span className="text-slate-500 font-bold block text-[11px]">👥 Passageiros da Viagem</span>
              <p className="font-black text-[#0A1A3C] text-sm mt-0.5">
                {totalAdultos} Adulto{totalAdultos > 1 ? "s" : ""}
                {totalCriancas > 0 ? ` • ${totalCriancas} Criança${totalCriancas > 1 ? "s" : ""}` : ""}
              </p>
              {totalCriancas > 0 && orcamento.idadesCriancas ? (
                <p className="text-[11px] text-slate-600 mt-0.5">Idades: {orcamento.idadesCriancas}</p>
              ) : (
                <p className="text-[11px] text-slate-500 mt-0.5">Viajando sem crianças</p>
              )}
            </div>

            <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80">
              <span className="text-slate-500 font-bold block text-[11px]">📅 Período & Duração</span>
              <p className="font-black text-[#0A1A3C] text-sm mt-0.5">
                {formatSafeDate(orcamento.checkInData, { day: "2-digit", month: "short" })} → {formatSafeDate(orcamento.checkOutData, { day: "2-digit", month: "short" })}
              </p>
              <p className="text-[11px] text-slate-600 mt-0.5 font-medium">
                {orcamento.quantidadeNoites || 6} noites de hospedagem
              </p>
            </div>

            <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80">
              <span className="text-slate-500 font-bold block text-[11px]">💼 Consultor Especialista</span>
              <p className="font-black text-[#0A1A3C] text-sm mt-0.5 truncate">
                {orcamento.agenteNome || "Gabriel Aguiar Cordeiro"}
              </p>
              <p className="text-[11px] text-slate-600 mt-0.5">
                {orcamento.agenteTelefone || WHATSAPP_EMPRESA_DISPLAY}
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                {orcamento.agenteEmail || "sp.gabriel@fluxtur.com.br"}
              </p>
            </div>
          </div>
        </section>

        {/* RESUMO DOS SERVIÇOS INCLUSOS NO PACOTE */}
        <section className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 print:p-4 print:border-slate-300 print-avoid-break">
          <h3 className="text-base font-black text-[#0A1A3C] flex items-center gap-2 mb-3">
            <span>✨</span> Serviços & Benefícios Inclusos nesta Proposta
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {/* AÉREO */}
            <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 font-black text-blue-900 text-sm">
                  <span>✈️</span> Passagens Aéreas
                </div>
                <p className="text-[11px] text-blue-800 mt-1">
                  Ida e volta inclusas com taxas de embarque e marcação conforme franquia.
                </p>
              </div>
              <span className="mt-2 inline-block text-[10px] font-black uppercase text-blue-700">✓ Incluso</span>
            </div>

            {/* HOSPEDAGEM */}
            <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 font-black text-emerald-900 text-sm">
                  <span>🏨</span> Hospedagem
                </div>
                <p className="text-[11px] text-emerald-800 mt-1 line-clamp-2">
                  {hotelNome} ({orcamento.quantidadeNoites || 6} noites)
                </p>
              </div>
              <span className="mt-2 inline-block text-[10px] font-black uppercase text-emerald-700">
                {orcamento.regimeAlimentacao || "All Inclusive"}
              </span>
            </div>

            {/* TRANSFER */}
            <div className={`p-3.5 rounded-xl border flex flex-col justify-between ${
              orcamento.incluiTransfer ? "border-sky-200 bg-sky-50/50" : "border-slate-200 bg-slate-50"
            }`}>
              <div>
                <div className="flex items-center gap-1.5 font-black text-slate-800 text-sm">
                  <span>🚗</span> Transfer Terrestre
                </div>
                <p className="text-[11px] text-slate-600 mt-1">
                  {orcamento.incluiTransfer
                    ? "Transporte Aeroporto ↔ Hotel ↔ Aeroporto incluso."
                    : "Transfer terrestre não incluso (opcional sob consulta)."}
                </p>
              </div>
              <span className={`mt-2 inline-block text-[10px] font-black uppercase ${
                orcamento.incluiTransfer ? "text-sky-700" : "text-slate-500"
              }`}>
                {orcamento.incluiTransfer ? "✓ Incluso" : "Não Incluso"}
              </span>
            </div>

            {/* SEGURO VIAGEM */}
            <div className={`p-3.5 rounded-xl border flex flex-col justify-between ${
              orcamento.incluiSeguro ? "border-purple-200 bg-purple-50/50" : "border-slate-200 bg-slate-50"
            }`}>
              <div>
                <div className="flex items-center gap-1.5 font-black text-slate-800 text-sm">
                  <span>🛡️</span> Seguro Viagem
                </div>
                <p className="text-[11px] text-slate-600 mt-1">
                  {orcamento.incluiSeguro
                    ? "Assistência médica hospitalar e bagagem durante toda a viagem."
                    : "Seguro viagem não incluso (recomendamos inclusão)."}
                </p>
              </div>
              <span className={`mt-2 inline-block text-[10px] font-black uppercase ${
                orcamento.incluiSeguro ? "text-purple-700" : "text-slate-500"
              }`}>
                {orcamento.incluiSeguro ? "✓ Incluso" : "Não Incluso"}
              </span>
            </div>
          </div>
        </section>

        {/* VOUCHER DE VIAGEM & CONFIRMAÇÃO (EXIBIDO QUANDO PROPOSTA ESTÁ APROVADA) */}
        {isApproved && (
          <section className="bg-gradient-to-r from-[#0A1A3C] via-[#0F275A] to-[#0A1A3C] text-white rounded-2xl p-6 md:p-8 shadow-xl border-2 border-[#38BDF8]/40 space-y-6 relative overflow-hidden print:bg-white print:text-black print:border-2 print:border-slate-800 print:p-5 print-avoid-break">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 print:border-slate-300 pb-5">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-widest print:bg-emerald-100 print:text-emerald-900 print:border-emerald-500">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 print:bg-emerald-600"></span>
                  Voucher de Viagem Confirmado
                </div>
                <h2 className="text-xl md:text-2xl font-black text-white print:text-slate-900">
                  Reserva Garantida para {orcamento.clienteNome}
                </h2>
                <p className="text-xs text-slate-300 print:text-slate-600">
                  Parabéns! Sua proposta foi confirmada com sucesso. Apresente este voucher digital no embarque e no check-in.
                </p>
              </div>

              <div className="bg-[#122A5C] px-5 py-3.5 rounded-xl border border-[#38BDF8]/30 flex flex-col items-center justify-center shrink-0 print:bg-slate-100 print:border-slate-400">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300 print:text-slate-600">Localizador / Voucher</span>
                <span className="text-lg md:text-xl font-mono font-black text-[#38BDF8] print:text-[#0A1A3C] tracking-widest mt-0.5">
                  {orcamento.codigoVoucher || propostaCodigo}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1 print:bg-slate-50 print:border-slate-300">
                <span className="text-slate-400 print:text-slate-600 block font-medium">🏨 Acomodação</span>
                <span className="font-bold text-white print:text-slate-900 text-sm block truncate">{hotelNome}</span>
                {enderecoHotel && (
                  <span className="text-[11px] text-slate-300 print:text-slate-600 line-clamp-1">{enderecoHotel}</span>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1 print:bg-slate-50 print:border-slate-300">
                <span className="text-slate-400 print:text-slate-600 block font-medium">🚪 Apto / Quarto Reservado</span>
                <span className="font-bold text-[#38BDF8] print:text-[#0A1A3C] text-sm block">
                  {orcamento.numeroQuarto ? `Quarto nº ${orcamento.numeroQuarto}` : "Definido no Check-in"}
                </span>
                <span className="text-[11px] text-slate-300 print:text-slate-600 truncate block">{orcamento.tipoQuarto || "Apartamento Standard"}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1 print:bg-slate-50 print:border-slate-300">
                <span className="text-slate-400 print:text-slate-600 block font-medium">📅 Check-in / Check-out</span>
                <span className="font-bold text-white print:text-slate-900 text-sm block">
                  {formatSafeDate(orcamento.checkInData, { day: "2-digit", month: "short" })} → {formatSafeDate(orcamento.checkOutData, { day: "2-digit", month: "short" })}
                </span>
                <span className="text-[11px] text-slate-300 print:text-slate-600 block">
                  {orcamento.quantidadeNoites || 6} noites • {orcamento.regimeAlimentacao || "All Inclusive"}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2 flex flex-col justify-between print:bg-slate-50 print:border-slate-300">
                <div>
                  <span className="text-slate-400 print:text-slate-600 block font-medium">📍 Navegação / Local</span>
                  <span className="text-[11px] text-slate-300 print:text-slate-600 line-clamp-1">{enderecoHotel || orcamento.destinoCustomizado || "Destino confirmado"}</span>
                </div>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="no-print inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-[#0A1A3C] font-bold text-xs transition-all shadow-xs"
                >
                  <span>🗺️</span>
                  <span>Ver no Google Maps</span>
                </a>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-900/40 border border-blue-400/20 text-xs text-slate-300 flex items-start gap-2.5 print:bg-slate-100 print:text-slate-700 print:border-slate-300">
              <span className="text-base">ℹ️</span>
              <div>
                <span className="font-bold text-white print:text-slate-900 block">Instruções de Apresentação:</span>
                <span>Apresente documento oficial com foto e informe seu código localizador na recepção. O suporte Fluxtur estará à sua disposição durante toda a estadia.</span>
              </div>
            </div>
          </section>
        )}
        
        {/* HOSPEDAGEM & FOTOS DA ACOMODAÇÃO */}
        <section className="bg-white rounded-2xl p-4 md:p-6 shadow-xs border border-slate-200 space-y-4 print:p-4 print:border-slate-300 print-avoid-break">
          
          {/* GALERIA DE FOTOS */}
          {galeriaList.length === 0 ? (
            <div className="relative w-full rounded-2xl overflow-hidden h-[200px] md:h-[260px] bg-gradient-to-br from-[#0A1A3C] via-[#0F275A] to-[#0A1A3C] border border-[#1E3A75] flex flex-col items-center justify-center p-6 text-center shadow-inner print:h-[120px] print:bg-slate-100">
              <div className="w-16 h-16 rounded-full p-2 bg-[#0A1128] border-2 border-[#38BDF8]/40 shadow-lg mb-3 flex items-center justify-center print:hidden">
                <img src="/logo.png" alt="Fluxtur Logo" className="w-full h-full object-contain rounded-full" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#38BDF8] print:text-[#0A1A3C] mb-1">
                Hospedagem Selecionada Fluxtur
              </span>
              <h2 className="text-xl md:text-2xl font-black text-white print:text-slate-900 max-w-xl">
                {hotelNome}
              </h2>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 rounded-2xl overflow-hidden h-[280px] md:h-[340px] print:h-[180px]">
              <div className="md:col-span-2 relative h-full group overflow-hidden">
                <img
                  src={galeriaList[0]}
                  alt={hotelNome}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-3 left-3 bg-[#0A1A3C]/80 backdrop-blur-xs text-[#38BDF8] px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider print:hidden">
                  HOTEL & ACOMODAÇÃO
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-1 gap-3 h-full">
                {galeriaList.slice(1, 3).map((imgUrl, index) => (
                  <div key={index} className="relative h-full overflow-hidden group">
                    <img
                      src={imgUrl}
                      alt={`${hotelNome} foto ${index + 2}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
                {galeriaList.length <= 1 && (
                  <div className="relative h-full bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center p-4 text-center">
                    <span className="text-xs text-slate-500 font-bold">Reserva confirmada no resort</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TÍTULO DA HOSPEDAGEM & BARRA DE ENDEREÇO */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-[#0A1A3C] flex items-center gap-2">
                <span>🏨 {hotelNome}</span>
              </h2>
              {enderecoHotel ? (
                <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5 font-medium">
                  <span className="text-blue-500">📍</span>
                  <span>{enderecoHotel}</span>
                </p>
              ) : orcamento.destinoCustomizado ? (
                <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5 font-medium">
                  <span className="text-blue-500">📍</span>
                  <span>{orcamento.destinoCustomizado}</span>
                </p>
              ) : null}
            </div>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="no-print inline-flex items-center gap-2 px-3.5 py-2 bg-[#0A1A3C] hover:bg-[#122A5C] text-white text-xs font-bold rounded-xl shadow-xs transition-all hover:scale-102 shrink-0 self-start md:self-auto cursor-pointer"
            >
              <span>🗺️</span>
              <span>Ver no Google Maps</span>
            </a>
          </div>

          {/* ABAS (VISÍVEIS APENAS EM TELA) */}
          <div className="no-print flex items-center gap-2 border-b border-slate-200 pb-3 pt-1">
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

          {/* CONTEÚDO DINÂMICO PARA TELA */}
          <div className="no-print">
            {activeTab === "visao-geral" && (
              <div className="space-y-4 pt-1">
                <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">📅</span>
                    <span>{formatSafeDate(orcamento.checkInData)} – {formatSafeDate(orcamento.checkOutData)}</span>
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
                      {totalAdultos} Adulto{totalAdultos > 1 ? "s" : ""}
                      {totalCriancas > 0 ? ` • ${totalCriancas} Criança${totalCriancas > 1 ? "s" : ""}` : ""}
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
                    <span className="uppercase text-slate-700">{orcamento.tipoQuarto || "Apartamento Standard Confort"}</span>
                  </div>
                  <div className="text-emerald-600 flex items-center gap-1">
                    <span>✓ {orcamento.politicaCancelamento || "Cancelamento gratuito conforme regulamento"}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "quarto" && (
              <div className="space-y-3 pt-1">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Categoria do Quarto</span>
                      <span className="text-sm font-black text-[#0A1A3C] uppercase">{orcamento.tipoQuarto || "Apartamento Standard Confort"}</span>
                    </div>
                    {orcamento.numeroQuarto ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-900 rounded-lg text-xs font-bold self-start">
                        <span>🚪</span>
                        <span>Quarto Reservado: Apt {orcamento.numeroQuarto}</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold self-start">
                        <span>🚪</span>
                        <span>Número atribuído no Check-in</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                      <span className="text-slate-500 block font-medium">Regime Incluso:</span>
                      <span className="font-bold text-[#0A1A3C] text-sm mt-0.5 block">🍹 {orcamento.regimeAlimentacao || "All Inclusive"}</span>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                      <span className="text-slate-500 block font-medium">Política de Cancelamento:</span>
                      <span className="font-bold text-emerald-600 text-xs mt-0.5 block">✓ {orcamento.politicaCancelamento || "Cancelamento grátis conforme regulamento"}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "localizacao" && (
              <div className="space-y-4 pt-1">
                <div className="p-5 bg-gradient-to-br from-slate-50 to-blue-50/40 rounded-xl border border-slate-200 space-y-4">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Endereço & Localização</span>
                    <p className="text-sm md:text-base font-bold text-[#0A1A3C] flex items-center gap-2">
                      <span className="text-red-500">📍</span>
                      <span>{enderecoHotel || `${hotelNome}, ${orcamento.destinoCustomizado || "Brasil"}`}</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* APRESENTAÇÃO COMPLETA PARA IMPRESSÃO / PDF (MOSTRA TODAS AS INFORMAÇÕES DE HOSPEDAGEM JUNTAS) */}
          <div className="print-only space-y-3 pt-2">
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-300">
                <span className="text-slate-500 font-bold block text-[10px] uppercase">Check-in / Check-out</span>
                <span className="font-black text-[#0A1A3C] block mt-0.5">
                  {formatSafeDate(orcamento.checkInData)} → {formatSafeDate(orcamento.checkOutData)}
                </span>
                <span className="text-[10px] text-slate-600">{orcamento.quantidadeNoites || 6} noites</span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-300">
                <span className="text-slate-500 font-bold block text-[10px] uppercase">Quarto Reservado</span>
                <span className="font-black text-[#0A1A3C] block mt-0.5 truncate">
                  {orcamento.tipoQuarto || "Apartamento Standard"}
                </span>
                <span className="text-[10px] text-slate-600">
                  {orcamento.numeroQuarto ? `Apto nº ${orcamento.numeroQuarto}` : "Atribuído no check-in"}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-300">
                <span className="text-slate-500 font-bold block text-[10px] uppercase">Regime de Alimentação</span>
                <span className="font-black text-emerald-700 block mt-0.5">
                  🍹 {orcamento.regimeAlimentacao || "All Inclusive"}
                </span>
                <span className="text-[10px] text-slate-600">Refeições e bebidas inclusas</span>
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-300 text-xs flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-700 block text-[10px] uppercase">Endereço da Hospedagem</span>
                <span className="text-slate-800">{enderecoHotel || `${hotelNome}, ${orcamento.destinoCustomizado || "Brasil"}`}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-700 block text-[10px] uppercase">Política de Cancelamento</span>
                <span className="text-emerald-700 font-bold">{orcamento.politicaCancelamento || "Cancelamento conforme regulamento"}</span>
              </div>
            </div>
          </div>
        </section>

        {/* CARD DE VOOS DETALHADOS (TRECHO POR TRECHO COM CONEXÕES) */}
        <section className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-6 print:p-4 print:border-slate-300 print-avoid-break">
          <h2 className="text-xl font-black text-[#0A1A3C] flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="text-xl">✈️</span> Itinerário Detalhado dos Voos
          </h2>

          {/* VOO DE IDA */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-bold text-slate-700 gap-1">
              <div className="flex items-center gap-2 text-[#0A1A3C] font-black text-sm">
                <span>🛫 VOO DE IDA</span>
              </div>
              <div className="flex items-center gap-4 text-slate-600">
                <span>📅 {dataVooIdaFormatada}</span>
                <span>
                  👥 {totalAdultos} Adulto{totalAdultos > 1 ? "s" : ""}
                  {totalCriancas > 0 ? ` | ${totalCriancas} Criança${totalCriancas > 1 ? "s" : ""}` : ""}
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 print:p-3 print:bg-white print:border-slate-300">
              {trechosIda.map((t, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200 print:border-slate-300">
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
                        {t.duracao && (
                          <span className="text-[9px] text-slate-500 font-semibold">{t.duracao}</span>
                        )}
                      </div>

                      <div className="text-center">
                        <span className="text-base font-black text-[#0A1A3C] block">{t.horarioChegada}</span>
                        <span className="text-[11px] font-bold text-slate-600">{t.destino}</span>
                      </div>
                    </div>
                  </div>

                  {/* CONEXÃO ENTRE TRECHOS */}
                  {t.tempoEspera && (
                    <div className="flex items-center justify-center gap-2 p-2 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold my-1 print:border-amber-400">
                      <span>⏱️ {t.tempoEspera}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <hr className="border-slate-100 print:border-slate-200" />

          {/* VOO DE VOLTA */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-bold text-slate-700 gap-1">
              <div className="flex items-center gap-2 text-[#0A1A3C] font-black text-sm">
                <span>🛬 VOO DE VOLTA</span>
              </div>
              <div className="flex items-center gap-4 text-slate-600">
                <span>📅 {dataVooVoltaFormatada}</span>
                <span>
                  👥 {totalAdultos} Adulto{totalAdultos > 1 ? "s" : ""}
                  {totalCriancas > 0 ? ` | ${totalCriancas} Criança${totalCriancas > 1 ? "s" : ""}` : ""}
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 print:p-3 print:bg-white print:border-slate-300">
              {trechosVolta.map((t, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200 print:border-slate-300">
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
                        {t.duracao && (
                          <span className="text-[9px] text-slate-500 font-semibold">{t.duracao}</span>
                        )}
                      </div>

                      <div className="text-center">
                        <span className="text-base font-black text-[#0A1A3C] block">{t.horarioChegada}</span>
                        <span className="text-[11px] font-bold text-slate-600">{t.destino}</span>
                      </div>
                    </div>
                  </div>

                  {/* CONEXÃO ENTRE TRECHOS */}
                  {t.tempoEspera && (
                    <div className="flex items-center justify-center gap-2 p-2 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold my-1 print:border-amber-400">
                      <span>⏱️ {t.tempoEspera}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* OBSERVAÇÕES DE VOO (SE HOUVER) */}
          {orcamento.observacoesVoo && (
            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-slate-700">
              <span className="font-bold text-[#0A1A3C] block mb-0.5">ℹ️ Observações do Voo:</span>
              <p>{orcamento.observacoesVoo}</p>
            </div>
          )}

          {/* CARD RESUMO DE VALORES */}
          <div className="p-4 bg-[#F5F7FB] rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4 print:bg-slate-50 print:border-slate-300">
            <h3 className="text-lg font-black text-[#0A1A3C] flex items-center gap-2">
              <span>💰 Resumo de Valores</span>
            </h3>

            <div className="flex flex-wrap items-center gap-6 text-xs font-bold">
              <div>
                <span className="text-slate-500 block">Produtos / Hospedagem / Aéreo:</span>
                <span className="text-[#0A1A3C] font-black text-sm">{formatCurrency(produtosVal)}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Taxas de Embarque & Serviço:</span>
                <span className="text-[#0A1A3C] font-black text-sm">{formatCurrency(taxasVal)}</span>
              </div>
              <div className="pl-4 border-l border-slate-300">
                <span className="text-slate-500 block">Total Geral da Proposta:</span>
                <span className="text-[#0A1A3C] font-black text-lg text-emerald-700">{formatCurrency(totalGeral)}</span>
              </div>
            </div>
          </div>
        </section>

        {/* SIMULAÇÃO DE PAGAMENTO & PARCELAMENTO */}
        <section className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-6 print:p-4 print:border-slate-300 print-avoid-break">
          <div className="text-center print:text-left">
            <h2 className="text-xl md:text-2xl font-black text-[#0A1A3C]">Condições & Formas de Pagamento</h2>
            <div className="w-16 h-1 bg-[#38BDF8] mx-auto mt-2 rounded-full print:hidden"></div>
          </div>

          {/* SELETOR DE BANDEIRA (APENAS EM TELA) */}
          <div className="no-print space-y-3">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
              💳 Simulação no Cartão de Crédito (Selecione a Bandeira):
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

          {/* TABELA DE PARCELAS */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 block">
              💳 Opções de Parcelamento no Cartão ({selectedCardBrand}):
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-3 gap-x-6 gap-y-1.5 p-4 bg-slate-50/70 rounded-2xl border border-slate-200 text-xs print:p-3 print:bg-white print:border-slate-300">
              {parcelas.map((p) => (
                <div key={p.num} className="flex items-center justify-between py-1.5 border-b border-slate-200/60 last:border-0 print:border-slate-200">
                  <span className="font-bold text-[#0A1A3C]">
                    {p.num}x <span className="font-semibold text-slate-700">{formatCurrency(p.valor)}</span>
                  </span>
                  <span className="font-bold text-slate-600 text-[11px]">
                    Total: <span className="text-blue-700 font-bold">{formatCurrency(p.total)}</span>
                    {p.comJuros && <span className="text-[9px] text-amber-700 font-bold ml-1">(c/ juros)</span>}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* PAGAMENTO À VISTA PIX */}
          <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 flex items-center justify-between print:border-emerald-300">
            <div className="flex items-center gap-2">
              <span className="text-xl">📱</span>
              <div>
                <span className="text-xs font-bold text-emerald-950 block">Pagamento à Vista via PIX ou Transferência Bancária</span>
                <span className="text-[10px] text-emerald-700">Confirmação imediata para emissão dos vouchers</span>
              </div>
            </div>
            <span className="text-xl md:text-2xl font-black text-emerald-700">{formatCurrency(totalGeral)}</span>
          </div>

          {/* OBSERVAÇÕES DE PAGAMENTO (SE HOUVER) */}
          {orcamento.observacoesPagamento && (
            <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-slate-700">
              <span className="font-bold text-[#0A1A3C] block mb-1">📝 Observações Financeiras & Condições Especiais:</span>
              <p className="whitespace-pre-line leading-relaxed">{orcamento.observacoesPagamento}</p>
            </div>
          )}
        </section>

        {/* OBSERVAÇÕES GERAIS DA PROPOSTA (SE INFORMADAS PELO AGENTE) */}
        {orcamento.observacoes && (
          <section className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-3 print:p-4 print:border-slate-300 print-avoid-break">
            <h3 className="text-base font-black text-[#0A1A3C] flex items-center gap-2">
              <span>📌</span> Observações Gerais da Proposta
            </h3>
            <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-xl text-xs text-slate-800 leading-relaxed whitespace-pre-line">
              {orcamento.observacoes}
            </div>
          </section>
        )}

        {/* INFORMAÇÕES IMPORTANTES & DIRETRIZES DE VIAGEM */}
        <section className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-3 print:p-4 print:border-slate-300 print-avoid-break">
          <h3 className="text-base font-black text-[#0A1A3C] flex items-center gap-2">
            <span>📋</span> Informações Importantes & Condições Gerais
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-600">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800 block">⏰ Validade da Cotação</span>
              <p>Tarifas e disponibilidades sujeitas a alteração sem aviso prévio. A reserva só é garantida após confirmação do pagamento.</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800 block">🛂 Documentos Obrigatórios</span>
              <p>RG original em perfeito estado (emitido há menos de 10 anos) ou Passaporte válido para todos os passageiros, incluindo crianças.</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800 block">🛫 Apresentação no Aeroporto</span>
              <p>Recomenda-se chegada com no mínimo 2 horas de antecedência para voos nacionais e 3 horas para voos internacionais.</p>
            </div>
          </div>
        </section>

        {/* INFORMAÇÕES DE CONTATO DO AGENTE E DA AGÊNCIA */}
        <section className="bg-white rounded-2xl p-6 md:p-8 shadow-xs border border-slate-200 print:p-4 print:border-slate-300 print-avoid-break">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="flex items-center space-x-4 border-r-0 md:border-r border-slate-200 pr-0 md:pr-6">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-slate-200 border-2 border-[#38BDF8] shrink-0 overflow-hidden flex items-center justify-center text-slate-400">
                {orcamento.agenteFotoUrl ? (
                  <img src={orcamento.agenteFotoUrl} alt={orcamento.agenteNome || "Agente"} className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Seu Consultor Dedicado</span>
                <h2 className="text-lg md:text-xl font-black text-[#0A1A3C]">
                  {orcamento.agenteNome || "Gabriel Aguiar Cordeiro"}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Fluxtur Viagens • Especialista em Experiências e Resorts
                </p>
                <div className="mt-2 text-xs text-slate-700 space-y-0.5">
                  <p>📞 {orcamento.agenteTelefone || WHATSAPP_EMPRESA_DISPLAY}</p>
                  <p>✉️ {orcamento.agenteEmail || "sp.gabriel@fluxtur.com.br"}</p>
                </div>
              </div>
            </div>

            {/* BOTÕES DE WHATSAPP (TELA) OU QR CODE (IMPRESSÃO) */}
            <div className="flex flex-col justify-center">
              <div className="no-print space-y-2">
                <span className="text-xs font-bold text-slate-700 block">Deseja tirar dúvidas ou solicitar ajustes?</span>
                <div className="flex flex-col sm:flex-row gap-2">
                  <a
                    href={buildWhatsappLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-3 border border-[#25D366] bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366] hover:text-white font-bold text-xs rounded-xl transition-all shadow-xs"
                  >
                    <span>💬</span>
                    <span>Falar com o Consultor</span>
                  </a>
                  <a
                    href={WHATSAPP_EMPRESA_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-3 bg-[#0A1A3C] hover:bg-[#122A5C] text-white font-bold text-xs rounded-xl transition-all shadow-xs"
                  >
                    <span>Central Oficial</span>
                  </a>
                </div>
              </div>

              {/* QR CODE EXCLUSIVO PARA O DOCUMENTO IMPRESSO / PDF */}
              <div className="print-only flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-300">
                <img src={qrCodeUrl} alt="QR Code da Proposta" className="w-20 h-20 border border-slate-300 rounded p-1 bg-white" />
                <div className="text-xs space-y-1">
                  <span className="font-bold text-[#0A1A3C] block text-[11px] uppercase">Acesse esta Proposta Online</span>
                  <p className="text-[10px] text-slate-600">
                    Aponte a câmera do celular para abrir a versão digital interativa com mapas, fotos e aprovação imediata.
                  </p>
                  <p className="text-[9px] font-mono text-blue-700 truncate">{currentUrl}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {approvedSuccess && (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-center space-y-2 print-avoid-break">
            <h4 className="text-xl font-black text-emerald-800">🎉 Proposta Aprovada com Sucesso!</h4>
            <p className="text-sm">Obrigado, {orcamento.clienteNome}! Nosso agente de viagens entrará em contato em breve para os vouchers.</p>
          </div>
        )}
      </main>

      {/* RODAPÉ INSTITUCIONAL DE IMPRESSÃO */}
      <footer className="print-only border-t border-slate-300 mt-6 pt-3 text-center text-[9px] text-slate-500">
        <p>Fluxtur Viagens e Turismo • CNPJ e Cadastur Regularizados • Atendimento: +55 (18) 99804-8355 • www.fluxtur.com.br</p>
        <p className="mt-0.5">Documento gerado digitalmente para {orcamento.clienteNome} • Código: {propostaCodigo}</p>
      </footer>

      {/* RODAPÉ FIXO DE AÇÃO (APENAS EM TELA) */}
      <div className="no-print fixed bottom-0 left-0 right-0 z-50 bg-[#0A1A3C]/95 backdrop-blur-md border-t border-[#122A5C] p-4 shadow-2xl">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="hidden sm:block text-white">
            <p className="text-xs text-slate-400">Total da Viagem:</p>
            <p className="text-2xl font-black text-[#38BDF8]">{formatCurrency(totalGeral)}</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleBaixarPdf}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center px-4 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-[#38BDF8] border border-[#38BDF8]/40 font-bold text-xs shadow-md transition-all gap-2 cursor-pointer hover:scale-102"
              title="Baixar a proposta em PDF com formatação completa"
            >
              <span>📥</span> Baixar PDF
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
                className="w-full text-xs p-3 border border-slate-300 rounded-xl outline-none focus:border-[#38BDF8]"
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

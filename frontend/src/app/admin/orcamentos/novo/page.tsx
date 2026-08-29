"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "@/services/api";

interface Hotel {
  id: string;
  nome: string;
  cidade: string;
  estrelas: number;
  fotoUrl?: string;
}

interface Pacote {
  id: string;
  titulo: string;
  destino: string;
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

interface CreatedOrcamento {
  id: string;
  token: string;
  clienteNome: string;
  clienteWhatsapp: string;
  valorTotal: number;
  tituloCustomizado?: string;
}

export default function NovoOrcamentoPage() {
  const router = useRouter();

  const [pacotes, setPacotes] = useState<Pacote[]>([]);
  const [hoteis, setHoteis] = useState<Hotel[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Cliente & Passageiros
  const [clienteNome, setClienteNome] = useState("");
  const [clienteEmail, setClienteEmail] = useState("");
  const [clienteWhatsapp, setClienteWhatsapp] = useState("");
  const [validadeDias, setValidadeDias] = useState("7");
  const [quantidadeAdultos, setQuantidadeAdultos] = useState("2");
  const [quantidadeCriancas, setQuantidadeCriancas] = useState("3");
  const [idadesCriancas, setIdadesCriancas] = useState("1, 2, 6 anos");

  // Base
  const [pacoteId, setPacoteId] = useState("");
  const [hotelId, setHotelId] = useState("");

  // Titulo / Destino
  const [tituloCustomizado, setTituloCustomizado] = useState("Férias em Recife Resort All Inclusive");
  const [destinoCustomizado, setDestinoCustomizado] = useState("Recife, Pernambuco");

  // Hospedagem Estruturada
  const [hotelNomeCustomizado, setHotelNomeCustomizado] = useState("Vila Galé Cabo Resort - All Inclusive");
  const [hotelFotoUrlCustomizada, setHotelFotoUrlCustomizada] = useState("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80");
  const [hotelGaleriaFotos, setHotelGaleriaFotos] = useState("");
  const [checkInData, setCheckInData] = useState("2026-11-21");
  const [checkInHorario, setCheckInHorario] = useState("15:00");
  const [checkOutData, setCheckOutData] = useState("2026-11-27");
  const [checkOutHorario, setCheckOutHorario] = useState("12:00");
  const [quantidadeNoites, setQuantidadeNoites] = useState("6");
  const [tipoQuarto, setTipoQuarto] = useState("APARTAMENTO FAMILIAR SUPERIOR MASTER");
  const [regimeAlimentacao, setRegimeAlimentacao] = useState("All Inclusive");
  const [politicaCancelamento, setPoliticaCancelamento] = useState("Cancelamento grátis até 5 de novembro de 2026");

  // VOO DE IDA - LISTA DINÂMICA DE TRECHOS / PARADAS
  const [possuiVooIda, setPossuiVooIda] = useState(true);
  const [trechosIda, setTrechosIda] = useState<TrechoVoo[]>([
    {
      origem: "PPB (Presidente Prudente)",
      destino: "GRU (Guarulhos)",
      companhia: "GOL 1234",
      horarioSaida: "08:00",
      horarioChegada: "09:15",
      duracao: "01h 15min",
      tempoEspera: "Conexão de 02h 15min em GRU",
    },
    {
      origem: "GRU (Guarulhos)",
      destino: "REC (Recife)",
      companhia: "GOL 5678",
      horarioSaida: "11:30",
      horarioChegada: "14:45",
      duracao: "03h 15min",
    },
  ]);

  // VOO DE VOLTA - LISTA DINÂMICA DE TRECHOS / PARADAS
  const [possuiVooVolta, setPossuiVooVolta] = useState(true);
  const [trechosVolta, setTrechosVolta] = useState<TrechoVoo[]>([
    {
      origem: "REC (Recife)",
      destino: "CGH (Congonhas)",
      companhia: "Latam 3210",
      horarioSaida: "12:50",
      horarioChegada: "16:00",
      duracao: "03h 10min",
      tempoEspera: "Conexão de 02h 00min em CGH",
    },
    {
      origem: "CGH (Congonhas)",
      destino: "PPB (Presidente Prudente)",
      companhia: "Latam 7890",
      horarioSaida: "18:00",
      horarioChegada: "19:20",
      duracao: "01h 20min",
    },
  ]);

  // Adicionais & Transfer
  const [incluiTransfer, setIncluiTransfer] = useState(true);
  const [incluiSeguro, setIncluiSeguro] = useState(true);
  const [observacoes, setObservacoes] = useState("");

  // Valores
  const [valorProdutos, setValorProdutos] = useState("16860.83");
  const [valorTaxas, setValorTaxas] = useState("451.69");
  const [valorTotal, setValorTotal] = useState("17312.52");

  // Agente Responsavel
  const [agenteNome, setAgenteNome] = useState("Gabriel Aguiar Cordeiro");
  const [agenteTelefone, setAgenteTelefone] = useState("(18) 98109-6649");
  const [agenteEmail, setAgenteEmail] = useState("sp.gabriel@fluxtur.com.br");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdOrcamento, setCreatedOrcamento] = useState<CreatedOrcamento | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const [pacotesData, hoteisData] = await Promise.all([
          apiRequest<Pacote[]>("/pacotes"),
          apiRequest<Hotel[]>("/hotels"),
        ]);
        setPacotes(pacotesData);
        setHoteis(hoteisData);
      } catch (err: any) {
        console.error("Erro ao carregar dados base:", err);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  // Handlers de Trechos do Voo de Ida
  const handleAddTrechoIda = () => {
    const last = trechosIda[trechosIda.length - 1];
    setTrechosIda([
      ...trechosIda,
      {
        origem: last ? last.destino : "",
        destino: "",
        companhia: last ? last.companhia : "Latam",
        horarioSaida: "12:00",
        horarioChegada: "14:00",
        duracao: "02h 00min",
      },
    ]);
  };

  const handleRemoveTrechoIda = (index: number) => {
    setTrechosIda(trechosIda.filter((_, i) => i !== index));
  };

  const handleUpdateTrechoIda = (index: number, field: keyof TrechoVoo, value: string) => {
    const copy = [...trechosIda];
    copy[index] = { ...copy[index], [field]: value };
    setTrechosIda(copy);
  };

  // Handlers de Trechos do Voo de Volta
  const handleAddTrechoVolta = () => {
    const last = trechosVolta[trechosVolta.length - 1];
    setTrechosVolta([
      ...trechosVolta,
      {
        origem: last ? last.destino : "",
        destino: "",
        companhia: last ? last.companhia : "Latam",
        horarioSaida: "12:00",
        horarioChegada: "14:00",
        duracao: "02h 00min",
      },
    ]);
  };

  const handleRemoveTrechoVolta = (index: number) => {
    setTrechosVolta(trechosVolta.filter((_, i) => i !== index));
  };

  const handleUpdateTrechoVolta = (index: number, field: keyof TrechoVoo, value: string) => {
    const copy = [...trechosVolta];
    copy[index] = { ...copy[index], [field]: value };
    setTrechosVolta(copy);
  };

  const handleProdutosTaxasChange = (prod: string, tax: string) => {
    setValorProdutos(prod);
    setValorTaxas(tax);
    const p = parseFloat(prod) || 0;
    const t = parseFloat(tax) || 0;
    setValorTotal((p + t).toFixed(2));
  };

  const formatWhatsappPhone = (value: string) => {
    const raw = value.replace(/\D/g, "").slice(0, 11);
    if (!raw) return "";
    if (raw.length <= 2) return `(${raw}`;
    if (raw.length <= 7) return `(${raw.slice(0, 2)}) ${raw.slice(2)}`;
    return `(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7, 11)}`;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!clienteNome.trim()) {
      setError("Por favor, informe o nome do cliente.");
      return;
    }

    if (!clienteWhatsapp.trim()) {
      setError("Por favor, informe o WhatsApp do cliente.");
      return;
    }

    const prod = parseFloat(valorProdutos) || 0;
    const tax = parseFloat(valorTaxas) || 0;
    const tot = parseFloat(valorTotal) || (prod + tax);

    try {
      setSubmitting(true);
      const isCustomHotel = hotelId === "custom" || !hotelId;

      // Resumo de voo de ida
      const emIdaFirst = trechosIda[0];
      const emIdaLast = trechosIda[trechosIda.length - 1];

      // Resumo de voo de volta
      const emVoltaFirst = trechosVolta[0];
      const emVoltaLast = trechosVolta[trechosVolta.length - 1];

      const payload = {
        clienteNome: clienteNome.trim(),
        clienteEmail: clienteEmail.trim() || undefined,
        clienteWhatsapp: clienteWhatsapp.trim(),
        validadeDias: parseInt(validadeDias, 10) || 7,

        valorProdutos: prod,
        valorTaxas: tax,
        valorTotal: tot,

        pacoteId: pacoteId || undefined,
        hotelId: isCustomHotel ? undefined : hotelId,

        tituloCustomizado: tituloCustomizado.trim() || undefined,
        destinoCustomizado: destinoCustomizado.trim() || undefined,

        // Passageiros
        quantidadeAdultos: parseInt(quantidadeAdultos, 10) || 2,
        quantidadeCriancas: parseInt(quantidadeCriancas, 10) || 0,
        idadesCriancas: idadesCriancas.trim() || undefined,

        // Hospedagem
        hotelNomeCustomizado: hotelNomeCustomizado.trim() || undefined,
        hotelFotoUrlCustomizada: hotelFotoUrlCustomizada.trim() || undefined,
        hotelGaleriaFotos: hotelGaleriaFotos.trim() || undefined,
        checkInData: checkInData || undefined,
        checkInHorario: checkInHorario.trim() || undefined,
        checkOutData: checkOutData || undefined,
        checkOutHorario: checkOutHorario.trim() || undefined,
        quantidadeNoites: parseInt(quantidadeNoites, 10) || 0,
        tipoQuarto: tipoQuarto.trim() || undefined,
        regimeAlimentacao: regimeAlimentacao.trim() || undefined,
        politicaCancelamento: politicaCancelamento.trim() || undefined,

        // Voo Ida Resumo & JSON Trechos
        vooIdaCompanhia: possuiVooIda && emIdaFirst ? emIdaFirst.companhia : undefined,
        vooIdaOrigem: possuiVooIda && emIdaFirst ? emIdaFirst.origem : undefined,
        vooIdaDestino: possuiVooIda && emIdaLast ? emIdaLast.destino : undefined,
        vooIdaHorarioSaida: possuiVooIda && emIdaFirst ? emIdaFirst.horarioSaida : undefined,
        vooIdaHorarioChegada: possuiVooIda && emIdaLast ? emIdaLast.horarioChegada : undefined,
        vooIdaDuracao: possuiVooIda ? "Calculado" : undefined,
        vooIdaParadas: possuiVooIda ? Math.max(0, trechosIda.length - 1) : 0,
        vooIdaTrechosJson: possuiVooIda ? JSON.stringify(trechosIda) : undefined,

        // Voo Volta Resumo & JSON Trechos
        vooVoltaCompanhia: possuiVooVolta && emVoltaFirst ? emVoltaFirst.companhia : undefined,
        vooVoltaOrigem: possuiVooVolta && emVoltaFirst ? emVoltaFirst.origem : undefined,
        vooVoltaDestino: possuiVooVolta && emVoltaLast ? emVoltaLast.destino : undefined,
        vooVoltaHorarioSaida: possuiVooVolta && emVoltaFirst ? emVoltaFirst.horarioSaida : undefined,
        vooVoltaHorarioChegada: possuiVooVolta && emVoltaLast ? emVoltaLast.horarioChegada : undefined,
        vooVoltaDuracao: possuiVooVolta ? "Calculado" : undefined,
        vooVoltaParadas: possuiVooVolta ? Math.max(0, trechosVolta.length - 1) : 0,
        vooVoltaTrechosJson: possuiVooVolta ? JSON.stringify(trechosVolta) : undefined,

        incluiTransfer,
        incluiSeguro,
        observacoes: observacoes.trim() || undefined,

        // Agente
        agenteNome: agenteNome.trim() || undefined,
        agenteTelefone: agenteTelefone.trim() || undefined,
        agenteEmail: agenteEmail.trim() || undefined,
      };

      const result = await apiRequest<CreatedOrcamento>("/orcamentos", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setCreatedOrcamento(result);
    } catch (err: any) {
      setError(err.message || "Erro ao criar proposta digital.");
    } finally {
      setSubmitting(false);
    }
  };

  const getPublicUrl = () => {
    if (!createdOrcamento) return "";
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    return `${origin}/proposta/${createdOrcamento.token}`;
  };

  const handleCopyLink = () => {
    const url = getPublicUrl();
    navigator.clipboard.writeText(url);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 3000);
  };

  const buildWhatsappSendLink = () => {
    if (!createdOrcamento) return "#";
    const phone = createdOrcamento.clienteWhatsapp.replace(/\D/g, "");
    const title = createdOrcamento.tituloCustomizado || "Proposta de Viagem Interativa";
    const url = getPublicUrl();
    const message = `Olá *${createdOrcamento.clienteNome}*! Tudo bem?\n\nElaborei uma proposta personalizada de viagem para você: *${title}*.\n\nConfira todos os detalhes, fotos da acomodação, escalas de voo e simulação de pagamento no link exclusivo abaixo:\n👉 ${url}\n\nQualquer dúvida estou à disposição!`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* HEADER DA PÁGINA */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin/orcamentos" className="text-slate-400 hover:text-[#0A1A3C] transition-colors text-xs font-bold">
              ← Orçamentos
            </Link>
            <span className="text-slate-300">/</span>
            <h1 className="text-xl font-black text-[#0A1A3C]">Criar Proposta Digital Interativa</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Cadastre os trecho por trecho com trocas de origem/destino para voos com escalas.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 text-xs font-bold rounded-2xl border border-red-200">
          {error}
        </div>
      )}

      {createdOrcamento ? (
        /* CARD DE SUCESSO */
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-emerald-200 text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block mb-1">
              Proposta Gerada com Sucesso!
            </span>
            <h2 className="text-2xl font-black text-[#0A1A3C]">
              Link Exclusivo para {createdOrcamento.clienteNome}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Token público: <span className="font-mono font-bold text-[#0A1A3C]">{createdOrcamento.token}</span>
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <input
              type="text"
              readOnly
              value={getPublicUrl()}
              className="w-full text-xs font-mono text-slate-700 bg-white border border-slate-300 rounded-lg p-2.5 outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="px-4 py-2.5 bg-[#0A1A3C] text-white text-xs font-bold rounded-lg hover:bg-[#122A5C] transition-all shrink-0 cursor-pointer"
            >
              {linkCopied ? "Link Copiado!" : "Copiar Link"}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href={buildWhatsappSendLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              Enviar pelo WhatsApp
            </a>

            <a
              href={`/proposta/${createdOrcamento.token}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all"
            >
              Visualizar Proposta
            </a>
          </div>
        </div>
      ) : (
        /* FORMULÁRIO DE ORÇAMENTO */
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 md:p-8 shadow-xs border border-slate-200 space-y-8">
          
          {/* SEÇÃO 1: CLIENTE E PASSAGEIROS */}
          <div className="space-y-4">
            <h2 className="text-base font-black text-[#0A1A3C] border-b border-slate-100 pb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#0A1A3C] text-[#38BDF8] text-xs font-bold flex items-center justify-center">1</span>
              Cliente & Passageiros
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nome do Cliente *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: João da Silva"
                  value={clienteNome}
                  onChange={(e) => setClienteNome(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#38BDF8] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp com DDD *</label>
                <input
                  type="text"
                  required
                  maxLength={15}
                  placeholder="(11) 99999-9999"
                  value={clienteWhatsapp}
                  onChange={(e) => setClienteWhatsapp(formatWhatsappPhone(e.target.value))}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#38BDF8] outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">E-mail do Cliente</label>
                <input
                  type="email"
                  placeholder="cliente@email.com"
                  value={clienteEmail}
                  onChange={(e) => setClienteEmail(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#38BDF8] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Qtd. de Adultos</label>
                <input
                  type="number"
                  min="1"
                  value={quantidadeAdultos}
                  onChange={(e) => setQuantidadeAdultos(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#38BDF8] outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Qtd. de Crianças</label>
                <input
                  type="number"
                  min="0"
                  value={quantidadeCriancas}
                  onChange={(e) => setQuantidadeCriancas(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#38BDF8] outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Idades das Crianças (ex: 1, 2, 6 anos)</label>
                <input
                  type="text"
                  placeholder="Ex: 1, 2 e 6 anos"
                  value={idadesCriancas}
                  onChange={(e) => setIdadesCriancas(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#38BDF8] outline-none"
                />
              </div>
            </div>
          </div>

          {/* SEÇÃO 2: HOSPEDAGEM */}
          <div className="space-y-4">
            <h2 className="text-base font-black text-[#0A1A3C] border-b border-slate-100 pb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#0A1A3C] text-[#38BDF8] text-xs font-bold flex items-center justify-center">2</span>
              Detalhes da Hospedagem
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nome do Hotel / Resort</label>
                <input
                  type="text"
                  placeholder="Ex: Vila Galé Cabo Resort - All Inclusive"
                  value={hotelNomeCustomizado}
                  onChange={(e) => setHotelNomeCustomizado(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#0A1A3C] focus:ring-2 focus:ring-[#38BDF8] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">URL da Foto Principal</label>
                <input
                  type="url"
                  placeholder="https://imagens.com/hotel.jpg"
                  value={hotelFotoUrlCustomizada}
                  onChange={(e) => setHotelFotoUrlCustomizada(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#38BDF8] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Data Check-in</label>
                <input
                  type="date"
                  value={checkInData}
                  onChange={(e) => setCheckInData(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Data Check-out</label>
                <input
                  type="date"
                  value={checkOutData}
                  onChange={(e) => setCheckOutData(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Categoria do Quarto</label>
                <input
                  type="text"
                  value={tipoQuarto}
                  onChange={(e) => setTipoQuarto(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Regime de Alimentação</label>
                <select
                  value={regimeAlimentacao}
                  onChange={(e) => setRegimeAlimentacao(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none font-bold"
                >
                  <option value="All Inclusive">🍹 All Inclusive</option>
                  <option value="Café da Manhã">☕ Café da Manhã</option>
                  <option value="Meia Pensão">🍽️ Meia Pensão</option>
                  <option value="Pensão Completa">🍲 Pensão Completa</option>
                  <option value="Sem Alimentação">🏨 Sem Alimentação</option>
                </select>
              </div>
            </div>
          </div>

          {/* SEÇÃO 3: VOOS COM TRECHOS E ESCALAS DINÂMICAS */}
          <div className="space-y-6">
            <h2 className="text-base font-black text-[#0A1A3C] border-b border-slate-100 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#0A1A3C] text-[#38BDF8] text-xs font-bold flex items-center justify-center">3</span>
                Voos & Escalas Detalhadas (Trecho por Trecho)
              </div>
            </h2>

            {/* VOO DE IDA */}
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-4">
              <div className="flex items-center justify-between border-b border-blue-200/60 pb-3">
                <span className="text-xs font-black uppercase tracking-wider text-[#0A1A3C]">
                  ✈️ VOO DE IDA ({trechosIda.length} {trechosIda.length === 1 ? "Trecho / Voo Direto" : "Trechos com Escala"})
                </span>
                <button
                  type="button"
                  onClick={handleAddTrechoIda}
                  className="px-3 py-1.5 bg-[#0A1A3C] text-[#38BDF8] text-xs font-bold rounded-lg hover:bg-[#122A5C] cursor-pointer"
                >
                  + Adicionar Conexão / Escala
                </button>
              </div>

              {trechosIda.map((t, idx) => (
                <div key={idx} className="p-4 bg-white rounded-xl border border-slate-200 space-y-3 relative shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0A1A3C] bg-blue-100 px-2.5 py-0.5 rounded">
                      Trecho {idx + 1}
                    </span>
                    {trechosIda.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTrechoIda(idx)}
                        className="text-xs text-rose-600 font-bold hover:underline cursor-pointer"
                      >
                        🗑️ Remover Trecho
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Origem do Trecho</label>
                      <input
                        type="text"
                        placeholder="Ex: PPB (Presidente Prudente)"
                        value={t.origem}
                        onChange={(e) => handleUpdateTrechoIda(idx, "origem", e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#0A1A3C] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Destino do Trecho</label>
                      <input
                        type="text"
                        placeholder="Ex: GRU (Guarulhos)"
                        value={t.destino}
                        onChange={(e) => handleUpdateTrechoIda(idx, "destino", e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#0A1A3C] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Companhia & Voo</label>
                      <input
                        type="text"
                        placeholder="Ex: GOL 1234"
                        value={t.companhia}
                        onChange={(e) => handleUpdateTrechoIda(idx, "companhia", e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Horário Saída ➔ Chegada</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="08:00"
                          value={t.horarioSaida}
                          onChange={(e) => handleUpdateTrechoIda(idx, "horarioSaida", e.target.value)}
                          className="w-1/2 p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold outline-none"
                        />
                        <input
                          type="text"
                          placeholder="09:15"
                          value={t.horarioChegada}
                          onChange={(e) => handleUpdateTrechoIda(idx, "horarioChegada", e.target.value)}
                          className="w-1/2 p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {idx < trechosIda.length - 1 && (
                    <div>
                      <label className="block text-[11px] font-bold text-blue-700 mb-1">Conexão / Tempo de Espera neste aeroporto</label>
                      <input
                        type="text"
                        placeholder="Ex: Conexão de 02h 15min em GRU"
                        value={t.tempoEspera || ""}
                        onChange={(e) => handleUpdateTrechoIda(idx, "tempoEspera", e.target.value)}
                        className="w-full p-2 bg-blue-50 border border-blue-200 rounded-lg text-xs font-bold text-blue-900 outline-none"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* VOO DE VOLTA */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-xs font-black uppercase tracking-wider text-[#0A1A3C]">
                  🛬 VOO DE VOLTA ({trechosVolta.length} {trechosVolta.length === 1 ? "Trecho / Voo Direto" : "Trechos com Escala"})
                </span>
                <button
                  type="button"
                  onClick={handleAddTrechoVolta}
                  className="px-3 py-1.5 bg-[#0A1A3C] text-[#38BDF8] text-xs font-bold rounded-lg hover:bg-[#122A5C] cursor-pointer"
                >
                  + Adicionar Conexão / Escala
                </button>
              </div>

              {trechosVolta.map((t, idx) => (
                <div key={idx} className="p-4 bg-white rounded-xl border border-slate-200 space-y-3 relative shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0A1A3C] bg-slate-100 px-2.5 py-0.5 rounded">
                      Trecho {idx + 1}
                    </span>
                    {trechosVolta.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTrechoVolta(idx)}
                        className="text-xs text-rose-600 font-bold hover:underline cursor-pointer"
                      >
                        🗑️ Remover Trecho
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Origem do Trecho</label>
                      <input
                        type="text"
                        placeholder="Ex: REC (Recife)"
                        value={t.origem}
                        onChange={(e) => handleUpdateTrechoVolta(idx, "origem", e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#0A1A3C] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Destino do Trecho</label>
                      <input
                        type="text"
                        placeholder="Ex: CGH (Congonhas)"
                        value={t.destino}
                        onChange={(e) => handleUpdateTrechoVolta(idx, "destino", e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#0A1A3C] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Companhia & Voo</label>
                      <input
                        type="text"
                        placeholder="Ex: Latam 3210"
                        value={t.companhia}
                        onChange={(e) => handleUpdateTrechoVolta(idx, "companhia", e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Horário Saída ➔ Chegada</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="12:50"
                          value={t.horarioSaida}
                          onChange={(e) => handleUpdateTrechoVolta(idx, "horarioSaida", e.target.value)}
                          className="w-1/2 p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold outline-none"
                        />
                        <input
                          type="text"
                          placeholder="16:00"
                          value={t.horarioChegada}
                          onChange={(e) => handleUpdateTrechoVolta(idx, "horarioChegada", e.target.value)}
                          className="w-1/2 p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {idx < trechosVolta.length - 1 && (
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Conexão / Tempo de Espera neste aeroporto</label>
                      <input
                        type="text"
                        placeholder="Ex: Conexão de 02h 00min em CGH"
                        value={t.tempoEspera || ""}
                        onChange={(e) => handleUpdateTrechoVolta(idx, "tempoEspera", e.target.value)}
                        className="w-full p-2 bg-slate-100 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 outline-none"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* SEÇÃO 4: VALORES */}
          <div className="space-y-4">
            <h2 className="text-base font-black text-[#0A1A3C] border-b border-slate-100 pb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#0A1A3C] text-[#38BDF8] text-xs font-bold flex items-center justify-center">4</span>
              Resumo de Valores & Simulação
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subtotal Produtos (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={valorProdutos}
                  onChange={(e) => handleProdutosTaxasChange(e.target.value, valorTaxas)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Taxas (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={valorTaxas}
                  onChange={(e) => handleProdutosTaxasChange(valorProdutos, e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Valor Total (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={valorTotal}
                  onChange={(e) => setValorTotal(e.target.value)}
                  className="w-full p-3 bg-[#0A1A3C] text-[#38BDF8] font-black text-sm border border-[#122A5C] rounded-xl outline-none"
                />
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-100">
            <Link
              href="/admin/orcamentos"
              className="px-5 py-3 text-xs font-bold text-slate-600 hover:text-slate-900"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3.5 bg-[#0A1A3C] hover:bg-[#122A5C] text-white text-xs font-bold rounded-xl shadow-lg cursor-pointer flex items-center gap-2"
            >
              {submitting && <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
              Gerar Proposta Digital Exclusiva
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

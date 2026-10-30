"use client";

import { useEffect, useState, FormEvent, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "@/services/api";

export interface TrechoVoo {
  origem: string;
  destino: string;
  companhia: string;
  horarioSaida: string;
  horarioChegada: string;
  duracao?: string;
  tempoEspera?: string;
}

interface OrcamentoFull {
  id: string;
  token: string;
  clienteNome: string;
  clienteEmail?: string;
  clienteWhatsapp: string;
  validade: string;
  status: string;

  valorTotal: number;
  valorProdutos: number;
  valorTaxas: number;

  observacoes?: string;

  quantidadeAdultos: number;
  quantidadeCriancas: number;
  idadesCriancas?: string;

  hotelNomeCustomizado?: string;
  hotelEnderecoCustomizado?: string;
  hotelFotoUrlCustomizada?: string;
  hotelGaleriaFotos?: string;
  checkInData?: string;
  checkInHorario?: string;
  checkOutData?: string;
  checkOutHorario?: string;
  quantidadeNoites?: number;
  tipoQuarto?: string;
  numeroQuarto?: string;
  codigoVoucher?: string;
  regimeAlimentacao?: string;
  politicaCancelamento?: string;

  vooIdaCompanhia?: string;
  vooIdaOrigem?: string;
  vooIdaDestino?: string;
  vooIdaHorarioSaida?: string;
  vooIdaHorarioChegada?: string;
  vooIdaTrechosJson?: string;

  vooVoltaCompanhia?: string;
  vooVoltaOrigem?: string;
  vooVoltaDestino?: string;
  vooVoltaHorarioSaida?: string;
  vooVoltaHorarioChegada?: string;
  vooVoltaTrechosJson?: string;

  incluiTransfer: boolean;
  incluiSeguro: boolean;

  agenteNome?: string;
  agenteTelefone?: string;
  agenteEmail?: string;
}

export default function EditarOrcamentoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");
  const [status, setStatus] = useState("Pendente");

  // Cliente & Passageiros
  const [clienteNome, setClienteNome] = useState("");
  const [clienteEmail, setClienteEmail] = useState("");
  const [clienteWhatsapp, setClienteWhatsapp] = useState("");
  const [quantidadeAdultos, setQuantidadeAdultos] = useState("2");
  const [quantidadeCriancas, setQuantidadeCriancas] = useState("3");
  const [idadesCriancas, setIdadesCriancas] = useState("1, 2, 6 anos");

  // Hospedagem
  const [hotelNomeCustomizado, setHotelNomeCustomizado] = useState("");
  const [hotelEnderecoCustomizado, setHotelEnderecoCustomizado] = useState("");
  const [hotelFotoUrlCustomizada, setHotelFotoUrlCustomizada] = useState("");
  const [hotelGaleriaFotos, setHotelGaleriaFotos] = useState("");
  const [checkInData, setCheckInData] = useState("");
  const [checkInHorario, setCheckInHorario] = useState("14:00");
  const [checkOutData, setCheckOutData] = useState("");
  const [checkOutHorario, setCheckOutHorario] = useState("12:00");
  const [quantidadeNoites, setQuantidadeNoites] = useState("");
  const [tipoQuarto, setTipoQuarto] = useState("");
  const [numeroQuarto, setNumeroQuarto] = useState("");
  const [codigoVoucher, setCodigoVoucher] = useState("");
  const [regimeAlimentacao, setRegimeAlimentacao] = useState("All Inclusive");
  const [politicaCancelamento, setPoliticaCancelamento] = useState("");

  // Voos Dinamicos (Trechos)
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

  // Valores & Adicionais
  const [valorProdutos, setValorProdutos] = useState("16860.83");
  const [valorTaxas, setValorTaxas] = useState("451.69");
  const [valorTotal, setValorTotal] = useState("17312.52");
  const [incluiTransfer, setIncluiTransfer] = useState(true);
  const [incluiSeguro, setIncluiSeguro] = useState(true);
  const [observacoes, setObservacoes] = useState("");

  const [agenteNome, setAgenteNome] = useState("Gabriel Aguiar Cordeiro");
  const [agenteTelefone, setAgenteTelefone] = useState("(18) 99804-8355");
  const [agenteEmail, setAgenteEmail] = useState("sp.gabriel@fluxtur.com.br");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const orcData = await apiRequest<OrcamentoFull>(`/orcamentos/${id}`);

        setToken(orcData.token);
        setStatus(orcData.status || "Pendente");
        setClienteNome(orcData.clienteNome || "");
        setClienteEmail(orcData.clienteEmail || "");
        setClienteWhatsapp(orcData.clienteWhatsapp || "");

        setQuantidadeAdultos((orcData.quantidadeAdultos || 2).toString());
        setQuantidadeCriancas((orcData.quantidadeCriancas || 3).toString());
        setIdadesCriancas(orcData.idadesCriancas || "1, 2, 6 anos");

        setHotelNomeCustomizado(orcData.hotelNomeCustomizado || "");
        setHotelEnderecoCustomizado(orcData.hotelEnderecoCustomizado || "");
        setHotelFotoUrlCustomizada(orcData.hotelFotoUrlCustomizada || "");
        setHotelGaleriaFotos(orcData.hotelGaleriaFotos || "");

        if (orcData.checkInData) setCheckInData(orcData.checkInData.split("T")[0]);
        setCheckInHorario(orcData.checkInHorario || "14:00");
        if (orcData.checkOutData) setCheckOutData(orcData.checkOutData.split("T")[0]);
        setCheckOutHorario(orcData.checkOutHorario || "12:00");
        setQuantidadeNoites((orcData.quantidadeNoites || "").toString());
        setTipoQuarto(orcData.tipoQuarto || "");
        setNumeroQuarto(orcData.numeroQuarto || "");
        setCodigoVoucher(orcData.codigoVoucher || "");
        setRegimeAlimentacao(orcData.regimeAlimentacao || "All Inclusive");
        setPoliticaCancelamento(orcData.politicaCancelamento || "");

        // Carregar trechos JSON se existirem
        if (orcData.vooIdaTrechosJson) {
          try {
            const parsed = JSON.parse(orcData.vooIdaTrechosJson);
            if (Array.isArray(parsed) && parsed.length > 0) setTrechosIda(parsed);
          } catch {}
        }

        if (orcData.vooVoltaTrechosJson) {
          try {
            const parsed = JSON.parse(orcData.vooVoltaTrechosJson);
            if (Array.isArray(parsed) && parsed.length > 0) setTrechosVolta(parsed);
          } catch {}
        }

        setValorProdutos((orcData.valorProdutos || 16860.83).toString());
        setValorTaxas((orcData.valorTaxas || 451.69).toString());
        setValorTotal((orcData.valorTotal || 17312.52).toString());

        setIncluiTransfer(orcData.incluiTransfer ?? true);
        setIncluiSeguro(orcData.incluiSeguro ?? true);
        setObservacoes(orcData.observacoes || "");

        setAgenteNome(orcData.agenteNome || "Gabriel Aguiar Cordeiro");
        setAgenteTelefone(orcData.agenteTelefone || "(18) 99804-8355");
        setAgenteEmail(orcData.agenteEmail || "sp.gabriel@fluxtur.com.br");
      } catch (err: any) {
        setError(err.message || "Erro ao carregar proposta.");
      } finally {
        setLoading(false);
      }
    };

    if (id) loadData();
  }, [id]);

  // Handlers de Trechos
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      setSubmitting(true);
      const prod = parseFloat(valorProdutos) || 0;
      const tax = parseFloat(valorTaxas) || 0;
      const tot = parseFloat(valorTotal) || (prod + tax);

      const emIdaFirst = trechosIda[0];
      const emIdaLast = trechosIda[trechosIda.length - 1];

      const emVoltaFirst = trechosVolta[0];
      const emVoltaLast = trechosVolta[trechosVolta.length - 1];

      const payload = {
        status,
        clienteNome: clienteNome.trim(),
        clienteEmail: clienteEmail.trim() || null,
        clienteWhatsapp: clienteWhatsapp.trim(),

        valorProdutos: prod,
        valorTaxas: tax,
        valorTotal: tot,

        quantidadeAdultos: parseInt(quantidadeAdultos, 10) || 2,
        quantidadeCriancas: parseInt(quantidadeCriancas, 10) || 0,
        idadesCriancas: idadesCriancas.trim() || null,

        hotelNomeCustomizado: hotelNomeCustomizado.trim() || null,
        hotelEnderecoCustomizado: hotelEnderecoCustomizado.trim() || null,
        hotelFotoUrlCustomizada: hotelFotoUrlCustomizada.trim() || null,
        hotelGaleriaFotos: hotelGaleriaFotos.trim() || null,
        checkInData: checkInData || null,
        checkInHorario: checkInHorario.trim() || null,
        checkOutData: checkOutData || null,
        checkOutHorario: checkOutHorario.trim() || null,
        quantidadeNoites: parseInt(quantidadeNoites, 10) || 0,
        tipoQuarto: tipoQuarto.trim() || null,
        numeroQuarto: numeroQuarto.trim() || null,
        codigoVoucher: codigoVoucher.trim() || null,
        regimeAlimentacao: regimeAlimentacao.trim() || null,
        politicaCancelamento: politicaCancelamento.trim() || null,

        vooIdaCompanhia: emIdaFirst ? emIdaFirst.companhia : null,
        vooIdaOrigem: emIdaFirst ? emIdaFirst.origem : null,
        vooIdaDestino: emIdaLast ? emIdaLast.destino : null,
        vooIdaHorarioSaida: emIdaFirst ? emIdaFirst.horarioSaida : null,
        vooIdaHorarioChegada: emIdaLast ? emIdaLast.horarioChegada : null,
        vooIdaParadas: Math.max(0, trechosIda.length - 1),
        vooIdaTrechosJson: JSON.stringify(trechosIda),

        vooVoltaCompanhia: emVoltaFirst ? emVoltaFirst.companhia : null,
        vooVoltaOrigem: emVoltaFirst ? emVoltaFirst.origem : null,
        vooVoltaDestino: emVoltaLast ? emVoltaLast.destino : null,
        vooVoltaHorarioSaida: emVoltaFirst ? emVoltaFirst.horarioSaida : null,
        vooVoltaHorarioChegada: emVoltaLast ? emVoltaLast.horarioChegada : null,
        vooVoltaParadas: Math.max(0, trechosVolta.length - 1),
        vooVoltaTrechosJson: JSON.stringify(trechosVolta),

        incluiTransfer,
        incluiSeguro,
        observacoes: observacoes.trim() || null,

        agenteNome: agenteNome.trim() || null,
        agenteTelefone: agenteTelefone.trim() || null,
        agenteEmail: agenteEmail.trim() || null,
      };

      await apiRequest(`/orcamentos/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar proposta.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
        <div className="w-8 h-8 border-4 border-[#38BDF8] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs font-bold text-[#0A1A3C]">Carregando dados da proposta...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin/orcamentos" className="text-slate-400 hover:text-[#0A1A3C] transition-colors text-xs font-bold">
              ← Orçamentos
            </Link>
            <span className="text-slate-300">/</span>
            <h1 className="text-xl font-black text-[#0A1A3C]">Atualizar Proposta Digital em Tempo Real</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Altere os trechos dos voos ou hospedagem e veja as atualizações em tempo real no cliente (Token: <span className="font-mono font-bold text-[#0A1A3C]">{token}</span>).
          </p>
        </div>

        <a
          href={`/proposta/${token}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#38BDF8]/10 text-[#0A1A3C] border border-[#38BDF8]/30 text-xs font-bold rounded-xl hover:bg-[#38BDF8]/20 transition-all shrink-0"
        >
          Visualizar Proposta Pública ➔
        </a>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-between shadow-lg">
          <span>Proposta atualizada com sucesso! As alterações já estão ativas para o cliente.</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-600 text-xs font-bold rounded-2xl border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 md:p-8 shadow-xs border border-slate-200 space-y-8">
        
        {/* BLOCO 1: STATUS & CLIENTE */}
        <div className="space-y-4">
          <h2 className="text-base font-black text-[#0A1A3C] border-b border-slate-100 pb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#0A1A3C] text-[#38BDF8] text-xs font-bold flex items-center justify-center">1</span>
            Status & Cliente
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Status da Proposta</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#0A1A3C] outline-none"
              >
                <option value="Pendente">🟡 Pendente</option>
                <option value="Aprovado">🟢 Aprovado</option>
                <option value="Rejeitado">🔴 Rejeitado</option>
                <option value="Expirado">⚪ Expirado</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nome do Cliente</label>
              <input
                type="text"
                required
                value={clienteNome}
                onChange={(e) => setClienteNome(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp com DDD</label>
              <input
                type="text"
                required
                value={clienteWhatsapp}
                onChange={(e) => setClienteWhatsapp(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">E-mail do Cliente</label>
              <input
                type="email"
                value={clienteEmail}
                onChange={(e) => setClienteEmail(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none"
              />
            </div>
          </div>
        </div>

        {/* BLOCO 2: HOSPEDAGEM */}
        <div className="space-y-4">
          <h2 className="text-base font-black text-[#0A1A3C] border-b border-slate-100 pb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#0A1A3C] text-[#38BDF8] text-xs font-bold flex items-center justify-center">2</span>
            Hospedagem & Acomodação
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nome do Hotel / Resort</label>
              <input
                type="text"
                value={hotelNomeCustomizado}
                onChange={(e) => setHotelNomeCustomizado(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#0A1A3C] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">URL da Foto Principal</label>
              <input
                type="url"
                value={hotelFotoUrlCustomizada}
                onChange={(e) => setHotelFotoUrlCustomizada(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none"
              />
            </div>
          </div>

          {/* ENDEREÇO DA ACOMODAÇÃO */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">Endereço / Localização do Hotel</label>
              <span className="text-[10px] text-slate-500 font-semibold">📍 O cliente poderá visualizar pontos turísticos no Google Maps</span>
            </div>
            <input
              type="text"
              placeholder="Ex: Av. Beira Mar, 1000 - Praia de Muro Alto, Porto de Galinhas - PE"
              value={hotelEnderecoCustomizado}
              onChange={(e) => setHotelEnderecoCustomizado(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none"
            />
          </div>

          {/* DADOS DE RESERVA & VOUCHER PÓS-APROVAÇÃO */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200 space-y-3 mt-4">
            <div className="flex items-center justify-between border-b border-sky-200/60 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-base">🔑</span>
                <div>
                  <h3 className="text-xs font-black text-[#0A1A3C] uppercase tracking-wider">
                    Dados da Reserva Confirmada & Voucher (Pós-Venda)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Preencha o quarto atribuído e o localizador para o cliente apresentar no check-in.
                  </p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                status === "Aprovado" ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-amber-100 text-amber-800 border border-amber-300"
              }`}>
                {status === "Aprovado" ? "🟢 Proposta Aprovada" : `Status: ${status}`}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Número do Quarto / Acomodação
                </label>
                <input
                  type="text"
                  placeholder="Ex: Quarto 304 - Bloco Oceano"
                  value={numeroQuarto}
                  onChange={(e) => setNumeroQuarto(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-[#0A1A3C] focus:ring-2 focus:ring-[#38BDF8] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Código do Voucher / Localizador da Reserva
                </label>
                <input
                  type="text"
                  placeholder="Ex: RES-982143-HTL"
                  value={codigoVoucher}
                  onChange={(e) => setCodigoVoucher(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold font-mono text-[#0A1A3C] focus:ring-2 focus:ring-[#38BDF8] outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* BLOCO 3: VOOS DINÂMICOS (TRECHOS) */}
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
                      value={t.origem}
                      onChange={(e) => handleUpdateTrechoIda(idx, "origem", e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#0A1A3C] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Destino do Trecho</label>
                    <input
                      type="text"
                      value={t.destino}
                      onChange={(e) => handleUpdateTrechoIda(idx, "destino", e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#0A1A3C] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Companhia & Voo</label>
                    <input
                      type="text"
                      value={t.companhia}
                      onChange={(e) => handleUpdateTrechoIda(idx, "companhia", e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Horários (Saída ➔ Chegada)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={t.horarioSaida}
                        onChange={(e) => handleUpdateTrechoIda(idx, "horarioSaida", e.target.value)}
                        className="w-1/2 p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold outline-none"
                      />
                      <input
                        type="text"
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
                      value={t.origem}
                      onChange={(e) => handleUpdateTrechoVolta(idx, "origem", e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#0A1A3C] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Destino do Trecho</label>
                    <input
                      type="text"
                      value={t.destino}
                      onChange={(e) => handleUpdateTrechoVolta(idx, "destino", e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#0A1A3C] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Companhia & Voo</label>
                    <input
                      type="text"
                      value={t.companhia}
                      onChange={(e) => handleUpdateTrechoVolta(idx, "companhia", e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Horários (Saída ➔ Chegada)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={t.horarioSaida}
                        onChange={(e) => handleUpdateTrechoVolta(idx, "horarioSaida", e.target.value)}
                        className="w-1/2 p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold outline-none"
                      />
                      <input
                        type="text"
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

        {/* BLOCO 4: VALORES */}
        <div className="space-y-4">
          <h2 className="text-base font-black text-[#0A1A3C] border-b border-slate-100 pb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#0A1A3C] text-[#38BDF8] text-xs font-bold flex items-center justify-center">4</span>
            Valores & Preço
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Subtotal Produtos (R$)</label>
              <input
                type="number"
                step="0.01"
                value={valorProdutos}
                onChange={(e) => {
                  setValorProdutos(e.target.value);
                  const p = parseFloat(e.target.value) || 0;
                  const t = parseFloat(valorTaxas) || 0;
                  setValorTotal((p + t).toFixed(2));
                }}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Taxas (R$)</label>
              <input
                type="number"
                step="0.01"
                value={valorTaxas}
                onChange={(e) => {
                  setValorTaxas(e.target.value);
                  const p = parseFloat(valorProdutos) || 0;
                  const t = parseFloat(e.target.value) || 0;
                  setValorTotal((p + t).toFixed(2));
                }}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none font-bold"
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
            className="px-5 py-3 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3.5 bg-[#0A1A3C] hover:bg-[#122A5C] text-white text-xs font-bold rounded-xl shadow-lg cursor-pointer flex items-center gap-2"
          >
            {submitting && <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
            Salvar Alterações na Proposta
          </button>
        </div>
      </form>
    </div>
  );
}

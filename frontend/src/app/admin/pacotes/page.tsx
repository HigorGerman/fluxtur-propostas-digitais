"use client";

import { useEffect, useState, FormEvent } from "react";
import { apiRequest } from "@/services/api";

interface Hotel {
  id: string;
  nome: string;
  cidade: string;
  endereco: string;
}

interface Pacote {
  id: string;
  titulo: string;
  destino: string;
  estadoDestino: string;
  cidadeDestino: string;
  hotelId: string;
  hotel?: Hotel;
  fotoUrl: string;
  precoBase: number;
  descricaoAtividades: string;
  possuiTransfer: boolean;
  descricaoTransfer?: string;
  possuiSeguroViagem: boolean;
  descricaoSeguro?: string;
  possuiVoo: boolean;
  ehVooDireto: boolean;
  quantidadeParadas?: number;
  cidadesConexao?: string;
  observacoesVoo?: string;
}

export default function AdminPacotesPage() {
  const [pacotes, setPacotes] = useState<Pacote[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [titulo, setTitulo] = useState("");
  const [destinoQuery, setDestinoQuery] = useState("");
  const [cidadesSugestoes, setCidadesSugestoes] = useState<string[]>([]);
  const [isSearchingCities, setIsSearchingCities] = useState(false);
  const [hotelId, setHotelId] = useState("");
  const [precoBase, setPrecoBase] = useState("");
  const [descricaoAtividades, setDescricaoAtividades] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");

  const [possuiTransfer, setPossuiTransfer] = useState(false);
  const [descricaoTransfer, setDescricaoTransfer] = useState("");
  const [possuiSeguroViagem, setPossuiSeguroViagem] = useState(false);
  const [descricaoSeguro, setDescricaoSeguro] = useState("");

  const [possuiVoo, setPossuiVoo] = useState(false);
  const [ehVooDireto, setEhVooDireto] = useState(true);
  const [quantidadeParadas, setQuantidadeParadas] = useState("");
  const [cidadesConexao, setCidadesConexao] = useState("");
  const [observacoesVoo, setObservacoesVoo] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPacotes = async () => {
    try {
      const pacotesData = await apiRequest<Pacote[]>("/pacotes");
      setPacotes(pacotesData);
    } catch (err: any) {
      console.error(err);
    }
  };

  const fetchFilteredHotels = async (cidade: string) => {
    try {
      let endpoint = "/hotels";
      if (cidade) {
        endpoint += `?cidade=${encodeURIComponent(cidade)}`;
      }
      const hotelsData = await apiRequest<Hotel[]>(endpoint);
      setHotels(hotelsData);
      if (hotelsData.length > 0) {
        setHotelId(hotelsData[0].id);
      } else {
        setHotelId("");
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    const userStr = sessionStorage.getItem("user") || localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setRole(user.role);
      } catch { }
    }
    fetchPacotes();
    fetchFilteredHotels("").finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!destinoQuery || destinoQuery.length < 2) {
      setCidadesSugestoes([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingCities(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destinoQuery)}&addressdetails=1&limit=6`
        );
        if (res.ok) {
          const data = await res.json();
          const suggestions = new Set<string>();
          data.forEach((item: any) => {
            const cityName = item.address?.city || item.address?.town || item.address?.village || item.address?.municipality || item.display_name.split(",")[0];
            const stateName = item.address?.state || item.address?.country;
            if (cityName) {
              suggestions.add(stateName ? `${cityName}, ${stateName}` : cityName);
            }
          });
          setCidadesSugestoes(Array.from(suggestions));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearchingCities(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [destinoQuery]);

  const handleDestinoSelect = (val: string) => {
    setDestinoQuery(val);
    const parts = val.split(",");
    const cidade = parts[0]?.trim() || val;
    fetchFilteredHotels(cidade);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!hotelId) {
      setError("Selecione um hotel parceiro para este pacote.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const parts = destinoQuery.split(",");
    const cidadeDestino = parts[0]?.trim() || destinoQuery;
    const estadoDestino = parts[1]?.trim() || "";

    const formData = new FormData();
    formData.append("titulo", titulo.trim());
    formData.append("destino", destinoQuery.trim());
    formData.append("estadoDestino", estadoDestino);
    formData.append("cidadeDestino", cidadeDestino);
    formData.append("hotelId", hotelId);
    formData.append("precoBase", precoBase);
    formData.append("descricaoAtividades", descricaoAtividades.trim());
    formData.append("possuiTransfer", possuiTransfer.toString());
    if (possuiTransfer && descricaoTransfer.trim() !== "") {
      formData.append("descricaoTransfer", descricaoTransfer.trim());
    }
    formData.append("possuiSeguroViagem", possuiSeguroViagem.toString());
    if (possuiSeguroViagem && descricaoSeguro.trim() !== "") {
      formData.append("descricaoSeguro", descricaoSeguro.trim());
    }
    if (fotoUrl && fotoUrl.trim() !== "") {
      formData.append("fotoUrl", fotoUrl.trim());
    }

    formData.append("possuiVoo", possuiVoo.toString());
    formData.append("ehVooDireto", ehVooDireto.toString());
    if (possuiVoo && !ehVooDireto && quantidadeParadas !== "") {
      formData.append("quantidadeParadas", quantidadeParadas);
    }
    if (possuiVoo && !ehVooDireto && cidadesConexao.trim() !== "") {
      formData.append("cidadesConexao", cidadesConexao.trim());
    }
    if (possuiVoo && observacoesVoo.trim() !== "") {
      formData.append("observacoesVoo", observacoesVoo.trim());
    }

    try {
      await apiRequest("/pacotes", {
        method: "POST",
        body: formData,
      });

      setTitulo("");
      setDestinoQuery("");
      setPrecoBase("");
      setDescricaoAtividades("");
      setFotoUrl("");
      setPossuiTransfer(false);
      setDescricaoTransfer("");
      setPossuiSeguroViagem(false);
      setDescricaoSeguro("");
      setPossuiVoo(false);
      setEhVooDireto(true);
      setQuantidadeParadas("");
      setCidadesConexao("");
      setObservacoesVoo("");
      setShowForm(false);
      await fetchPacotes();
      await fetchFilteredHotels("");
    } catch (err: any) {
      setError(err.message || "Erro ao cadastrar pacote.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-500 font-medium">Carregando pacotes de viagem...</div>;
  }

  return (
    <div className="space-y-8 w-full my-4 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E5E9F0] pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#111827] mb-1">Pacotes de Viagem</h1>
          <p className="text-sm text-slate-500">Gerencie ofertas completas de viagens, hospedagens e roteiros integrados.</p>
        </div>
        {role === "Admin" && (
          <button
            onClick={() => setShowForm(!showForm)}
            className={`self-start px-5 py-2.5 font-bold text-sm rounded-lg shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0 ${showForm
                ? "bg-white border border-[#E5E9F0] text-[#0A1A3C] hover:bg-slate-50"
                : "bg-gradient-to-r from-[#0A1A3C] to-[#3B82F6] hover:opacity-95 text-white"
              }`}
          >
            {showForm ? "Fechar Formulario" : "+ Criar Novo Pacote"}
          </button>
        )}
      </div>

      {showForm && role === "Admin" && (
        <div className="bg-white border border-[#E5E9F0] rounded-xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#E5E9F0] pb-4">
            <h2 className="text-xl font-bold text-[#111827] tracking-tight flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-[#3B82F6]"></span>
              Criar Novo Pacote de Viagem
            </h2>
            <span className="text-xs text-[#3B82F6] bg-blue-50 border border-blue-200 px-2.5 py-1 rounded font-bold uppercase tracking-wider">
              Oferta Integrada
            </span>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[#111827] mb-1.5">Titulo do Pacote</label>
              <input
                type="text"
                required
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex: Fim de Semana Luxuoso em Arraial do Cabo"
                className="w-full px-4 py-2.5 bg-white text-[#111827] font-medium text-sm border border-[#E5E9F0] rounded-lg focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none placeholder:text-[#9CA3AF] transition-all shadow-xs"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-semibold text-[#111827] mb-1.5">Cidade / Destino</label>
              <input
                type="text"
                required
                list="cidades-pacote-suggestions"
                value={destinoQuery}
                onChange={(e) => handleDestinoSelect(e.target.value)}
                placeholder="Digite o destino (ex: Balneario Camboriu, Rio de Janeiro)"
                className="w-full px-4 py-2.5 bg-white text-[#111827] font-medium text-sm border border-[#E5E9F0] rounded-lg focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none placeholder:text-[#9CA3AF] transition-all shadow-xs"
              />
              <datalist id="cidades-pacote-suggestions">
                {cidadesSugestoes.map((c, i) => (
                  <option key={i} value={c} />
                ))}
              </datalist>
              {isSearchingCities && (
                <span className="absolute right-3 top-9 text-xs text-[#3B82F6] font-bold animate-pulse">
                  Buscando...
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-1.5">Hotel Parceiro Credenciado</label>
              <select
                value={hotelId}
                onChange={(e) => setHotelId(e.target.value)}
                className="w-full px-4 py-2.5 bg-white text-[#111827] font-medium text-sm border border-[#E5E9F0] rounded-lg focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none cursor-pointer transition-all shadow-xs"
              >
                {hotels.map((h) => (
                  <option key={h.id} value={h.id} className="text-[#111827]">
                    {h.nome} ({h.cidade})
                  </option>
                ))}
                {hotels.length === 0 && <option value="" className="text-slate-500">Nenhum hotel encontrado para esta localizacao</option>}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[#111827] mb-1.5">Preco Base (R$)</label>
              <input
                type="number"
                step="0.01"
                required
                value={precoBase}
                onChange={(e) => setPrecoBase(e.target.value)}
                placeholder="Ex: 1890.00"
                className="w-full px-4 py-2.5 bg-white text-[#111827] font-medium text-sm border border-[#E5E9F0] rounded-lg focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none placeholder:text-[#9CA3AF] transition-all shadow-xs"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[#111827] mb-1.5">Descricao de Atividades / Roteiro</label>
              <textarea
                required
                value={descricaoAtividades}
                onChange={(e) => setDescricaoAtividades(e.target.value)}
                placeholder="Detalhes completos do roteiro e experiencias inclusas no pacote..."
                rows={4}
                className="w-full px-4 py-2.5 bg-white text-[#111827] font-medium text-sm border border-[#E5E9F0] rounded-lg focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none placeholder:text-[#9CA3AF] transition-all shadow-xs resize-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[#111827] mb-1.5">URL da Foto de Capa do Pacote</label>
              <div className="flex items-center gap-4">
                <input
                  type="url"
                  value={fotoUrl}
                  onChange={(e) => setFotoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="flex-1 px-4 py-2.5 bg-white text-[#111827] font-medium text-sm border border-[#E5E9F0] rounded-lg focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none placeholder:text-[#9CA3AF] transition-all shadow-xs"
                />
                {fotoUrl && (
                  <div className="w-16 h-11 rounded-lg overflow-hidden border border-[#E5E9F0] bg-slate-100 shrink-0">
                    <img
                      src={fotoUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLElement).style.display = "none"; }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2 border-t border-[#E5E9F0] pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#F9FAFB] border border-[#E5E9F0] p-5 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#111827]">Transfer / Traslado Incluso</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={possuiTransfer}
                    onClick={() => setPossuiTransfer(!possuiTransfer)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${possuiTransfer ? 'bg-gradient-to-r from-[#0A1A3C] to-[#3B82F6]' : 'bg-[#E5E9F0]'}`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${possuiTransfer ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
                {possuiTransfer && (
                  <input
                    type="text"
                    value={descricaoTransfer}
                    onChange={(e) => setDescricaoTransfer(e.target.value)}
                    placeholder="Ex: Traslado privativo aeroporto / hotel / aeroporto"
                    className="w-full px-4 py-2.5 bg-white border border-[#E5E9F0] rounded-lg text-sm font-medium text-[#111827] placeholder:text-[#9CA3AF] outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20"
                  />
                )}
              </div>

              <div className="bg-[#F9FAFB] border border-[#E5E9F0] p-5 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#111827]">Seguro Viagem Incluso</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={possuiSeguroViagem}
                    onClick={() => setPossuiSeguroViagem(!possuiSeguroViagem)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${possuiSeguroViagem ? 'bg-gradient-to-r from-[#0A1A3C] to-[#3B82F6]' : 'bg-[#E5E9F0]'}`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${possuiSeguroViagem ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
                {possuiSeguroViagem && (
                  <input
                    type="text"
                    value={descricaoSeguro}
                    onChange={(e) => setDescricaoSeguro(e.target.value)}
                    placeholder="Ex: Cobertura de R$ 60.000 para despesas medicas"
                    className="w-full px-4 py-2.5 bg-white border border-[#E5E9F0] rounded-lg text-sm font-medium text-[#111827] placeholder:text-[#9CA3AF] outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20"
                  />
                )}
              </div>
            </div>

            <div className="md:col-span-2 border-t border-[#E5E9F0] pt-6 space-y-5">
              <div className="flex items-center justify-between bg-[#F9FAFB] border border-[#E5E9F0] p-5 rounded-xl">
                <span className="text-sm font-semibold text-[#111827]">
                  Inclui Passagem Aerea / Voo?
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={possuiVoo}
                  onClick={() => setPossuiVoo(!possuiVoo)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${possuiVoo ? 'bg-gradient-to-r from-[#0A1A3C] to-[#3B82F6]' : 'bg-[#E5E9F0]'}`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${possuiVoo ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              {possuiVoo && (
                <div className="bg-[#F9FAFB] border border-[#E5E9F0] p-6 rounded-xl space-y-5">
                  <div className="flex items-center justify-between bg-white border border-[#E5E9F0] p-4 rounded-lg">
                    <span className="text-sm font-semibold text-[#111827]">Voo Direto (Sem Paradas / Escalas)?</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={ehVooDireto}
                      onClick={() => setEhVooDireto(!ehVooDireto)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${ehVooDireto ? 'bg-gradient-to-r from-[#0A1A3C] to-[#3B82F6]' : 'bg-[#E5E9F0]'}`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${ehVooDireto ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {!ehVooDireto && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-[#111827] mb-1.5">Quantidade de Paradas / Conexoes</label>
                        <input
                          type="number"
                          min={1}
                          value={quantidadeParadas}
                          onChange={(e) => setQuantidadeParadas(e.target.value)}
                          placeholder="Ex: 1"
                          className="w-full px-4 py-2.5 bg-white text-[#111827] font-medium text-sm border border-[#E5E9F0] rounded-lg focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none placeholder:text-[#9CA3AF] transition-all shadow-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#111827] mb-1.5">Cidades / Aeroportos de Conexao</label>
                        <input
                          type="text"
                          value={cidadesConexao}
                          onChange={(e) => setCidadesConexao(e.target.value)}
                          placeholder="Ex: Brasilia (BSB), Galeao (GIG)"
                          className="w-full px-4 py-2.5 bg-white text-[#111827] font-medium text-sm border border-[#E5E9F0] rounded-lg focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none placeholder:text-[#9CA3AF] transition-all shadow-xs"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-[#111827] mb-1.5">Observacoes do Voo / Bagagem (Opcional)</label>
                    <input
                      type="text"
                      value={observacoesVoo}
                      onChange={(e) => setObservacoesVoo(e.target.value)}
                      placeholder="Ex: Saidas de SP (GRU/CGH), inclui mala de mao 10kg"
                      className="w-full px-4 py-2.5 bg-white text-[#111827] font-medium text-sm border border-[#E5E9F0] rounded-lg focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none placeholder:text-[#9CA3AF] transition-all shadow-xs"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="md:col-span-2 flex items-center justify-end gap-4 mt-6 pt-5 border-t border-[#E5E9F0]">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 bg-white border border-[#E5E9F0] hover:bg-slate-50 text-[#0A1A3C] font-semibold text-sm rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 shadow-xs"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className={`px-5 py-2.5 bg-gradient-to-r from-[#0A1A3C] to-[#3B82F6] hover:opacity-95 text-white font-bold text-sm rounded-lg shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0 ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {submitting ? "Salvando..." : "Salvar Pacote"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-[#E5E9F0] rounded-xl overflow-hidden shadow-sm mt-8">
        <div className="px-6 py-5 border-b border-[#E5E9F0] flex items-center justify-between bg-slate-50/50">
          <h2 className="text-lg font-bold text-[#111827] tracking-tight">Lista de Pacotes Cadastrados</h2>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{pacotes.length} ofertas</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-[#E5E9F0]">
                <th className="text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-3.5">Pacote</th>
                <th className="text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-3.5">Destino</th>
                <th className="text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-3.5">Servicos Inclusos</th>
                <th className="text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-3.5">Preco Base</th>
                <th className="text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pacotes.map((pacote) => (
                <tr key={pacote.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {pacote.fotoUrl ? (
                        <img src={pacote.fotoUrl} alt={pacote.titulo} className="w-12 h-12 rounded-lg object-cover border border-[#E5E9F0] shrink-0" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-100 border border-[#E5E9F0] flex items-center justify-center text-slate-400 text-xs font-bold shrink-0">
                          P
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-[#111827] group-hover:text-[#3B82F6] transition-colors text-base">{pacote.titulo}</div>
                        <div className="text-xs text-slate-500 truncate max-w-xs">{pacote.hotel?.nome || "Hotel Credenciado"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-slate-700">
                    <span className="px-3 py-1 rounded-md bg-slate-100 border border-[#E5E9F0] text-[#111827] font-bold">
                      {pacote.destino}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <div className="flex flex-wrap gap-1.5">
                      {pacote.possuiTransfer && (
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-700">
                          Transfer
                        </span>
                      )}
                      {pacote.possuiSeguroViagem && (
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-indigo-50 border border-indigo-200 text-indigo-700">
                          Seguro
                        </span>
                      )}
                      {pacote.possuiVoo && (
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-blue-50 border border-blue-200 text-blue-700">
                          {pacote.ehVooDireto ? "Voo Direto" : `Voo (${pacote.quantidadeParadas || 1} Escala)`}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-base font-bold text-emerald-600">
                    R$ {pacote.precoBase.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                      Ativo
                    </span>
                  </td>
                </tr>
              ))}
              {pacotes.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-500 text-sm">
                    Nenhum pacote de viagem ativo encontrado no momento.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

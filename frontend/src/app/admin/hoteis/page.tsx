"use client";

import { useEffect, useState, FormEvent } from "react";
import { apiRequest } from "@/services/api";

interface Hotel {
  id: string;
  nome: string;
  cidade: string;
  endereco: string;
  estrelas: number;
  telefone: string;
  emailContato: string;
  fotoUrl?: string;
}

export default function AdminHoteisPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [nome, setNome] = useState("");
  const [cidadeQuery, setCidadeQuery] = useState("");
  const [cidadesSugestoes, setCidadesSugestoes] = useState<string[]>([]);
  const [isSearchingCities, setIsSearchingCities] = useState(false);
  const [endereco, setEndereco] = useState("");
  const [estrelas, setEstrelas] = useState<number>(5);
  const [telefone, setTelefone] = useState("");
  const [emailContato, setEmailContato] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHotels = async () => {
    try {
      const data = await apiRequest<Hotel[]>("/hotels");
      setHotels(data);
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
      } catch {}
    }
    fetchHotels().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!cidadeQuery || cidadeQuery.length < 2) {
      setCidadesSugestoes([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingCities(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cidadeQuery)}&addressdetails=1&limit=6`
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
  }, [cidadeQuery]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const numEstrelas = typeof estrelas === "number" ? estrelas : (parseInt(String(estrelas), 10) || 5);

    const formData = new FormData();
    formData.append("nome", nome.trim());
    formData.append("cidade", cidadeQuery.trim());
    formData.append("endereco", endereco.trim());
    formData.append("estrelas", numEstrelas.toString());
    formData.append("telefone", telefone.trim());
    formData.append("emailContato", emailContato.trim());

    if (fotoUrl && fotoUrl.trim() !== "") {
      formData.append("fotoUrl", fotoUrl.trim());
    }

    try {
      await apiRequest("/hotels", {
        method: "POST",
        body: formData,
      });

      setNome("");
      setCidadeQuery("");
      setEndereco("");
      setEstrelas(5);
      setTelefone("");
      setEmailContato("");
      setFotoUrl("");
      setShowForm(false);
      await fetchHotels();
    } catch (err: any) {
      setError(err.message || "Erro ao cadastrar hotel.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-500 font-medium">Carregando hoteis...</div>;
  }

  return (
    <div className="space-y-6 w-full my-4 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E5E9F0] pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#111827] mb-1">Hoteis Parceiros</h1>
          <p className="text-sm text-slate-500">Consulte e gerencie a rede de hoteis credenciados da Fluxtur.</p>
        </div>
        {role === "Admin" && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="self-start px-5 py-2.5 bg-gradient-to-r from-[#0A1A3C] to-[#3B82F6] hover:opacity-95 text-white font-bold text-sm rounded-lg shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            {showForm ? "Fechar Formulario" : "+ Cadastrar Novo Hotel"}
          </button>
        )}
      </div>

      {showForm && role === "Admin" && (
        <div className="bg-white border border-[#E5E9F0] rounded-xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#E5E9F0] pb-4">
            <h2 className="text-xl font-bold text-[#111827] tracking-tight flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-[#3B82F6]"></span>
              Cadastrar Novo Hotel Parceiro
            </h2>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Credenciamento
            </span>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-1.5">Nome do Hotel</label>
              <input
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Grand Hyatt Rio de Janeiro"
                className="w-full px-4 py-2.5 bg-white text-[#111827] font-medium text-sm border border-[#E5E9F0] rounded-lg focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none placeholder:text-slate-400 transition-all shadow-xs"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-semibold text-[#111827] mb-1.5">Cidade / Localizacao</label>
              <input
                type="text"
                required
                list="cidades-api-suggestions"
                value={cidadeQuery}
                onChange={(e) => setCidadeQuery(e.target.value)}
                placeholder="Digite a cidade (ex: Balneario Camboriu, Rio de Janeiro)"
                className="w-full px-4 py-2.5 bg-white text-[#111827] font-medium text-sm border border-[#E5E9F0] rounded-lg focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none placeholder:text-slate-400 transition-all shadow-xs"
              />
              <datalist id="cidades-api-suggestions">
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

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[#111827] mb-1.5">Endereco Completo</label>
              <input
                type="text"
                required
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                placeholder="Ex: Av. Lucio Costa, 9600 - Barra da Tijuca"
                className="w-full px-4 py-2.5 bg-white text-[#111827] font-medium text-sm border border-[#E5E9F0] rounded-lg focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none placeholder:text-slate-400 transition-all shadow-xs"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-1.5">Classificacao (Estrelas)</label>
              <select
                value={estrelas}
                onChange={(e) => setEstrelas(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-white text-[#111827] font-medium text-sm border border-[#E5E9F0] rounded-lg focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none cursor-pointer transition-all shadow-xs"
              >
                <option value={5} className="text-[#111827]">5 Estrelas Luxo</option>
                <option value={4} className="text-[#111827]">4 Estrelas Superior</option>
                <option value={3} className="text-[#111827]">3 Estrelas Conforto</option>
                <option value={2} className="text-[#111827]">2 Estrelas Padrao</option>
                <option value={1} className="text-[#111827]">1 Estrela Pousada</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-1.5">Telefone de Contato</label>
              <input
                type="text"
                required
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="Ex: (21) 3797-1234"
                className="w-full px-4 py-2.5 bg-white text-[#111827] font-medium text-sm border border-[#E5E9F0] rounded-lg focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none placeholder:text-slate-400 transition-all shadow-xs"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[#111827] mb-1.5">E-mail de Contato</label>
              <input
                type="email"
                required
                value={emailContato}
                onChange={(e) => setEmailContato(e.target.value)}
                placeholder="Ex: reservas@hotel.com"
                className="w-full px-4 py-2.5 bg-white text-[#111827] font-medium text-sm border border-[#E5E9F0] rounded-lg focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none placeholder:text-slate-400 transition-all shadow-xs"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[#111827] mb-1.5">URL da Foto do Hotel</label>
              <div className="flex items-center gap-4">
                <input
                  type="url"
                  value={fotoUrl}
                  onChange={(e) => setFotoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="flex-1 px-4 py-2.5 bg-white text-[#111827] font-medium text-sm border border-[#E5E9F0] rounded-lg focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none placeholder:text-slate-400 transition-all shadow-xs"
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

            <div className="md:col-span-2 flex items-center justify-end gap-4 mt-6 pt-5 border-t border-[#E5E9F0]">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 bg-white border border-[#E5E9F0] hover:bg-slate-50 text-[#0A1A3C] font-semibold text-sm rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className={`px-5 py-2.5 bg-gradient-to-r from-[#0A1A3C] to-[#3B82F6] hover:opacity-95 text-white font-bold text-sm rounded-lg shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0 ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {submitting ? "Salvando..." : "Salvar Hotel"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-[#E5E9F0] rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-[#E5E9F0] flex items-center justify-between bg-slate-50/50">
          <h2 className="text-lg font-bold text-[#111827] tracking-tight">Lista de Hoteis Cadastrados</h2>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{hotels.length} parceiros</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-[#E5E9F0]">
                <th className="text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-3.5">Hotel</th>
                <th className="text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-3.5">Cidade</th>
                <th className="text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-3.5">Estrelas</th>
                <th className="text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-3.5">Contato</th>
                <th className="text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {hotels.map((hotel) => (
                <tr key={hotel.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {hotel.fotoUrl ? (
                        <img src={hotel.fotoUrl} alt={hotel.nome} className="w-11 h-11 rounded-lg object-cover border border-[#E5E9F0] shrink-0" />
                      ) : (
                        <div className="w-11 h-11 rounded-lg bg-slate-100 border border-[#E5E9F0] flex items-center justify-center text-slate-400 text-xs font-bold shrink-0">
                          H
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-[#111827] group-hover:text-[#3B82F6] transition-colors text-base">{hotel.nome}</div>
                        <div className="text-xs text-slate-500 truncate max-w-xs">{hotel.endereco}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-slate-700">
                    <span className="px-3 py-1 rounded-md bg-slate-100 border border-[#E5E9F0] text-[#111827] font-bold">
                      {hotel.cidade}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-amber-500">
                    {hotel.estrelas} ★
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-700">
                    <div className="font-semibold">{hotel.telefone}</div>
                    <div className="text-slate-500 text-[11px] truncate">{hotel.emailContato}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                      Ativo
                    </span>
                  </td>
                </tr>
              ))}
              {hotels.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-500 text-sm">
                    Nenhum hotel credenciado cadastrado ate o momento.
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

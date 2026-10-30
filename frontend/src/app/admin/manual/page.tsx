"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  BookOpen,
  Search,
  Printer,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  CheckCircle2,
  Clock,
  XCircle,
  Hotel,
  Plane,
  FileText,
  Smartphone,
  MessageSquare,
  ShieldCheck,
  KeyRound,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  HelpCircle,
  ArrowRight,
  Layers,
  Send,
  Download,
  AlertCircle,
  Building,
  UserCheck
} from "lucide-react";

interface SectionItem {
  id: string;
  badge: string;
  title: string;
  icon: any;
  summary: string;
  keywords: string[];
  content: React.ReactNode;
}

export default function AdminManualPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string>("todos");
  const [copiedLink, setCopiedLink] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    modulo1: true,
    modulo2: true,
    modulo3: true,
    modulo4: true,
    modulo5: true,
    faq: true,
  });

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    setOpenSections({
      modulo1: true,
      modulo2: true,
      modulo3: true,
      modulo4: true,
      modulo5: true,
      faq: true,
    });
  };

  const collapseAll = () => {
    setOpenSections({
      modulo1: false,
      modulo2: false,
      modulo3: false,
      modulo4: false,
      modulo5: false,
      faq: false,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyExample = () => {
    navigator.clipboard.writeText("https://fluxtur.com.br/proposta/7c873173f74b");
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const sections: SectionItem[] = [
    {
      id: "modulo1",
      badge: "Módulo 1",
      title: "Visão Geral e Conceito do Fluxtur",
      icon: Layers,
      summary: "Apresentação da plataforma, fluxo executivo de 4 etapas e ciclo de vida da proposta digital.",
      keywords: ["visão geral", "conceito", "fluxo", "status", "ciclo", "etapas", "proposta", "infotravel", "aprovação"],
      content: (
        <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
          <div className="bg-[#0A1A3C] text-white p-5 rounded-xl border border-[#122A5C] shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#5EA8FF]/20 text-[#5EA8FF] rounded-lg shrink-0 mt-0.5">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white tracking-wide">
                  O que é a Proposta Digital Fluxtur?
                </h4>
                <p className="text-slate-300 text-xs sm:text-sm">
                  O Fluxtur é uma plataforma executiva de cotação inspirada em ferramentas como InfoTravel.
                  Substitui PDFs estáticos, orçamentos longos por e-mail e textos confusos de WhatsApp por uma
                  <strong> landing page interativa de alto impacto visual</strong> com token de segurança único.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h5 className="font-bold text-[#0A1A3C] text-sm mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0A1A3C]"></span>
              O Fluxo Operacional da Agência (Passo a Passo)
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="bg-[#F8FAFC] border border-[#E5E9F0] p-4 rounded-xl relative">
                <span className="absolute -top-2.5 left-4 px-2 py-0.5 bg-[#0A1A3C] text-white text-[10px] font-bold rounded-full">
                  Etapa 1
                </span>
                <div className="text-[#0A1A3C] font-bold text-sm mb-1 mt-1">Briefing do Cliente</div>
                <p className="text-xs text-slate-600">
                  O agente coleta datas, destino, número de passageiros e preferências do viajante.
                </p>
              </div>

              <div className="bg-[#F8FAFC] border border-[#E5E9F0] p-4 rounded-xl relative">
                <span className="absolute -top-2.5 left-4 px-2 py-0.5 bg-[#0A1A3C] text-white text-[10px] font-bold rounded-full">
                  Etapa 2
                </span>
                <div className="text-[#0A1A3C] font-bold text-sm mb-1 mt-1">Montagem Ágil</div>
                <p className="text-xs text-slate-600">
                  Puxa um Pacote Base ou Hotel Credenciado para autopreencher informações em segundos.
                </p>
              </div>

              <div className="bg-[#F8FAFC] border border-[#E5E9F0] p-4 rounded-xl relative">
                <span className="absolute -top-2.5 left-4 px-2 py-0.5 bg-[#0A1A3C] text-white text-[10px] font-bold rounded-full">
                  Etapa 3
                </span>
                <div className="text-[#0A1A3C] font-bold text-sm mb-1 mt-1">Envio do Link Seguro</div>
                <p className="text-xs text-slate-600">
                  O sistema gera o link com Token criptografado. O cliente acessa direto pelo celular ou PC.
                </p>
              </div>

              <div className="bg-[#F8FAFC] border border-[#E5E9F0] p-4 rounded-xl relative">
                <span className="absolute -top-2.5 left-4 px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded-full">
                  Etapa 4
                </span>
                <div className="text-emerald-800 font-bold text-sm mb-1 mt-1">Aprovação Online</div>
                <p className="text-xs text-slate-600">
                  O cliente clica em "Aprovar Orçamento" ou chama no WhatsApp oficial para fechar a viagem.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h5 className="font-bold text-[#0A1A3C] text-sm mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0A1A3C]"></span>
              Entendendo os Badges de Status
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/70 flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-amber-200 text-amber-800">
                      Pendente
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Proposta enviada ao cliente. Aguardando interação, análise de datas ou aprovação.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/70 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-emerald-200 text-emerald-800">
                      Aprovado
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    O cliente clicou no botão "Aprovar Orçamento" na página digital. O sinal verde para emissão!
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/70 flex items-start gap-3">
                <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-rose-200 text-rose-800">
                      Recusado
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Cotação não aprovada pelo cliente ou substituída por uma nova proposta com outras datas.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/90 border border-blue-200 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-blue-900">
              <strong className="font-bold">Dica Operacional:</strong> Ao contrário de arquivos em PDF enviados por e-mail que ficam desatualizados, se você precisar ajustar um voo ou preço, basta editar o orçamento no painel. O cliente acessa o mesmo link e vê as alterações em tempo real!
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "modulo2",
      badge: "Módulo 2",
      title: "Catálogo de Hotéis e Autocadastro Inteligente",
      icon: Building,
      summary: "Autocadastro instantâneo via 'Salvar no catálogo rápido' e gerenciamento avulso de hotéis parceiros.",
      keywords: ["hotel", "hotéis", "catálogo", "salvar catálogo rápido", "acomodação", "resort", "pousada", "fotos", "pacotes", "em produção"],
      content: (
        <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
          <p>
            No Fluxtur, o fluxo de hotéis foi projetado para <strong>eliminar trabalho repetitivo</strong>.
            Você não precisa cadastrar hotéis manualmente em telas separadas antes de atender um cliente.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#FFFFFF] border-2 border-[#5EA8FF]/30 rounded-xl p-5 shadow-xs relative">
              <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 bg-[#0A1A3C] text-[#5EA8FF] text-[10px] font-bold rounded-full uppercase tracking-wider">
                Fluxo Principal (Recomendado)
              </span>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-lg bg-sky-50 text-sky-700">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h5 className="font-bold text-[#0A1A3C] text-base">
                  1. "Salvar no Catálogo Rápido" (Na própria Proposta)
                </h5>
              </div>
              <p className="text-xs text-slate-600 mb-3">
                Ao criar uma nova proposta (<code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">/admin/orcamentos/novo</code>):
              </p>
              <ul className="space-y-2 text-xs text-slate-700 list-disc list-inside">
                <li>Você digita o nome do hotel, destino e cola o link da foto de capa.</li>
                <li>Mantém marcada a caixinha <strong>"Salvar no catálogo rápido"</strong> (já vem ativa por padrão).</li>
                <li>Ao salvar a proposta, o sistema cadastra o hotel automaticamente no banco em segundo plano.</li>
                <li>Nas próximas cotações, esse hotel já aparece no menu de seleção rápida!</li>
              </ul>
            </div>

            <div className="bg-[#FFFFFF] border border-[#E5E9F0] rounded-xl p-5 shadow-xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-700">
                  <Hotel className="w-5 h-5" />
                </div>
                <h5 className="font-bold text-[#0A1A3C] text-base">
                  2. Cadastro Avulso de Hotel (/admin/hoteis)
                </h5>
              </div>
              <p className="text-xs text-slate-600 mb-3">
                Se quiser cadastrar ou revisar hotéis sem precisar abrir uma proposta de cliente:
              </p>
              <ul className="space-y-2 text-xs text-slate-700 list-disc list-inside">
                <li>Acesse o menu lateral <strong>Hotéis</strong> e clique em <strong>+ Novo Hotel</strong>.</li>
                <li>Preencha apenas o que a proposta realmente utiliza: <strong>Nome, Cidade, Foto de Capa (URL)</strong> e fotos adicionais.</li>
                <li>Campos desnecessários (como notas de avaliação, estrelas manuais ou telefones de recepção) foram removidos para tornar o cadastro ultrarrápido.</li>
              </ul>
            </div>
          </div>

          {/* STATUS DOS PACOTES BASE */}
          <div className="p-4 rounded-xl bg-amber-50/90 border border-amber-200 flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-amber-950">
              <strong className="font-bold text-amber-900">Sobre os Pacotes Base (Status: Em Produção):</strong> O módulo de pacotes fechados/pré-formatados está temporariamente pausado porque a grande maioria dos atendimentos da agência é 100% personalizada por cliente (datas flexíveis e voos específicos). O fluxo oficial e mais ágil é montar o orçamento puxando o hotel desejado e ajustando os voos sob medida!
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/90 border border-blue-200 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-blue-900">
              <strong className="font-bold">Onde pegar as fotos do hotel?</strong> Basta abrir o site oficial do hotel ou portais de turismo (Booking, TripAdvisor), clicar com botão direito na foto do quarto/fachada e selecionar <em>"Copiar endereço da imagem"</em>. Cole o link no campo de foto do Fluxtur para ter um preview instantâneo!
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "modulo3",
      badge: "Módulo 3",
      title: "Criando e Enviando um Orçamento Digital",
      icon: FileText,
      summary: "Passo a passo do formulário de cotação: viajante, hotel rápido, voos, taxas e disparo do link.",
      keywords: ["orçamento", "criar", "nova proposta", "cliente", "whatsapp", "preço", "taxas", "link seguro", "pagamento"],
      content: (
        <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
          <p>
            O formulário de <strong>Nova Proposta (/admin/orcamentos/novo)</strong> foi desenhado para agilidade máxima.
            Veja o roteiro passo a passo:
          </p>

          <div className="space-y-3">
            <div className="bg-[#FFFFFF] border border-[#E5E9F0] p-4 rounded-xl">
              <div className="flex items-center gap-2 text-sm font-bold text-[#0A1A3C] mb-1">
                <span className="w-6 h-6 rounded-full bg-[#0A1A3C] text-white flex items-center justify-center text-xs">1</span>
                Dados do Viajante e Validade
              </div>
              <p className="text-xs text-slate-600 pl-8">
                Informe o <strong>Nome do Cliente</strong> e o <strong>WhatsApp</strong> (com DDD). O e-mail é opcional. Defina também a data de validade da proposta (por padrão, 7 dias).
              </p>
            </div>

            <div className="bg-[#FFFFFF] border border-[#E5E9F0] p-4 rounded-xl">
              <div className="flex items-center gap-2 text-sm font-bold text-[#0A1A3C] mb-1">
                <span className="w-6 h-6 rounded-full bg-[#0A1A3C] text-white flex items-center justify-center text-xs">2</span>
                Hospedagem e "Salvar no Catálogo Rápido"
              </div>
              <p className="text-xs text-slate-600 pl-8">
                Se o hotel já estiver no catálogo, selecione-o no dropdown para preencher fotos e endereço de imediato. Se for um hotel novo, basta digitar o nome, colar o link da foto de capa e deixar a caixinha <strong>"Salvar no catálogo rápido"</strong> marcada. O hotel será salvo para todas as próximas propostas!
              </p>
            </div>

            <div className="bg-[#FFFFFF] border border-[#E5E9F0] p-4 rounded-xl">
              <div className="flex items-center gap-2 text-sm font-bold text-[#0A1A3C] mb-1">
                <span className="w-6 h-6 rounded-full bg-[#0A1A3C] text-white flex items-center justify-center text-xs">3</span>
                Datas, Quarto e Voo (Ida e Volta)
              </div>
              <p className="text-xs text-slate-600 pl-8">
                Defina Check-in, Check-out, regime de alimentação (ex: Café da Manhã, Meia Pensão ou All Inclusive) e os trechos de voo (Companhia, horários e aeroportos de embarque/desembarque).
              </p>
            </div>

            <div className="bg-[#FFFFFF] border border-[#E5E9F0] p-4 rounded-xl">
              <div className="flex items-center gap-2 text-sm font-bold text-[#0A1A3C] mb-1">
                <span className="w-6 h-6 rounded-full bg-[#0A1A3C] text-white flex items-center justify-center text-xs">4</span>
                Valores e Condições Comerciais
              </div>
              <p className="text-xs text-slate-600 pl-8">
                Informe o <strong>Valor dos Produtos</strong> e <strong>Taxas de Embarque</strong> (o sistema calcula o Total automaticamente). No campo "Observações de Pagamento", especifique as formas aceitas (ex: "Entrada via Pix + até 10x sem juros no cartão de crédito").
              </p>
            </div>

            <div className="bg-[#FFFFFF] border border-[#E5E9F0] p-4 rounded-xl">
              <div className="flex items-center gap-2 text-sm font-bold text-[#0A1A3C] mb-1">
                <span className="w-6 h-6 rounded-full bg-[#0A1A3C] text-white flex items-center justify-center text-xs">5</span>
                Geração do Token e Envio
              </div>
              <p className="text-xs text-slate-600 pl-8">
                Ao clicar em <strong>Salvar Proposta</strong>, o link com Token criptografado é gerado na hora. Clique em <strong>Copiar Link</strong> ou <strong>Abrir Proposta</strong> para enviar no WhatsApp do viajante.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-100 border border-slate-200">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Formato do Link Seguro:</span>
                <code className="text-xs font-mono bg-white px-2 py-1 rounded border border-slate-300 text-slate-800">
                  https://fluxtur.com.br/proposta/7c873173f74b
                </code>
              </div>
              <button
                onClick={handleCopyExample}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0A1A3C] text-white rounded-lg text-xs font-medium hover:bg-[#122A5C] transition-all cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedLink ? "Copiado!" : "Copiar Exemplo"}
              </button>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "modulo4",
      badge: "Módulo 4",
      title: "A Experiência do Cliente (/proposta/[token])",
      icon: Smartphone,
      summary: "Como o viajante visualiza a cotação no celular/desktop e o funcionamento da barra flutuante de ações.",
      keywords: ["cliente", "proposta", "token", "sticky bar", "aprovar", "whatsapp", "pdf", "responsivo", "celular"],
      content: (
        <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
          <p>
            Quando o cliente clica no link recebido pelo WhatsApp, ele é recebido por uma experiência
            estilo portal de turismo executivo, sem necessitar de nenhum cadastro ou senha.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl border border-[#E5E9F0] bg-white">
              <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs mb-2">
                01
              </div>
              <h6 className="font-bold text-[#0A1A3C] text-sm mb-1">Capa e Contagem Regressiva</h6>
              <p className="text-xs text-slate-600">
                Banner panorâmico do destino com timer de expiração para estimular senso de urgência na decisão.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#E5E9F0] bg-white">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs mb-2">
                02
              </div>
              <h6 className="font-bold text-[#0A1A3C] text-sm mb-1">Cartões de Voo e Hotel</h6>
              <p className="text-xs text-slate-600">
                Diagramação limpa em formato de bilhete aéreo (trechos, escalas, duração) e ficha completa da acomodação.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#E5E9F0] bg-white">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs mb-2">
                03
              </div>
              <h6 className="font-bold text-[#0A1A3C] text-sm mb-1">Valores e Pagamento</h6>
              <p className="text-xs text-slate-600">
                Discriminação transparente de taxas, valor total e opções detalhadas de parcelamento.
              </p>
            </div>
          </div>

          <div className="border border-[#122A5C] bg-[#0A1A3C] text-white p-5 rounded-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#122A5C] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Sticky Action Bar (Barra Flutuante Fixa no Rodapé)
                </span>
              </div>
              <span className="text-[11px] text-[#5EA8FF] font-semibold">Mobile & Desktop</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="bg-[#122A5C]/60 p-3 rounded-lg border border-white/10">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-1">
                  <CheckCircle2 className="w-4 h-4" /> Botão "Aprovar Orçamento"
                </div>
                <p className="text-[11px] text-slate-300">
                  Atualiza instantaneamente o status do orçamento para <strong>Aprovado</strong> no banco de dados.
                </p>
              </div>

              <div className="bg-[#122A5C]/60 p-3 rounded-lg border border-white/10">
                <div className="flex items-center gap-2 text-[#5EA8FF] font-bold text-xs mb-1">
                  <MessageSquare className="w-4 h-4" /> Botão "WhatsApp Agente"
                </div>
                <p className="text-[11px] text-slate-300">
                  Abre uma conversa direta no WhatsApp com o agente responsável com mensagem já formatada.
                </p>
              </div>

              <div className="bg-[#122A5C]/60 p-3 rounded-lg border border-white/10">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs mb-1">
                  <Download className="w-4 h-4" /> Botão "Baixar em PDF"
                </div>
                <p className="text-[11px] text-slate-300">
                  Gera a visualização para impressão ou salvamento em PDF de alta qualidade para o passageiro.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "modulo5",
      badge: "Módulo 5",
      title: "Segurança e Acesso Administrativo",
      icon: ShieldCheck,
      summary: "Políticas de acesso fechado, perfis de usuários e recuperação de senha via API do Resend.",
      keywords: ["segurança", "login", "senha", "recuperação", "esqueci senha", "resend", "token", "expiração", "admin"],
      content: (
        <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
          <p>
            O Fluxtur adota o modelo de <strong>acesso administrativo exclusivamente corporativo</strong>.
            Não existe cadastro público de usuários para proteger as tarifas e dados comerciais da agência.
          </p>

          <div className="bg-white border border-[#E5E9F0] rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-bold text-[#0A1A3C] text-base">
                  Fluxo de Recuperação de Senha (Resend API)
                </h5>
                <p className="text-xs text-slate-500">
                  Como recuperar a senha caso você ou algum agente esqueça o acesso:
                </p>
              </div>
            </div>

            <ol className="space-y-2.5 text-xs text-slate-700 list-decimal list-inside pl-1">
              <li>
                Acesse a tela de login (<code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800">/login</code>) e clique no link <strong>"Esqueci minha senha"</strong>.
              </li>
              <li>
                Informe o seu e-mail corporativo cadastrado (ex: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800">contato@fluxtur.com.br</code>).
              </li>
              <li>
                O sistema consulta a base interna e, se o e-mail existir, despacha uma chamada HTTP para a API REST do <strong>Resend</strong>.
              </li>
              <li>
                Você receberá um e-mail com o link de recuperação. O token gerado tem validade estrita de <strong>30 minutos</strong> por segurança.
              </li>
              <li>
                Ao clicar no link recebido, crie uma nova senha de no mínimo 8 caracteres e confirme. O acesso é liberado imediatamente.
              </li>
            </ol>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900">
                <strong className="font-bold">E-mails não cadastrados:</strong> Por medida de segurança (prevenção contra ataques de enumeração), se alguém digitar um e-mail não existente, o sistema não dispara mensagem de erro detalhada para fora.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <UserCheck className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700">
                <strong className="font-bold">Credenciais Padrão:</strong> No deploy inicial ou bancos zerados, as contas de administrador oficial e pessoal são injetadas automaticamente pelo seed de inicialização do backend.
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "faq",
      badge: "FAQ",
      title: "Perguntas Frequentes e Dúvidas Rápidas",
      icon: HelpCircle,
      summary: "Respostas diretas para as situações e dúvidas operacionais mais comuns do dia a dia.",
      keywords: ["faq", "dúvidas", "perguntas", "validade", "editar", "aplicativo", "pdf", "impressão"],
      content: (
        <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
          <div className="bg-white border border-[#E5E9F0] p-4 rounded-xl">
            <h6 className="font-bold text-[#0A1A3C] text-sm mb-1.5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0A1A3C]"></span>
              Preciso cadastrar o hotel antes de criar uma proposta?
            </h6>
            <p className="text-xs text-slate-600">
              Não! Esse é o grande diferencial do Fluxtur. Basta preencher o nome e foto do hotel na própria tela de criação da proposta com a caixinha <strong>"Salvar no catálogo rápido"</strong> marcada. O sistema cadastra o hotel automaticamente para você e já o deixa disponível para todos os próximos atendimentos.
            </p>
          </div>

          <div className="bg-white border border-[#E5E9F0] p-4 rounded-xl">
            <h6 className="font-bold text-[#0A1A3C] text-sm mb-1.5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0A1A3C]"></span>
              Por que a aba de Pacotes Base está como "Em Produção"?
            </h6>
            <p className="text-xs text-slate-600">
              Porque o dia a dia da agência exige personalização sob medida (datas específicas de cada passageiro, voos com horários diferentes e quantidade de noites customizadas). A cotação direta puxando o Hotel é muito mais rápida e flexível. O módulo de pacotes pré-formatados será liberado para campanhas promocionais de grupo.
            </p>
          </div>

          <div className="bg-white border border-[#E5E9F0] p-4 rounded-xl">
            <h6 className="font-bold text-[#0A1A3C] text-sm mb-1.5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0A1A3C]"></span>
              O cliente precisa baixar algum aplicativo ou criar login?
            </h6>
            <p className="text-xs text-slate-600">
              Não. A proposta abre em qualquer navegador (Chrome, Safari, Edge) diretamente pelo link seguro enviado no WhatsApp. O cliente não precisa preencher cadastro, lembrar senhas nem fazer download de apps pesados.
            </p>
          </div>

          <div className="bg-white border border-[#E5E9F0] p-4 rounded-xl">
            <h6 className="font-bold text-[#0A1A3C] text-sm mb-1.5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0A1A3C]"></span>
              O que acontece quando o orçamento passa da data de validade?
            </h6>
            <p className="text-xs text-slate-600">
              A página exibe um aviso de que a cotação expirou devido à flutuação de tarifas de hotel e aéreo. O botão de contato direto pelo WhatsApp continua disponível para que o cliente peça uma revalidação instantânea ao agente.
            </p>
          </div>

          <div className="bg-white border border-[#E5E9F0] p-4 rounded-xl">
            <h6 className="font-bold text-[#0A1A3C] text-sm mb-1.5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0A1A3C]"></span>
              Posso alterar preços ou dados depois que o link já foi enviado?
            </h6>
            <p className="text-xs text-slate-600">
              Sim! Basta ir em <strong>Orçamentos</strong> no painel administrativo, clicar em <strong>Editar</strong> e salvar. O mesmo link que o cliente já possui no WhatsApp será atualizado imediatamente.
            </p>
          </div>

          <div className="bg-white border border-[#E5E9F0] p-4 rounded-xl">
            <h6 className="font-bold text-[#0A1A3C] text-sm mb-1.5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0A1A3C]"></span>
              Como imprimir ou salvar este manual em PDF?
            </h6>
            <p className="text-xs text-slate-600">
              Basta clicar no botão <strong>"Imprimir Manual"</strong> localizado no cabeçalho desta página (ou pressionar Ctrl+P / Cmd+P). Os elementos da barra lateral e navegação serão ocultados automaticamente, gerando uma versão limpa para leitura.
            </p>
          </div>
        </div>
      ),
    },
  ];

  const filteredSections = useMemo(() => {
    if (!searchTerm.trim()) {
      if (activeTab === "todos") return sections;
      return sections.filter((s) => s.id === activeTab);
    }

    const term = searchTerm.toLowerCase();
    return sections.filter((s) => {
      const matchTitle = s.title.toLowerCase().includes(term);
      const matchBadge = s.badge.toLowerCase().includes(term);
      const matchSummary = s.summary.toLowerCase().includes(term);
      const matchKeyword = s.keywords.some((k) => k.toLowerCase().includes(term));
      return matchTitle || matchBadge || matchSummary || matchKeyword;
    });
  }, [searchTerm, activeTab]);

  return (
    <div className="min-h-screen bg-[#F5F7FB] p-4 sm:p-6 lg:p-8">
      {/* CABEÇALHO DO MANUAL */}
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-[#FFFFFF] border border-[#E5E9F0] rounded-xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5E9F0] pb-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A1A3C] text-[#5EA8FF] text-xs font-bold tracking-wide">
                <BookOpen className="w-3.5 h-3.5" />
                CENTRAL DE CONHECIMENTO FLUXTUR
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A1A3C] tracking-tight">
                Central de Ajuda e Manual de Operação
              </h1>
              <p className="text-sm text-slate-600 max-w-2xl">
                Guia completo e descomplicado para agentes de viagens e administradores operarem propostas digitais interativas com alto padrão executivo.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 print:hidden">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E5E9F0] hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer"
                title="Imprimir ou Salvar em PDF"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span className="hidden sm:inline">Imprimir Manual</span>
              </button>

              <Link
                href="/admin/orcamentos/novo"
                className="flex items-center gap-2 px-4 py-2.5 bg-[#0A1A3C] hover:bg-[#122A5C] text-white rounded-lg text-xs font-bold transition-all shadow-xs"
              >
                <Send className="w-3.5 h-3.5 text-[#5EA8FF]" />
                <span>Nova Proposta</span>
              </Link>
            </div>
          </div>

          {/* BARRA DE PESQUISA LOCAL */}
          <div className="pt-6 print:hidden">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Pesquisar por tópicos (ex: voo, whatsapp, aprovação, resend, orçamento, taxas, token)..."
                className="w-full pl-12 pr-4 py-3 bg-[#F8FAFC] border border-[#E5E9F0] rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0A1A3C] focus:bg-white transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 px-2 py-1"
                >
                  Limpar
                </button>
              )}
            </div>

            {/* ÍNDICE RÁPIDO / TABS */}
            <div className="flex items-center justify-between gap-2 mt-4 flex-wrap">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                <button
                  onClick={() => { setActiveTab("todos"); setSearchTerm(""); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === "todos" && !searchTerm
                      ? "bg-[#0A1A3C] text-white shadow-2xs"
                      : "bg-[#F8FAFC] text-slate-600 hover:bg-slate-200 border border-[#E5E9F0]"
                  }`}
                >
                  Todos os Módulos
                </button>
                {sections.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => { setActiveTab(sec.id); setSearchTerm(""); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === sec.id && !searchTerm
                        ? "bg-[#0A1A3C] text-white shadow-2xs"
                        : "bg-[#F8FAFC] text-slate-600 hover:bg-slate-200 border border-[#E5E9F0]"
                    }`}
                  >
                    {sec.badge}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0">
                <button
                  onClick={expandAll}
                  className="hover:text-[#0A1A3C] font-semibold cursor-pointer"
                >
                  Expandir Tudo
                </button>
                <span>•</span>
                <button
                  onClick={collapseAll}
                  className="hover:text-[#0A1A3C] font-semibold cursor-pointer"
                >
                  Recolher Tudo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* LISTAGEM DE MÓDULOS E CARDS */}
        <div className="space-y-4">
          {filteredSections.length === 0 ? (
            <div className="bg-white border border-[#E5E9F0] rounded-xl p-12 text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                Nenhum tópico encontrado para "{searchTerm}"
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Tente buscar por termos mais simples como "voo", "orçamento", "whatsapp", "hotel" ou "senha".
              </p>
              <button
                onClick={() => setSearchTerm("")}
                className="mt-2 px-4 py-2 bg-[#0A1A3C] text-white rounded-lg text-xs font-bold hover:bg-[#122A5C] transition-all cursor-pointer"
              >
                Limpar Pesquisa
              </button>
            </div>
          ) : (
            filteredSections.map((sec) => {
              const isOpen = openSections[sec.id] !== false;
              const IconComponent = sec.icon;

              return (
                <div
                  key={sec.id}
                  id={sec.id}
                  className="bg-[#FFFFFF] border border-[#E5E9F0] rounded-xl overflow-hidden shadow-xs transition-all duration-200"
                >
                  {/* CABEÇALHO DO CARD (ACCORDION TRIGGER) */}
                  <div
                    onClick={() => toggleSection(sec.id)}
                    className="p-5 sm:p-6 cursor-pointer flex items-center justify-between gap-4 hover:bg-[#F8FAFC] transition-colors select-none"
                  >
                    <div className="flex items-start sm:items-center gap-4 min-w-0">
                      <div className="p-3 rounded-lg bg-[#0A1A3C] text-[#5EA8FF] shrink-0 mt-0.5 sm:mt-0">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-[#0A1A3C] text-[10px] font-extrabold uppercase tracking-wider border border-slate-200">
                            {sec.badge}
                          </span>
                        </div>
                        <h2 className="text-base sm:text-lg font-bold text-[#0A1A3C] tracking-tight">
                          {sec.title}
                        </h2>
                        <p className="text-xs text-slate-500 truncate mt-0.5 max-w-2xl hidden sm:block">
                          {sec.summary}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 p-2 text-slate-400 hover:text-slate-600 transition-colors">
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-[#0A1A3C]" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </div>

                  {/* CORPO DO CARD */}
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-[#E5E9F0]/60 bg-white">
                      {sec.content}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* RODAPÉ DO MANUAL */}
        <div className="bg-[#FFFFFF] border border-[#E5E9F0] rounded-xl p-6 text-center space-y-2 print:hidden">
          <p className="text-xs text-slate-600">
            Ainda ficou com dúvidas ou precisa cadastrar novos agentes na sua agência?
          </p>
          <div className="flex items-center justify-center gap-4 text-xs font-bold text-[#0A1A3C]">
            <span>✉️ suporte@fluxtur.com.br</span>
            <span>•</span>
            <span>📞 WhatsApp Suporte Fluxtur</span>
          </div>
        </div>
      </div>
    </div>
  );
}

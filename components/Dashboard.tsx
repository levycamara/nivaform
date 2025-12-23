import React, { useState, useEffect } from 'react';
import { NivaLogo } from './Icons';
import { Download, Users, Star, UserCheck, Trash2, ArrowLeft, Database, HardDrive, Eye, X } from 'lucide-react';
import { Answers } from '../types';
import { QUESTIONS } from '../constants';
import { supabase, isSupabaseConfigured } from '../services/supabase';

interface Lead extends Answers {
  timestamp: string;
}

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [source, setSource] = useState<'local' | 'cloud'>('local');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // 1. Try fetching from Supabase
      if (isSupabaseConfigured()) {
        try {
          const { data, error } = await supabase
            .from('leads')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (!error && data) {
            setLeads(data.map((item: any) => ({
              ...item.full_json, // Unwrap JSON data containing all answers
              timestamp: item.created_at
            })));
            setSource('cloud');
            return;
          }
        } catch (e) {
          console.error("Supabase fetch failed", e);
        }
      }

      // 2. Fallback to Local Storage
      const saved = localStorage.getItem('niva_responses');
      if (saved) {
        try {
          setLeads(JSON.parse(saved).reverse());
          setSource('local');
        } catch (e) {
          console.error("Failed to parse local leads", e);
        }
      }
    };

    fetchData();
  }, []);

  const downloadCSV = () => {
    if (leads.length === 0) return;

    const allKeys = new Set<string>();
    leads.forEach(lead => {
      Object.keys(lead).forEach(key => allKeys.add(key));
    });

    const priorityHeaders = ['name', 'whatsapp', 'email', 'niva_interest', 'timestamp'];
    
    const sortedHeaders = Array.from(allKeys).sort((a, b) => {
      const indexA = priorityHeaders.indexOf(a);
      const indexB = priorityHeaders.indexOf(b);
      
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return a.localeCompare(b);
    });

    const csvContent = [
      sortedHeaders.join(','),
      ...leads.map(lead => {
        return sortedHeaders.map(header => {
          const value = lead[header as keyof Lead];
          if (value === undefined || value === null) return '""';
          if (Array.isArray(value)) return `"${value.join('; ')}"`;
          return `"${String(value).replace(/"/g, '""')}"`;
        }).join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `leads_niva_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearData = async () => {
    if (confirm('Tem certeza? Esta ação depende da fonte dos dados.')) {
      if (source === 'local') {
        localStorage.removeItem('niva_responses');
        setLeads([]);
      } else {
        alert('A limpeza de dados do banco de dados deve ser feita via painel do Supabase para segurança.');
      }
    }
  };

  const totalLeads = leads.length;
  const highIntent = leads.filter(l => l.niva_interest === 'com_certeza' || l.niva_interest === 'provavelmente').length;
  const conversionRate = totalLeads > 0 ? Math.round((highIntent / totalLeads) * 100) : 0;

  // Helper to format answer
  const formatAnswer = (val: string | string[] | undefined) => {
    if (!val) return <span className="text-zinc-600 italic">Não respondido</span>;
    if (Array.isArray(val)) return val.join(', ').replace(/_/g, ' ');
    return val.replace(/_/g, ' ');
  };

  const getInterestColor = (interest: string | string[] | undefined) => {
    if (interest === 'com_certeza') return 'bg-green-900/40 text-green-400 border-green-900';
    if (interest === 'provavelmente') return 'bg-blue-900/40 text-blue-400 border-blue-900';
    return 'bg-zinc-800 text-zinc-500 border-zinc-700';
  };

  const getInterestLabel = (interest: string | string[] | undefined) => {
    if (typeof interest === 'string') return interest.replace(/_/g, ' ');
    return '-';
  };

  return (
    // FIX: h-screen overflow-y-auto ensures scrolling works even if body is fixed
    <div className="h-screen w-full bg-niva-bg text-niva-text font-sans selection:bg-niva-highlight selection:text-black relative overflow-y-auto overflow-x-hidden">
      
      {/* Header */}
      <header className="border-b border-zinc-800 bg-niva-surface/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <NivaLogo className="w-8 h-8 rounded-lg" />
             <span className="font-bold text-xl tracking-tight hidden sm:inline">Niva <span className="text-niva-muted font-normal text-sm ml-1">Dashboard</span></span>
             <span className="font-bold text-xl tracking-tight sm:hidden">Niva</span>
          </div>
          <div className="flex items-center gap-3">
            <div className={`hidden sm:flex items-center gap-2 text-xs px-2 py-1 rounded border ${source === 'cloud' ? 'border-green-800 text-green-500 bg-green-900/20' : 'border-zinc-700 text-zinc-500 bg-zinc-800'}`}>
              {source === 'cloud' ? <Database className="w-3 h-3" /> : <HardDrive className="w-3 h-3" />}
              {source === 'cloud' ? 'Cloud' : 'Local'}
            </div>
             <button 
               onClick={() => window.location.hash = ''} 
               className="text-sm text-zinc-400 hover:text-white flex items-center gap-1 bg-zinc-800/50 px-3 py-1.5 rounded-lg sm:bg-transparent sm:px-0 sm:py-0"
             >
               <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Voltar ao Form</span> <span className="sm:hidden">Voltar</span>
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-niva-surface border border-zinc-800 p-5 rounded-xl relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-zinc-400 text-sm font-medium mb-1">Total de Respostas</p>
                <p className="text-3xl font-bold text-white">{totalLeads}</p>
              </div>
              <div className="p-2 bg-zinc-800 rounded-lg text-niva-highlight">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="bg-niva-surface border border-zinc-800 p-5 rounded-xl relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                 <p className="text-zinc-400 text-sm font-medium mb-1">Alta Intenção</p>
                 <p className="text-3xl font-bold text-white">{highIntent}</p>
              </div>
              <div className="p-2 bg-zinc-800 rounded-lg text-niva-highlight">
                <Star className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="bg-niva-surface border border-zinc-800 p-5 rounded-xl relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                 <p className="text-zinc-400 text-sm font-medium mb-1">Taxa de Aceitação</p>
                 <p className="text-3xl font-bold text-white">{conversionRate}%</p>
              </div>
              <div className="p-2 bg-zinc-800 rounded-lg text-niva-highlight">
                <UserCheck className="w-5 h-5" />
              </div>
            </div>
             <div className="w-full bg-zinc-800 h-1 mt-3 rounded-full overflow-hidden">
               <div className="h-full bg-niva-highlight" style={{ width: `${conversionRate}%` }}></div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl font-bold">Leads Recentes</h2>
          <div className="flex w-full sm:w-auto gap-3">
             {source === 'local' && (
               <button 
                 onClick={clearData}
                 className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-950/30 rounded-lg border border-zinc-800 hover:border-red-900 transition-colors"
               >
                 <Trash2 className="w-4 h-4" /> Limpar
               </button>
             )}
             <button 
               onClick={downloadCSV}
               className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold bg-niva-highlight text-black rounded-lg hover:bg-white transition-colors shadow-[0_0_15px_rgba(251,105,0,0.3)]"
             >
               <Download className="w-4 h-4" /> Exportar CSV
             </button>
          </div>
        </div>

        {/* MOBILE VIEW: Cards */}
        <div className="flex flex-col gap-4 md:hidden">
            {leads.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 bg-niva-surface border border-zinc-800 rounded-xl">
                    Nenhum dado coletado ainda.
                </div>
            ) : (
                leads.map((lead, i) => (
                    <div key={i} className="bg-niva-surface border border-zinc-800 rounded-xl p-5 flex flex-col gap-4 shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-white text-lg leading-tight">{lead.name || 'Sem nome'}</h3>
                                <p className="text-zinc-500 text-xs mt-1">
                                    {new Date(lead.timestamp).toLocaleDateString('pt-BR')} às {new Date(lead.timestamp).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                                </p>
                            </div>
                            <button 
                              onClick={() => setSelectedLead(lead)}
                              className="p-2.5 bg-zinc-800 rounded-lg text-zinc-400 active:text-black active:bg-niva-highlight transition-all"
                            >
                                <Eye className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                             <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase border ${getInterestColor(lead.niva_interest)}`}>
                                {getInterestLabel(lead.niva_interest)}
                            </span>
                        </div>

                        <div className="space-y-1 pt-2 border-t border-zinc-800/50">
                            <div className="text-sm flex items-center justify-between">
                                <span className="text-zinc-500">WhatsApp:</span>
                                <span className="text-zinc-300 font-medium">{lead.whatsapp || '-'}</span>
                            </div>
                            <div className="text-sm flex items-center justify-between">
                                <span className="text-zinc-500">Email:</span>
                                <span className="text-zinc-300 font-medium truncate max-w-[200px] text-right">{lead.email || '-'}</span>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>

        {/* DESKTOP VIEW: Table */}
        <div className="hidden md:block bg-niva-surface border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-900/50 text-zinc-400 text-sm uppercase tracking-wider">
                  <th className="p-4 font-medium border-b border-zinc-800 w-16"></th>
                  <th className="p-4 font-medium border-b border-zinc-800">Nome</th>
                  <th className="p-4 font-medium border-b border-zinc-800">WhatsApp</th>
                  <th className="p-4 font-medium border-b border-zinc-800">Email</th>
                  <th className="p-4 font-medium border-b border-zinc-800">Interesse</th>
                  <th className="p-4 font-medium border-b border-zinc-800">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-zinc-300">
                {leads.length === 0 ? (
                   <tr>
                     <td colSpan={6} className="p-8 text-center text-zinc-500">
                       Nenhum dado coletado ainda.
                     </td>
                   </tr>
                ) : (
                  leads.map((lead, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors group">
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => setSelectedLead(lead)}
                          className="p-2 bg-zinc-800 rounded-lg text-zinc-400 hover:text-white hover:bg-niva-highlight hover:text-black transition-all"
                          title="Ver detalhes completos"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                      <td className="p-4 font-medium text-white">{lead.name || '-'}</td>
                      <td className="p-4">{lead.whatsapp || '-'}</td>
                      <td className="p-4">{lead.email || '-'}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${getInterestColor(lead.niva_interest)}`}>
                          {getInterestLabel(lead.niva_interest)}
                        </span>
                      </td>
                      <td className="p-4 text-zinc-500 text-sm">
                        {new Date(lead.timestamp).toLocaleDateString('pt-BR')} {new Date(lead.timestamp).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in-up" onClick={() => setSelectedLead(null)}>
          <div 
            className="bg-niva-surface border-t sm:border border-zinc-700 w-full max-w-2xl h-[90vh] sm:h-auto sm:max-h-[85vh] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-900/50">
              <div>
                <h3 className="text-2xl font-bold text-white">{selectedLead.name || 'Lead sem nome'}</h3>
                <p className="text-zinc-400 text-sm">Enviado em {new Date(selectedLead.timestamp).toLocaleString('pt-BR')}</p>
              </div>
              <button 
                onClick={() => setSelectedLead(null)}
                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 space-y-6 custom-scrollbar pb-20 sm:pb-6">
              {/* Profile Section */}
              <div className="space-y-4">
                <h4 className="text-niva-highlight text-sm font-bold uppercase tracking-wider mb-3">Dados de Contato</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
                    <span className="text-zinc-500 text-xs block">Email</span>
                    <span className="text-white break-all">{selectedLead.email || '-'}</span>
                  </div>
                  <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
                    <span className="text-zinc-500 text-xs block">WhatsApp</span>
                    <span className="text-white">{selectedLead.whatsapp || '-'}</span>
                  </div>
                </div>
              </div>

              {/* Answers Mapping */}
              <div className="space-y-4">
                <h4 className="text-niva-highlight text-sm font-bold uppercase tracking-wider mb-3 mt-6">Respostas do Questionário</h4>
                <div className="space-y-4">
                  {QUESTIONS
                    .filter(q => q.type !== 'WELCOME' && q.type !== 'END' && q.id !== 'name' && q.id !== 'email' && q.id !== 'whatsapp')
                    .map((question) => (
                      <div key={question.id} className="border-b border-zinc-800/50 pb-3 last:border-0">
                        <p className="text-zinc-400 text-sm mb-1">{question.title}</p>
                        <p className="text-white font-medium text-lg leading-relaxed">
                          {formatAnswer(selectedLead[question.id])}
                        </p>
                      </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-zinc-800 bg-zinc-900/50 flex justify-end">
              <button 
                onClick={() => setSelectedLead(null)}
                className="w-full sm:w-auto px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-colors text-base font-medium"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
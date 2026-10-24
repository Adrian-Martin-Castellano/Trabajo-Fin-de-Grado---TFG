import { useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Popup } from 'react-leaflet';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';
import { 
  Layers, Database, ShieldAlert, TrendingUp, Info, Eye, 
  Code2, Sparkles, MapPin, CheckCircle2, ChevronRight, GitBranch, FileText, BarChart3, PieChart
} from 'lucide-react';

import type { CensusSection, DimensionType, VisibilityType } from './types/dashboard';
import { MOCK_SECTIONS, TENERIFE_MUNICIPALITIES } from './data/mockCensusData';

export default function App() {
  const [activeDimension, setActiveDimension] = useState<DimensionType>('ECONOMIC');
  const [selectedMeasure, setSelectedMeasure] = useState<string>('rnmp');
  const [selectedView, setSelectedView] = useState<VisibilityType>('GoldStandard');
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>('Todos');
  const [activePattern, setActivePattern] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<CensusSection | null>(MOCK_SECTIONS[0]);
  const [chartType, setChartType] = useState<'bar' | 'area' | 'radar'>('bar');
  
  // Modales
  const [showSparqlModal, setShowSparqlModal] = useState<boolean>(false);
  const [showOntologyModal, setShowOntologyModal] = useState<boolean>(false);

  // Filtrado de secciones
  const filteredSections = MOCK_SECTIONS.filter(sec => {
    return selectedMunicipality === 'Todos' || sec.municipality === selectedMunicipality;
  });

  // Coloreado según la semántica de tres estados del hueco
  const getColor = (sec: CensusSection) => {
    if (sec.status === 'SuppressedData') return '#94a3b8'; // Gris: Secreto Estadístico
    if (sec.status === 'StructuralGap') return '#cbd5e1';  // Gris claro: Hueco Estructural

    const value = (sec as any)[selectedMeasure];
    if (value === null || value === undefined) return '#cbd5e1';

    if (selectedMeasure === 'rnmp') {
      if (value > 15000) return '#10b981';
      if (value > 11000) return '#3b82f6';
      if (value > 9500) return '#f59e0b';
      return '#ef4444';
    }

    if (selectedMeasure === 'pp65' || selectedMeasure === 'puc75' || selectedMeasure === 'pre80') {
      if (value > 30) return '#ef4444';
      if (value > 20) return '#f59e0b';
      return '#10b981';
    }

    return '#10b981';
  };

  const handleApplyPattern = (patternName: string) => {
    setActivePattern(patternName);
    if (patternName === 'pobreza_energetica') {
      setActiveDimension('ECONOMIC');
      setSelectedMeasure('rnmp');
    } else if (patternName === 'polarizacion') {
      setActiveDimension('ECONOMIC');
      setSelectedMeasure('gini');
    }
  };

  // Datos normalizados para el gráfico de Radar Multidimensional de la sección elegida
  const radarData = selectedSection ? [
    { subject: 'Renta (RNMP)', A: Math.min(100, ((selectedSection.rnmp || 0) / 20000) * 100), fullMark: 100 },
    { subject: 'Desigualdad (Gini)', A: Math.min(100, ((selectedSection.gini || 0) / 50) * 100), fullMark: 100 },
    { subject: 'Pobreza (PUC75)', A: Math.min(100, (selectedSection.puc75 || 0) * 2), fullMark: 100 },
    { subject: 'Envejecimiento (PP65)', A: Math.min(100, (selectedSection.pp65 || 0) * 2), fullMark: 100 },
    { subject: 'Parque Pre-80', A: Math.min(100, selectedSection.pre80 || 0), fullMark: 100 },
  ] : [];

  // Consulta SPARQL dinámica
  const sparqlProvQuery = `PREFIX qb: <http://purl.org/linked-data/cube#>
PREFIX semvo: <https://w3id.org/ontologies-ULL/semvo#>
PREFIX prov: <http://www.w3.org/ns/prov#>

SELECT ?sourceDataset ?sourceObs ?value ?status WHERE {
  ?consObs qb:dataSet ds:${selectedView === 'GoldStandard' ? 'consolidated-gold' : 'consolidated-user-view'} ;
           semvo:refArea <https://w3id.org/ontologies-ULL/semvo/data/section/2023-${selectedSection?.id}> ;
           qb:measureType semvo:${selectedMeasure.toUpperCase()} ;
           prov:wasDerivedFrom ?sourceObs .

  ?sourceObs qb:dataSet ?sourceDataset ;
             semvo:${selectedMeasure} ?value .
  OPTIONAL { ?sourceObs semvo:observationStatus ?status }
}`;

  return (
    <div className="w-screen h-screen flex flex-col bg-slate-950 overflow-hidden font-sans text-slate-100">
      
      {/* HEADER SUPERIOR */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between shrink-0 z-20 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg shadow-lg">
            <Layers className="text-white h-5 w-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              AdaPTa-Islas
              <span className="bg-blue-500/10 text-blue-400 text-[10px] px-2 py-0.5 rounded-full border border-blue-500/20 font-semibold">
                Ontología SEMVO v0.2.0
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">Cuadro de Mandos de Multi-Vulnerabilidad Socioeconómica (TFG - Universidad de La Laguna)</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSparqlModal(true)}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-md border border-slate-700 transition shadow-sm"
          >
            <Code2 className="h-3.5 w-3.5 text-blue-400" />
            <span>Trazabilidad PROV-O</span>
          </button>
          <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-800 px-3 py-1.5 rounded-md text-xs text-emerald-300 shadow-sm">
            <Database className="h-3.5 w-3.5 text-emerald-400" />
            <span>Endpoint: <strong>ds:consolidated-gold</strong></span>
          </div>
        </div>
      </header>

      {/* ÁREA DE TRABAJO */}
      <div className="flex-1 flex min-h-0 relative">
        
        {/* PANEL LATERAL DE CONTROLES */}
        <aside className="w-80 bg-slate-900/95 border-r border-slate-800 p-4 flex flex-col justify-between shrink-0 overflow-y-auto space-y-4 shadow-2xl backdrop-blur-md">
          <div className="space-y-4">
            
            {/* 1. SELECCIÓN DE CAPA DE INTEGRACIÓN */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 shadow-inner">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center justify-between">
                <span>Capa de Integración / Vista</span>
                <GitBranch className="h-3.5 w-3.5 text-blue-400" />
              </label>
              <div className="space-y-1.5">
                <button
                  onClick={() => setSelectedView('GoldStandard')}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-semibold transition flex items-center justify-between ${
                    selectedView === 'GoldStandard'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> Gold Standard (Oficial)</span>
                  <span className="text-[9px] bg-blue-900 px-1.5 py-0.5 rounded font-mono">Gold</span>
                </button>
                <button
                  onClick={() => setSelectedView('SharedView')}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-semibold transition flex items-center justify-between ${
                    selectedView === 'SharedView'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5" /> Vista Compartida ISTAC</span>
                  <span className="text-[9px] bg-slate-800 px-1.5 py-0.5 rounded font-mono">Shared</span>
                </button>
              </div>
            </div>

            {/* 2. ÁMBITO TERRITORIAL */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-emerald-400" /> Filtro Territorial
              </label>
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Municipio (Tenerife)</span>
                <select
                  value={selectedMunicipality}
                  onChange={(e) => setSelectedMunicipality(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-2 font-medium focus:outline-none focus:border-blue-500 shadow-sm"
                >
                  {TENERIFE_MUNICIPALITIES.map(muni => (
                    <option key={muni} value={muni}>{muni}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 3. SELECCIÓN DE DIMENSIONES Y MEDIDAS */}
            <div>
              <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Dimensiones del Cubo (SEMVO)
              </h2>
              
              <div className="grid grid-cols-3 gap-1 mb-2 bg-slate-950 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => { setActiveDimension('ECONOMIC'); setSelectedMeasure('rnmp'); }}
                  className={`py-1.5 text-[10px] font-bold rounded-md transition ${activeDimension === 'ECONOMIC' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Económica
                </button>
                <button
                  onClick={() => { setActiveDimension('DEMOGRAPHIC'); setSelectedMeasure('pp65'); }}
                  className={`py-1.5 text-[10px] font-bold rounded-md transition ${activeDimension === 'DEMOGRAPHIC' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Demográfica
                </button>
                <button
                  onClick={() => { setActiveDimension('BUILDING'); setSelectedMeasure('pre80'); }}
                  className={`py-1.5 text-[10px] font-bold rounded-md transition ${activeDimension === 'BUILDING' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Edificatoria
                </button>
              </div>

              <div className="space-y-1.5">
                {activeDimension === 'ECONOMIC' && (
                  <>
                    <button onClick={() => setSelectedMeasure('rnmp')} className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex justify-between transition ${selectedMeasure === 'rnmp' ? 'bg-blue-600 text-white shadow' : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'}`}>
                      <span>Renta Neta Media (RNMP)</span> <span className="text-[10px] opacity-70">€/año</span>
                    </button>
                    <button onClick={() => setSelectedMeasure('gini')} className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex justify-between transition ${selectedMeasure === 'gini' ? 'bg-blue-600 text-white shadow' : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'}`}>
                      <span>Índice de Gini (GINI)</span> <span className="text-[10px] opacity-70">Desigualdad</span>
                    </button>
                    <button onClick={() => setSelectedMeasure('puc75')} className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex justify-between transition ${selectedMeasure === 'puc75' ? 'bg-blue-600 text-white shadow' : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'}`}>
                      <span>Pobreza Umbral 75% (PUC75)</span> <span className="text-[10px] opacity-70">%</span>
                    </button>
                  </>
                )}

                {activeDimension === 'DEMOGRAPHIC' && (
                  <>
                    <button onClick={() => setSelectedMeasure('pp65')} className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex justify-between transition ${selectedMeasure === 'pp65' ? 'bg-blue-600 text-white shadow' : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'}`}>
                      <span>Población &gt; 65 años (PP65)</span> <span className="text-[10px] opacity-70">% Envejec.</span>
                    </button>
                    <button onClick={() => setSelectedMeasure('pp18')} className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex justify-between transition ${selectedMeasure === 'pp18' ? 'bg-blue-600 text-white shadow' : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'}`}>
                      <span>Población &lt; 18 años (PP18)</span> <span className="text-[10px] opacity-70">% Juventud</span>
                    </button>
                    <button onClick={() => setSelectedMeasure('phu')} className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex justify-between transition ${selectedMeasure === 'phu' ? 'bg-blue-600 text-white shadow' : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'}`}>
                      <span>Hogares Unipersonales (PHU)</span> <span className="text-[10px] opacity-70">% Aislam.</span>
                    </button>
                  </>
                )}

                {activeDimension === 'BUILDING' && (
                  <>
                    <button onClick={() => setSelectedMeasure('pre80')} className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex justify-between transition ${selectedMeasure === 'pre80' ? 'bg-blue-600 text-white shadow' : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'}`}>
                      <span>Edificios Pre-1980 (Pre-80)</span> <span className="text-[10px] opacity-70">% Obsoles.</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* 4. PATRONES MULTIDIMENSIONALES */}
            <div>
              <h2 className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5" /> Patrones Multidimensionales
              </h2>
              <button
                onClick={() => handleApplyPattern('pobreza_energetica')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium transition border ${
                  activePattern === 'pobreza_energetica'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold shadow'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                Pobreza Energética en la Vejez
                <span className="block text-[10px] text-slate-400 font-normal mt-0.5">RNMP + PP65 + PHU + Pre-80</span>
              </button>
            </div>

            {/* 5. LEYENDA */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <h3 className="text-[11px] font-bold text-slate-400 mb-2 uppercase">Leyenda de Estados</h3>
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Nivel Óptimo / Alto</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500"></span> Nivel Medio</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-500"></span> Vulnerabilidad Moderada</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500"></span> Vulnerabilidad Crítica</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-slate-400"></span> Secreto Estadístico (Suppressed)</div>
              </div>
            </div>

          </div>

          <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1"><Info className="h-3 w-3" /> Ontología SEMVO v0.2.0</span>
            <span className="text-slate-400 font-semibold">ULL - AdaPTa Islas</span>
          </div>
        </aside>

        {/* CONTENIDO PRINCIPAL */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-950">
          
          {/* MAPA LEAFLET */}
          <div className="flex-1 min-h-0 relative">
            <MapContainer
              center={[28.38, -16.52]}
              zoom={10}
              style={{ width: '100%', height: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filteredSections.map((sec) => (
                <GeoJSON
                  key={sec.id}
                  data={sec.geometry}
                  style={{
                    fillColor: getColor(sec),
                    weight: 2,
                    opacity: 1,
                    color: selectedSection?.id === sec.id ? '#3b82f6' : 'white',
                    fillOpacity: 0.75
                  }}
                  eventHandlers={{
                    click: () => setSelectedSection(sec)
                  }}
                >
                  <Popup>
                    <div className="p-2 text-xs text-slate-900 min-w-[200px]">
                      <p className="font-bold text-sm border-b pb-1 mb-1">{sec.name}</p>
                      <p><strong>CUSEC:</strong> {sec.id}</p>
                      <p><strong>primaryPropertyUse:</strong> {sec.primaryPropertyUse}</p>
                      {sec.status === 'SuppressedData' ? (
                        <p className="text-red-600 mt-2 flex items-center gap-1 font-bold bg-red-50 p-1.5 rounded border border-red-200">
                          <ShieldAlert className="h-4 w-4 shrink-0" /> Secreto Estadístico (INE)
                        </p>
                      ) : (
                        <div className="mt-2 bg-slate-100 p-2 rounded border border-slate-200 font-medium">
                          <span className="block text-[10px] text-slate-500 uppercase">{selectedMeasure}</span>
                          <span className="text-sm font-bold text-slate-800">
                            {selectedMeasure === 'rnmp' ? `${(sec as any)[selectedMeasure]?.toLocaleString()} €` : (sec as any)[selectedMeasure]}
                          </span>
                        </div>
                      )}
                    </div>
                  </Popup>
                </GeoJSON>
              ))}
            </MapContainer>
          </div>

          {/* PANEL INFERIOR: ESTADÍSTICAS Y BOTÓN FICHA ONTOLÓGICA */}
          <footer className="h-64 bg-slate-900 border-t border-slate-800 p-4 flex gap-6 shrink-0 z-10 shadow-2xl">
            {selectedSection ? (
              <>
                <div className="w-80 shrink-0 space-y-2 border-r border-slate-800 pr-5 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-slate-200 font-bold text-xs">
                      <span className="flex items-center gap-1.5"><Eye className="h-4 w-4 text-blue-400" /> Sección Seleccionada</span>
                      <span className="text-[10px] bg-blue-900/50 text-blue-300 px-1.5 py-0.5 rounded border border-blue-700/50">{selectedSection.id}</span>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs text-slate-300">
                      <p><strong>Ubicación:</strong> {selectedSection.island} <ChevronRight className="inline h-3 w-3 text-slate-500" /> {selectedSection.municipality}</p>
                      <p><strong>Dimensión DSD:</strong> <code className="text-emerald-400 font-mono">{selectedSection.primaryPropertyUse}</code></p>
                      <p><strong>Uso Catastral:</strong> <span className="text-amber-400 font-medium">{selectedSection.catUso}</span></p>
                      <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-slate-100 font-semibold">
                        <div>
                          <span className="block text-[10px] text-slate-400 font-normal">RNMP</span>
                          {selectedSection.rnmp ? `${selectedSection.rnmp.toLocaleString()} €` : 'N/D'}
                        </div>
                        <div>
                          <span className="block text-[10px] text-slate-400 font-normal">% Pre-80</span>
                          {selectedSection.pre80 ? `${selectedSection.pre80} %` : 'N/D'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* BOTÓN PARA ABRIR LA FICHA ONTOLÓGICA COMPLETA */}
                  <button
                    onClick={() => setShowOntologyModal(true)}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-2 shadow-md transition"
                  >
                    <FileText className="h-4 w-4" /> Ver Ficha Ontológica Completa
                  </button>
                </div>

                {/* GRÁFICAS RECHARTS INTERACTIVAS CON PESTAÑAS DE TIPO DE GRÁFICO */}
                <div className="flex-1 flex flex-col min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-slate-300">
                      Análisis Visual de {selectedMeasure.toUpperCase()} ({selectedMunicipality === 'Todos' ? 'Tenerife Completo' : selectedMunicipality})
                    </h4>
                    
                    {/* Selector de Tipo de Gráfico */}
                    <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                      <button
                        onClick={() => setChartType('bar')}
                        className={`p-1 rounded ${chartType === 'bar' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        title="Gráfico de Barras"
                      >
                        <BarChart3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setChartType('area')}
                        className={`p-1 rounded ${chartType === 'area' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        title="Gráfico de Área"
                      >
                        <PieChart className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setChartType('radar')}
                        className={`p-1 rounded ${chartType === 'radar' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        title="Radar Multidimensional"
                      >
                        <TrendingUp className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      {chartType === 'bar' ? (
                        <BarChart data={filteredSections}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                          <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#94a3b8' }} interval={0} />
                          <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', fontSize: '11px' }} />
                          <Bar dataKey={selectedMeasure} name={selectedMeasure.toUpperCase()} radius={[4, 4, 0, 0]}>
                            {filteredSections.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={getColor(entry)}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      ) : chartType === 'area' ? (
                        <AreaChart data={filteredSections}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                          <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#94a3b8' }} />
                          <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', fontSize: '11px' }} />
                          <Area type="monotone" dataKey={selectedMeasure} stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                        </AreaChart>
                      ) : (
                        <RadarChart data={radarData}>
                          <PolarGrid stroke="#334155" />
                          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8, fill: '#64748b' }} />
                          <Radar name="Vulnerabilidad (%)" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                        </RadarChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-xs text-slate-500">
                Selecciona una sección censal en el mapa para inspeccionar sus datos.
              </div>
            )}
          </footer>

        </div>

      </div>

      {/* MODAL 1: CONSULTA SPARQL DE TRAZABILIDAD (CORREGIDO EL BUG DEL Z-INDEX) */}
      {showSparqlModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[9999] p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-150">
            <div className="bg-slate-950 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <Code2 className="h-4 w-4 text-blue-400" /> Consulta SPARQL de Trazabilidad PROV-O
              </h3>
              <button onClick={() => setShowSparqlModal(false)} className="text-slate-400 hover:text-white text-xs font-bold p-1">✕</button>
            </div>
            <div className="p-5">
              <pre className="bg-slate-950 p-4 rounded-lg text-emerald-400 text-xs font-mono border border-slate-800 overflow-x-auto leading-relaxed">
                {sparqlProvQuery}
              </pre>
            </div>
            <div className="bg-slate-950 px-5 py-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowSparqlModal(false)}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-4 py-2 rounded-lg font-semibold shadow"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: FICHA ONTOLÓGICA DETALLADA DE LA SECCIÓN (CORREGIDO EL BUG DEL Z-INDEX) */}
      {showOntologyModal && selectedSection && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[9999] p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-150 flex flex-col max-h-[85vh]">
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600/20 p-2 rounded-lg border border-blue-500/30">
                  <FileText className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{selectedSection.name}</h3>
                  <p className="text-xs text-slate-400">Ficha Técnica Ontológica SEMVO | CUSEC: {selectedSection.id}</p>
                </div>
              </div>
              <button onClick={() => setShowOntologyModal(false)} className="text-slate-400 hover:text-white text-xs font-bold p-1">✕</button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300">
              
              {/* BLOQUE 1: METADATOS SKOS / DATA CUBE */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-slate-200 border-b border-slate-800 pb-1 text-xs flex items-center gap-1.5">
                    <Database className="h-3.5 w-3.5 text-blue-400" /> Estructura RDF Data Cube
                  </h4>
                  <p><strong>IRI Sección:</strong> <code className="text-blue-400">semvo:section-2023-{selectedSection.id}</code></p>
                  <p><strong>Añada (Vintage):</strong> 2023</p>
                  <p><strong>Dimensión Uso:</strong> <code className="text-emerald-400">{selectedSection.primaryPropertyUse}</code></p>
                  <p><strong>Estado Datos:</strong> <span className="text-emerald-400 font-semibold">{selectedSection.status}</span></p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-slate-200 border-b border-slate-800 pb-1 text-xs flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Componente IPCC AR6
                  </h4>
                  <p><strong>Asociación:</strong> <span className="text-amber-300 font-medium">Sensibilidad &amp; Capacidad Adaptativa</span></p>
                  <p><strong>Dirección Efecto:</strong> Aumenta Vulnerabilidad (Económica/Edificatoria)</p>
                  <p><strong>Unidad QUDT:</strong> <code className="text-amber-400">unit:EuroPerYear / unit:Percent</code></p>
                </div>
              </div>

              {/* BLOQUE 2: VALORES DE TODAS LAS MEDIDAS DE LA SECCIÓN */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="font-bold text-slate-200 border-b border-slate-800 pb-2 text-xs">
                  Valores Consolidados por Medida (semvo:MeasureProperty)
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <span className="block text-[10px] text-slate-400">RNMP (Renta Neta)</span>
                    <span className="text-sm font-bold text-emerald-400">{selectedSection.rnmp ? `${selectedSection.rnmp.toLocaleString()} €` : 'N/D'}</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <span className="block text-[10px] text-slate-400">GINI (Desigualdad)</span>
                    <span className="text-sm font-bold text-blue-400">{selectedSection.gini || 'N/D'}</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <span className="block text-[10px] text-slate-400">PUC75 (Pobreza)</span>
                    <span className="text-sm font-bold text-amber-400">{selectedSection.puc75 ? `${selectedSection.puc75} %` : 'N/D'}</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <span className="block text-[10px] text-slate-400">PP65 (Envejecimiento)</span>
                    <span className="text-sm font-bold text-amber-400">{selectedSection.pp65 ? `${selectedSection.pp65} %` : 'N/D'}</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <span className="block text-[10px] text-slate-400">PHU (Aislamiento)</span>
                    <span className="text-sm font-bold text-blue-400">{selectedSection.phu ? `${selectedSection.phu} %` : 'N/D'}</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <span className="block text-[10px] text-slate-400">Pre-80 (Antigüedad)</span>
                    <span className="text-sm font-bold text-red-400">{selectedSection.pre80 ? `${selectedSection.pre80} %` : 'N/D'}</span>
                  </div>
                </div>
              </div>

              {/* BLOQUE 3: TRIPLETA PROV-O BRUTA */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 font-mono text-[11px]">
                <h4 className="font-bold text-slate-200 border-b border-slate-800 pb-1 text-xs font-sans">
                  Grafo RDF (Turtle)
                </h4>
                <p className="text-emerald-400">
                  semvo:obs-{selectedSection.id}-2023 a qb:Observation ;<br />
                  &nbsp;&nbsp;qb:dataSet ds:{selectedView === 'GoldStandard' ? 'consolidated-gold' : 'consolidated-user'} ;<br />
                  &nbsp;&nbsp;semvo:refArea semvo:section-2023-{selectedSection.id} ;<br />
                  &nbsp;&nbsp;prov:wasDerivedFrom &lt;{selectedSection.provSource}&gt; .
                </p>
              </div>

            </div>

            <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex justify-end shrink-0">
              <button
                onClick={() => setShowOntologyModal(false)}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-5 py-2 rounded-xl font-semibold shadow"
              >
                Cerrar Ficha
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
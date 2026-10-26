import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, Popup, useMap } from 'react-leaflet';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';
import { 
  Layers, Database, ShieldAlert, TrendingUp, Info, Eye, 
  Code2, Sparkles, MapPin, CheckCircle2, ChevronRight, GitBranch, FileText, BarChart3, PieChart, Calendar, RefreshCw, Filter
} from 'lucide-react';

import type { CensusSection, DimensionType, VisibilityType, SourceId } from './types/dashboard';
import { MOCK_SECTIONS, TENERIFE_MUNICIPALITIES } from './data/mockCensusData';

// Componente para forzar el recálculo y evitar el lienzo gris en Leaflet
function MapResizeHandler() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

export default function App() {
  const [activeDimension, setActiveDimension] = useState<DimensionType>('ECONOMIC');
  const [selectedMeasure, setSelectedMeasure] = useState<string>('rnmp');
  const [selectedView, setSelectedView] = useState<VisibilityType>('GoldStandard');
  const [selectedSource, setSelectedSource] = useState<SourceId>('ds:atlas-economic');
  const [selectedYear, setSelectedYear] = useState<number>(2023);
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>('Todos');
  const [activePattern, setActivePattern] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'bar' | 'area' | 'radar'>('bar');
  
  // Modales
  const [showSparqlModal, setShowSparqlModal] = useState<boolean>(false);
  const [showOntologyModal, setShowOntologyModal] = useState<boolean>(false);

  // FILTRADO TRIPLE: MUNICIPIO + FUENTE + AÑO
  const filteredSections = MOCK_SECTIONS.filter(sec => {
    const matchesMuni = selectedMunicipality === 'Todos' || sec.municipality === selectedMunicipality;
    const matchesSource = sec.provDataset === selectedSource;
    const matchesYear = sec.year === selectedYear;
    return matchesMuni && matchesSource && matchesYear;
  });

  // Estado para la sección seleccionada en el mapa
  const [selectedSection, setSelectedSection] = useState<CensusSection | null>(MOCK_SECTIONS[0]);

  // RE-SELECCIONAR SECCIÓN AUTOMÁTICAMENTE AL CAMBIAR FILTROS
  useEffect(() => {
    if (filteredSections.length > 0) {
      const exists = filteredSections.some(s => s.id === selectedSection?.id);
      if (!exists) {
        setSelectedSection(filteredSections[0]);
      }
    } else {
      setSelectedSection(null);
    }
  }, [selectedSource, selectedMunicipality, selectedYear]);

  // Color semántico según el valor o estado del hueco
  const getColor = (sec: CensusSection) => {
    if (sec.status === 'SuppressedData') return '#94a3b8'; // Gris: Secreto Estadístico
    if (sec.status === 'StructuralGap') return '#cbd5e1';  // Gris claro: Sin datos en esta fuente

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
    }
  };

  // Datos normalizados para el gráfico de Radar Multidimensional
  const radarData = selectedSection ? [
    { subject: 'Renta Media', A: Math.min(100, ((selectedSection.rnmp || 0) / 20000) * 100), fullMark: 100 },
    { subject: 'Desigualdad', A: Math.min(100, ((selectedSection.gini || 0) / 50) * 100), fullMark: 100 },
    { subject: 'Riesgo Pobreza', A: Math.min(100, (selectedSection.puc75 || 0) * 2), fullMark: 100 },
    { subject: 'Mayores 65', A: Math.min(100, (selectedSection.pp65 || 0) * 2), fullMark: 100 },
    { subject: 'Vivienda Antigua', A: Math.min(100, selectedSection.pre80 || 0), fullMark: 100 },
  ] : [];

  // Consulta SPARQL dinámica de trazabilidad PROV-O
  const sparqlProvQuery = `PREFIX qb: <http://purl.org/linked-data/cube#>
PREFIX semvo: <https://w3id.org/ontologies-ULL/semvo#>
PREFIX sdmx-dimension: <http://purl.org/linked-data/sdmx/2009/dimension#>
PREFIX prov: <http://www.w3.org/ns/prov#>

SELECT ?zona ?valor ?fuenteOficial WHERE {
  ?obs a qb:Observation ;
       sdmx-dimension:refArea semvo:section-${selectedYear}-${selectedSection?.id} ;
       sdmx-dimension:refPeriod <https://w3id.org/ontologies-ULL/semvo/data/period/year-${selectedYear}> ;
       qb:measureType semvo:${selectedMeasure.toUpperCase()} ;
       semvo:${selectedMeasure} ?valor ;
       qb:dataSet <https://w3id.org/ontologies-ULL/semvo/data/dataset/${selectedSource.replace('ds:', '')}> ;
       prov:wasDerivedFrom ?fuenteOficial .
}`;

  return (
    <div className="w-screen h-screen flex flex-col bg-slate-950 overflow-hidden font-sans text-slate-100">
      
      {/* HEADER */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between shrink-0 z-20 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl shadow-lg border border-blue-400/30">
            <Layers className="text-white h-5 w-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              AdaPTa-Islas
              <span className="bg-blue-500/10 text-blue-400 text-[10px] px-2.5 py-0.5 rounded-full border border-blue-500/20 font-semibold">
                Versión Final TFG
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">Panel de Análisis de Vulnerabilidad en Canarias (ULL)</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSparqlModal(true)}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition shadow-sm"
          >
            <Code2 className="h-3.5 w-3.5 text-blue-400" />
            <span>Ver Origen del Dato (SPARQL)</span>
          </button>
          <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-800 px-3 py-1.5 rounded-lg text-xs text-emerald-300 shadow-sm">
            <Database className="h-3.5 w-3.5 text-emerald-400" />
            <span>Base de datos: <strong>{selectedSource}</strong></span>
          </div>
        </div>
      </header>

      {/* ÁREA DE TRABAJO */}
      <div className="flex-1 flex min-h-0 relative">
        
        {/* PANEL LATERAL */}
        <aside className="w-80 bg-slate-900/95 border-r border-slate-800 p-4 flex flex-col justify-between shrink-0 overflow-y-auto space-y-4 shadow-2xl backdrop-blur-md">
          <div className="space-y-4">
            
            {/* VISTAS */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 shadow-inner space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block flex items-center justify-between">
                <span>Modo de Integración</span>
                <GitBranch className="h-3.5 w-3.5 text-blue-400" />
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => setSelectedView('GoldStandard')}
                  className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1 ${
                    selectedView === 'GoldStandard'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <CheckCircle2 className="h-3 w-3" /> Datos Oficiales
                </button>
                <button
                  onClick={() => setSelectedView('SharedView')}
                  className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1 ${
                    selectedView === 'SharedView'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="h-3 w-3" /> Vista ISTAC
                </button>
              </div>
            </div>

            {/* FUENTES Y AÑO */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                <RefreshCw className="h-3.5 w-3.5 text-amber-400" /> Fuente de Información
              </label>
              
              <div className="space-y-2">
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">Organismo Emisor</span>
                  <select
                    value={selectedSource}
                    onChange={(e) => setSelectedSource(e.target.value as SourceId)}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 font-medium focus:outline-none focus:border-blue-500 shadow-sm cursor-pointer"
                  >
                    <option value="ds:atlas-economic">INE - Datos Económicos</option>
                    <option value="ds:atlas-demographic">INE - Datos Poblacionales</option>
                    <option value="ds:istac-local">ISTAC - Gobierno de Canarias</option>
                    <option value="ds:cadastre-infrastructure">Catastro - Estado de Edificios</option>
                  </select>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block mb-1 flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-blue-400" /> Año del Análisis
                  </span>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 font-medium focus:outline-none focus:border-blue-500 shadow-sm cursor-pointer"
                  >
                    <option value={2023}>Año 2023 (Más Reciente)</option>
                    <option value={2022}>Año 2022</option>
                    <option value={2021}>Año 2021</option>
                  </select>
                </div>
              </div>
            </div>

            {/* MUNICIPIO */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                <Filter className="h-3.5 w-3.5 text-emerald-400" /> Filtrar por Municipio
              </label>
              <select
                value={selectedMunicipality}
                onChange={(e) => setSelectedMunicipality(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-2 font-medium focus:outline-none focus:border-blue-500 shadow-sm cursor-pointer"
              >
                {TENERIFE_MUNICIPALITIES.map(muni => (
                  <option key={muni} value={muni}>{muni}</option>
                ))}
              </select>
            </div>

            {/* DIMENSIONES DEL CUBO */}
            <div>
              <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                ¿Qué indicador quieres ver?
              </h2>
              
              <div className="grid grid-cols-3 gap-1 mb-2 bg-slate-950 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => { setActiveDimension('ECONOMIC'); setSelectedMeasure('rnmp'); }}
                  className={`py-1.5 text-[10px] font-bold rounded-md transition ${activeDimension === 'ECONOMIC' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Económico
                </button>
                <button
                  onClick={() => { setActiveDimension('DEMOGRAPHIC'); setSelectedMeasure('pp65'); }}
                  className={`py-1.5 text-[10px] font-bold rounded-md transition ${activeDimension === 'DEMOGRAPHIC' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Población
                </button>
                <button
                  onClick={() => { setActiveDimension('BUILDING'); setSelectedMeasure('pre80'); }}
                  className={`py-1.5 text-[10px] font-bold rounded-md transition ${activeDimension === 'BUILDING' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Viviendas
                </button>
              </div>

              <div className="space-y-1.5">
                {activeDimension === 'ECONOMIC' && (
                  <>
                    <button onClick={() => setSelectedMeasure('rnmp')} className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex justify-between transition ${selectedMeasure === 'rnmp' ? 'bg-blue-600 text-white shadow' : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'}`}>
                      <span>Renta Media Anual</span> <span className="text-[10px] opacity-70">€/persona</span>
                    </button>
                    <button onClick={() => setSelectedMeasure('gini')} className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex justify-between transition ${selectedMeasure === 'gini' ? 'bg-blue-600 text-white shadow' : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'}`}>
                      <span>Desigualdad Social</span> <span className="text-[10px] opacity-70">Índice Gini</span>
                    </button>
                    <button onClick={() => setSelectedMeasure('puc75')} className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex justify-between transition ${selectedMeasure === 'puc75' ? 'bg-blue-600 text-white shadow' : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'}`}>
                      <span>Población en Pobreza</span> <span className="text-[10px] opacity-70">%</span>
                    </button>
                  </>
                )}

                {activeDimension === 'DEMOGRAPHIC' && (
                  <>
                    <button onClick={() => setSelectedMeasure('pp65')} className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex justify-between transition ${selectedMeasure === 'pp65' ? 'bg-blue-600 text-white shadow' : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'}`}>
                      <span>Mayores de 65 Años</span> <span className="text-[10px] opacity-70">% Envejecimiento</span>
                    </button>
                    <button onClick={() => setSelectedMeasure('pp18')} className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex justify-between transition ${selectedMeasure === 'pp18' ? 'bg-blue-600 text-white shadow' : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'}`}>
                      <span>Jóvenes y Menores</span> <span className="text-[10px] opacity-70">% Juventud</span>
                    </button>
                    <button onClick={() => setSelectedMeasure('phu')} className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex justify-between transition ${selectedMeasure === 'phu' ? 'bg-blue-600 text-white shadow' : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'}`}>
                      <span>Personas que Viven Solas</span> <span className="text-[10px] opacity-70">% Hogar Único</span>
                    </button>
                  </>
                )}

                {activeDimension === 'BUILDING' && (
                  <>
                    <button onClick={() => setSelectedMeasure('pre80')} className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex justify-between transition ${selectedMeasure === 'pre80' ? 'bg-blue-600 text-white shadow' : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'}`}>
                      <span>Viviendas Anteriores a 1980</span> <span className="text-[10px] opacity-70">% Antigüedad</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* COMBINACIONES DE RIESGO */}
            <div>
              <h2 className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5" /> Combinaciones de Riesgo
              </h2>
              <button
                onClick={() => handleApplyPattern('pobreza_energetica')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium transition border ${
                  activePattern === 'pobreza_energetica'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold shadow'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                Riesgo de Pobreza Energética
                <span className="block text-[10px] text-slate-400 font-normal mt-0.5">Baja Renta + Ancianos + Casas Antiguas</span>
              </button>
            </div>

            {/* LEYENDA */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <h3 className="text-[11px] font-bold text-slate-400 mb-2 uppercase">Leyenda del Mapa</h3>
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Nivel Muy Bueno</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500"></span> Nivel Medio</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-500"></span> Riesgo Moderado</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500"></span> Riesgo Alto</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-slate-400"></span> Dato Oculto / No Disponible</div>
              </div>
            </div>

          </div>

          <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1"><Info className="h-3 w-3" /> Ontología SEMVO v0.2.0</span>
            <span className="text-slate-400 font-semibold">TFG - ULL</span>
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
              <MapResizeHandler />
              <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filteredSections.map((sec) => (
                <GeoJSON
                  key={`${sec.id}-${sec.provDataset}-${selectedYear}`}
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
                      <p><strong>Código Censal:</strong> {sec.id}</p>
                      <p><strong>Año del Dato:</strong> {sec.year}</p>
                      <p><strong>Fuente:</strong> {sec.provDataset}</p>
                      <p><strong>Uso de Suelo:</strong> {sec.catUso}</p>
                      {sec.status === 'SuppressedData' ? (
                        <p className="text-red-600 mt-2 flex items-center gap-1 font-bold bg-red-50 p-1.5 rounded border border-red-200">
                          <ShieldAlert className="h-4 w-4 shrink-0" /> Dato Reservado por Privacidad
                        </p>
                      ) : sec.status === 'StructuralGap' ? (
                        <p className="text-slate-600 mt-2 flex items-center gap-1 font-bold bg-slate-100 p-1.5 rounded border border-slate-300">
                          <Info className="h-4 w-4 shrink-0" /> Medida No Cubierta en esta Fuente
                        </p>
                      ) : (
                        <div className="mt-2 bg-slate-100 p-2 rounded border border-slate-200 font-medium">
                          <span className="block text-[10px] text-slate-500 uppercase">Valor Seleccionado</span>
                          <span className="text-sm font-bold text-slate-800">
                            {selectedMeasure === 'rnmp' 
                              ? `${(sec as any)[selectedMeasure] ? (sec as any)[selectedMeasure].toLocaleString() + ' €/año' : 'Sin datos'}`
                              : `${(sec as any)[selectedMeasure] ?? 'Sin datos'}`}
                          </span>
                        </div>
                      )}
                    </div>
                  </Popup>
                </GeoJSON>
              ))}
            </MapContainer>
          </div>

          {/* PANEL INFERIOR DE ESTADÍSTICAS Y GRÁFICAS */}
          <footer className="h-64 bg-slate-900 border-t border-slate-800 p-4 flex gap-6 shrink-0 z-10 shadow-2xl">
            {selectedSection ? (
              <>
                <div className="w-80 shrink-0 space-y-2 border-r border-slate-800 pr-5 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-slate-200 font-bold text-xs">
                      <span className="flex items-center gap-1.5"><Eye className="h-4 w-4 text-blue-400" /> Zona Seleccionada</span>
                      <span className="text-[10px] bg-blue-900/50 text-blue-300 px-1.5 py-0.5 rounded border border-blue-700/50">{selectedSection.id}</span>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs text-slate-300">
                      <p><strong>Municipio:</strong> {selectedSection.municipality}</p>
                      <p><strong>Fuente Activa:</strong> <code className="text-amber-400 font-mono">{selectedSource}</code></p>
                      <p><strong>Año:</strong> <span className="text-emerald-400 font-medium">{selectedYear}</span></p>
                      <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-slate-100 font-semibold">
                        <div>
                          <span className="block text-[10px] text-slate-400 font-normal">Renta Media</span>
                          {selectedSection.rnmp ? `${selectedSection.rnmp.toLocaleString()} €` : 'Sin datos'}
                        </div>
                        <div>
                          <span className="block text-[10px] text-slate-400 font-normal">Casas Antiguas</span>
                          {selectedSection.pre80 ? `${selectedSection.pre80} %` : 'Sin datos'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowOntologyModal(true)}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-2 shadow-md transition"
                  >
                    <FileText className="h-4 w-4" /> Abrir Ficha Técnica Completa
                  </button>
                </div>

                {/* GRÁFICAS */}
                <div className="flex-1 flex flex-col min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-slate-300">
                      Comparativa Visual ({filteredSections.length} zonas en {selectedYear})
                    </h4>
                    
                    <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                      <button
                        onClick={() => setChartType('bar')}
                        className={`p-1 rounded ${chartType === 'bar' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        title="Barras"
                      >
                        <BarChart3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setChartType('area')}
                        className={`p-1 rounded ${chartType === 'area' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        title="Tendencia"
                      >
                        <PieChart className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setChartType('radar')}
                        className={`p-1 rounded ${chartType === 'radar' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        title="Resumen Multidimensional"
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
                          <Bar dataKey={selectedMeasure} name="Valor" radius={[4, 4, 0, 0]}>
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
                          <Radar name="Índice (%)" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                        </RadarChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-xs text-slate-500">
                No hay zonas disponibles para el año o fuente elegida. Prueba a cambiar el año a 2023.
              </div>
            )}
          </footer>

        </div>

      </div>

      {/* MODAL 1: PROVENIENCIA SPARQL */}
      {showSparqlModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[9999] p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-150">
            <div className="bg-slate-950 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <Code2 className="h-4 w-4 text-blue-400" /> Consulta de Origen de Datos (SPARQL / PROV-O)
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

      {/* MODAL 2: FICHA TÉCNICA */}
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
                  <p className="text-xs text-slate-400">Ficha Técnica Ontológica | Código: {selectedSection.id}</p>
                </div>
              </div>
              <button onClick={() => setShowOntologyModal(false)} className="text-slate-400 hover:text-white text-xs font-bold p-1">✕</button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-slate-200 border-b border-slate-800 pb-1 text-xs flex items-center gap-1.5">
                    <Database className="h-3.5 w-3.5 text-blue-400" /> Identificadores Ontológicos
                  </h4>
                  <p><strong>IRI de la Zona:</strong> <code className="text-blue-400">semvo:section-{selectedYear}-{selectedSection.id}</code></p>
                  <p><strong>Año del Dato:</strong> {selectedYear}</p>
                  <p><strong>Fuente del Dataset:</strong> <code className="text-amber-400">{selectedSource}</code></p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-slate-200 border-b border-slate-800 pb-1 text-xs flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Clasificación IPCC (Cambio Climático)
                  </h4>
                  <p><strong>Categoría:</strong> <span className="text-amber-300 font-medium">Sensibilidad Socioeconómica</span></p>
                  <p><strong>Efecto en la Zona:</strong> Aumenta la vulnerabilidad urbana</p>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="font-bold text-slate-200 border-b border-slate-800 pb-2 text-xs">
                  Resumen Completo de Indicadores de esta Zona
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <span className="block text-[10px] text-slate-400">Renta Media (RNMP)</span>
                    <span className="text-sm font-bold text-emerald-400">{selectedSection.rnmp ? `${selectedSection.rnmp.toLocaleString()} €` : 'Sin datos'}</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <span className="block text-[10px] text-slate-400">Desigualdad (GINI)</span>
                    <span className="text-sm font-bold text-blue-400">{selectedSection.gini || 'Sin datos'}</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <span className="block text-[10px] text-slate-400">Riesgo Pobreza (PUC75)</span>
                    <span className="text-sm font-bold text-amber-400">{selectedSection.puc75 ? `${selectedSection.puc75} %` : 'Sin datos'}</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <span className="block text-[10px] text-slate-400">Mayores 65 Años (PP65)</span>
                    <span className="text-sm font-bold text-amber-400">{selectedSection.pp65 ? `${selectedSection.pp65} %` : 'Sin datos'}</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <span className="block text-[10px] text-slate-400">Personas Solas (PHU)</span>
                    <span className="text-sm font-bold text-blue-400">{selectedSection.phu ? `${selectedSection.phu} %` : 'Sin datos'}</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <span className="block text-[10px] text-slate-400">Viviendas Pre-1980</span>
                    <span className="text-sm font-bold text-red-400">{selectedSection.pre80 ? `${selectedSection.pre80} %` : 'Sin datos'}</span>
                  </div>
                </div>
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
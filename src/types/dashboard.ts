export type Island = 'Tenerife' | 'Gran Canaria' | 'La Palma' | 'La Gomera' | 'El Hierro' | 'Fuerteventura' | 'Lanzarote';

export type DimensionType = 'ECONOMIC' | 'DEMOGRAPHIC' | 'BUILDING';

export type DataStatus = 'Definitive' | 'SuppressedData' | 'StructuralGap';

export type VisibilityType = 'GoldStandard' | 'SharedView' | 'PrivateView';

export type SourceId = 'ds:atlas-economic' | 'ds:atlas-demographic' | 'ds:istac-local' | 'ds:cadastre-infrastructure';

export interface CensusSection {
  id: string; // CUSEC
  name: string;
  municipality: string;
  island: Island;
  year: number;
  
  // Medidas Económicas
  rnmp: number | null;
  gini: number | null;
  puc75: number | null;
  
  // Medidas Demográficas
  pp65: number | null;
  pp18: number | null;
  phu: number | null;
  
  // Medidas Edificatorias
  pre80: number | null;
  catUso: string;
  
  status: DataStatus;
  primaryPropertyUse: string;
  
  // Trazabilidad PROV-O
  provSource: string;
  provDataset: SourceId;
  
  geometry: {
    type: "Polygon";
    coordinates: number[][][];
  };
}
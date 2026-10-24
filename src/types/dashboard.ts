export type Island = 'Tenerife' | 'Gran Canaria' | 'La Palma' | 'La Gomera' | 'El Hierro' | 'Fuerteventura' | 'Lanzarote';

export type DimensionType = 'ECONOMIC' | 'DEMOGRAPHIC' | 'BUILDING';

export type DataStatus = 'Definitive' | 'SuppressedData' | 'StructuralGap';

export type VisibilityType = 'GoldStandard' | 'SharedView' | 'PrivateView';

export interface CensusSection {
  id: string; // CUSEC
  name: string;
  municipality: string;
  island: Island;
  year: number;
  
  // Medidas de la Dimensión Económica
  rnmp: number | null;
  gini: number | null;
  puc75: number | null;
  
  // Medidas de la Dimensión Demográfica
  pp65: number | null; // % Mayores de 65
  pp18: number | null; // % Menores de 18
  phu: number | null;  // % Hogares unipersonales
  
  // Medidas de la Dimensión Edificatoria
  pre80: number | null; // % Edificios construidos antes de 1980
  catUso: string;       // Categoría uso catastral (V, T-V, I, C-O, B-Z)
  
  status: DataStatus;
  primaryPropertyUse: string; // semvo:AllUses o categoría específica
  
  // Trazabilidad PROV-O
  provSource: string;
  provDataset: string;
  
  geometry: {
    type: "Polygon";
    coordinates: number[][][];
  };
}
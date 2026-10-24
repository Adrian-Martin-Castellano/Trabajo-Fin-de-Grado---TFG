import type { CensusSection } from '../types/dashboard';

export const MOCK_SECTIONS: CensusSection[] = [
  {
    id: "3802301001",
    name: "Sección 01-001 (Casco Histórico)",
    municipality: "La Orotava",
    island: "Tenerife",
    year: 2023,
    rnmp: 12850,
    gini: 32.4,
    puc75: 18.2,
    pp65: 26.4,
    pp18: 12.1,
    phu: 28.5,
    pre80: 64.2,
    catUso: "Residencial (V)",
    status: 'Definitive',
    primaryPropertyUse: 'semvo:AllUses',
    provSource: 'semvo:obs-3802301001-2023-RNMP',
    provDataset: 'ds:atlas-economic',
    geometry: {
      type: "Polygon",
      coordinates: [[
        [-16.528, 28.392], [-16.518, 28.395], [-16.512, 28.388],
        [-16.520, 28.382], [-16.528, 28.392]
      ]]
    }
  },
  {
    id: "3802301002",
    name: "Sección 01-002 (Barroso / La Florida)",
    municipality: "La Orotava",
    island: "Tenerife",
    year: 2023,
    rnmp: 9400,
    gini: 38.1,
    puc75: 29.5,
    pp65: 31.2,
    pp18: 10.4,
    phu: 32.1,
    pre80: 81.5,
    catUso: "Agrario (B-Z)",
    status: 'Definitive',
    primaryPropertyUse: 'semvo:AllUses',
    provSource: 'semvo:obs-3802301002-2023-RNMP',
    provDataset: 'ds:atlas-economic',
    geometry: {
      type: "Polygon",
      coordinates: [[
        [-16.518, 28.395], [-16.502, 28.398], [-16.498, 28.385],
        [-16.512, 28.388], [-16.518, 28.395]
      ]]
    }
  },
  {
    id: "3802301003",
    name: "Sección 01-003 (La Perdoma)",
    municipality: "La Orotava",
    island: "Tenerife",
    year: 2023,
    rnmp: null,
    gini: null,
    puc75: null,
    pp65: null,
    pp18: null,
    phu: null,
    pre80: null,
    catUso: "Residencial (V)",
    status: 'SuppressedData', // Secreto Estadístico INE
    primaryPropertyUse: 'semvo:AllUses',
    provSource: 'semvo:obs-3802301003-2023-RNMP',
    provDataset: 'ds:atlas-economic',
    geometry: {
      type: "Polygon",
      coordinates: [[
        [-16.538, 28.382], [-16.528, 28.385], [-16.525, 28.372],
        [-16.535, 28.370], [-16.538, 28.382]
      ]]
    }
  },
  {
    id: "3803802004",
    name: "Sección 02-004 (Rambla de Santa Cruz)",
    municipality: "Santa Cruz de Tenerife",
    island: "Tenerife",
    year: 2023,
    rnmp: 18450,
    gini: 27.5,
    puc75: 8.2,
    pp65: 19.1,
    pp18: 15.8,
    phu: 18.2,
    pre80: 42.0,
    catUso: "Comercial (C-O)",
    status: 'Definitive',
    primaryPropertyUse: 'semvo:AllUses',
    provSource: 'semvo:obs-3803802004-2023-RNMP',
    provDataset: 'ds:atlas-economic',
    geometry: {
      type: "Polygon",
      coordinates: [[
        [-16.255, 28.472], [-16.242, 28.478], [-16.238, 28.465],
        [-16.250, 28.460], [-16.255, 28.472]
      ]]
    }
  },
  {
    id: "3801301002",
    name: "Sección 01-002 (Casco Histórico)",
    municipality: "San Cristóbal de La Laguna",
    island: "Tenerife",
    year: 2023,
    rnmp: 14200,
    gini: 30.1,
    puc75: 14.5,
    pp65: 22.1,
    pp18: 13.5,
    phu: 24.0,
    pre80: 58.0,
    catUso: "Residencial (V)",
    status: 'Definitive',
    primaryPropertyUse: 'semvo:AllUses',
    provSource: 'semvo:obs-3801301002-2023-RNMP',
    provDataset: 'ds:atlas-economic',
    geometry: {
      type: "Polygon",
      coordinates: [[
        [-16.320, 28.490], [-16.308, 28.495], [-16.302, 28.482],
        [-16.315, 28.480], [-16.320, 28.490]
      ]]
    }
  }
];

export const TENERIFE_MUNICIPALITIES = [
  "Todos",
  "La Orotava",
  "Santa Cruz de Tenerife",
  "San Cristóbal de La Laguna",
  "Puerto de la Cruz",
  "Arona"
];
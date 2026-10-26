import type { CensusSection } from '../types/dashboard';

export const MOCK_SECTIONS: CensusSection[] = [
  // ==========================================
  // --- AÑO 2023 ---
  // ==========================================
  
  // LA OROTAVA (2023)
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
    status: 'SuppressedData',
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

  // SANTA CRUZ DE TENERIFE (2023)
  {
    id: "3803802004",
    name: "Sección 02-004 (Rambla Santa Cruz)",
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
    id: "3803801012",
    name: "Sección 01-012 (Ofra / Las Delicias)",
    municipality: "Santa Cruz de Tenerife",
    island: "Tenerife",
    year: 2023,
    rnmp: 8900,
    gini: 39.8,
    puc75: 32.1,
    pp65: 33.4,
    pp18: 9.8,
    phu: 35.2,
    pre80: 88.4,
    catUso: "Residencial (V)",
    status: 'Definitive',
    primaryPropertyUse: 'semvo:AllUses',
    provSource: 'semvo:obs-3803801012-2023-PUC75',
    provDataset: 'ds:atlas-demographic',
    geometry: {
      type: "Polygon",
      coordinates: [[
        [-16.285, 28.455], [-16.272, 28.458], [-16.268, 28.448],
        [-16.280, 28.445], [-16.285, 28.455]
      ]]
    }
  },
  {
    id: "3803803001",
    name: "Sección 03-001 (Anaga / Taganana)",
    municipality: "Santa Cruz de Tenerife",
    island: "Tenerife",
    year: 2023,
    rnmp: null,
    gini: null,
    puc75: null,
    pp65: 38.5,
    pp18: 6.2,
    phu: 41.0,
    pre80: 92.0,
    catUso: "Agrario (B-Z)",
    status: 'StructuralGap',
    primaryPropertyUse: 'semvo:AllUses',
    provSource: 'semvo:obs-3803803001-2023-PRE80',
    provDataset: 'ds:cadastre-infrastructure',
    geometry: {
      type: "Polygon",
      coordinates: [[
        [-16.210, 28.560], [-16.195, 28.568], [-16.188, 28.552],
        [-16.202, 28.548], [-16.210, 28.560]
      ]]
    }
  },

  // SAN CRISTÓBAL DE LA LAGUNA (2023)
  {
    id: "3801301002",
    name: "Sección 01-002 (Casco La Laguna)",
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
  },
  {
    id: "3801302015",
    name: "Sección 02-015 (La Cuesta / Finca España)",
    municipality: "San Cristóbal de La Laguna",
    island: "Tenerife",
    year: 2023,
    rnmp: 11300,
    gini: 33.8,
    puc75: 21.4,
    pp65: 24.8,
    pp18: 14.2,
    phu: 22.9,
    pre80: 68.5,
    catUso: "Residencial (V)",
    status: 'Definitive',
    primaryPropertyUse: 'semvo:AllUses',
    provSource: 'semvo:obs-3801302015-2023-PP65',
    provDataset: 'ds:istac-local',
    geometry: {
      type: "Polygon",
      coordinates: [[
        [-16.300, 28.475], [-16.288, 28.480], [-16.282, 28.468],
        [-16.295, 28.465], [-16.300, 28.475]
      ]]
    }
  },

  // PUERTO DE LA CRUZ (2023)
  {
    id: "3802801001",
    name: "Sección 01-001 (Plaza del Charco)",
    municipality: "Puerto de la Cruz",
    island: "Tenerife",
    year: 2023,
    rnmp: 13500,
    gini: 35.0,
    puc75: 16.8,
    pp65: 29.8,
    pp18: 9.5,
    phu: 38.4,
    pre80: 76.2,
    catUso: "Turístico-residencial (T-V)",
    status: 'Definitive',
    primaryPropertyUse: 'semvo:AllUses',
    provSource: 'semvo:obs-3802801001-2023-CATUSO',
    provDataset: 'ds:cadastre-infrastructure',
    geometry: {
      type: "Polygon",
      coordinates: [[
        [-16.552, 28.418], [-16.542, 28.420], [-16.538, 28.410],
        [-16.548, 28.408], [-16.552, 28.418]
      ]]
    }
  },

  // ARONA (2023)
  {
    id: "3800601008",
    name: "Sección 01-008 (Los Cristianos)",
    municipality: "Arona",
    island: "Tenerife",
    year: 2023,
    rnmp: 11900,
    gini: 37.4,
    puc75: 20.1,
    pp65: 18.5,
    pp18: 14.0,
    phu: 34.0,
    pre80: 35.0,
    catUso: "Turístico-residencial (T-V)",
    status: 'Definitive',
    primaryPropertyUse: 'semvo:AllUses',
    provSource: 'semvo:obs-3800601008-2023-GINI',
    provDataset: 'ds:istac-local',
    geometry: {
      type: "Polygon",
      coordinates: [[
        [-16.720, 28.055], [-16.708, 28.060], [-16.702, 28.048],
        [-16.715, 28.045], [-16.720, 28.055]
      ]]
    }
  },

  // ==========================================
  // --- AÑO 2022 (DATOS HISTÓRICOS) ---
  // ==========================================

  {
    id: "3802301001",
    name: "Sección 01-001 (Casco Histórico)",
    municipality: "La Orotava",
    island: "Tenerife",
    year: 2022,
    rnmp: 11950,
    gini: 33.1,
    puc75: 19.4,
    pp65: 25.8,
    pp18: 12.4,
    phu: 27.8,
    pre80: 64.2,
    catUso: "Residencial (V)",
    status: 'Definitive',
    primaryPropertyUse: 'semvo:AllUses',
    provSource: 'semvo:obs-3802301001-2022-RNMP',
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
    id: "3802301004",
    name: "Sección 01-004 (Aguamansa)",
    municipality: "La Orotava",
    island: "Tenerife",
    year: 2022,
    rnmp: 10100,
    gini: 34.2,
    puc75: 22.0,
    pp65: 28.9,
    pp18: 11.2,
    phu: 26.0,
    pre80: 73.0,
    catUso: "Agrario (B-Z)",
    status: 'Definitive',
    primaryPropertyUse: 'semvo:AllUses',
    provSource: 'semvo:obs-3802301004-2022-PP65',
    provDataset: 'ds:istac-local',
    geometry: {
      type: "Polygon",
      coordinates: [[
        [-16.512, 28.375], [-16.495, 28.378], [-16.490, 28.365],
        [-16.505, 28.362], [-16.512, 28.375]
      ]]
    }
  },
  {
    id: "3803802004",
    name: "Sección 02-004 (Rambla Santa Cruz)",
    municipality: "Santa Cruz de Tenerife",
    island: "Tenerife",
    year: 2022,
    rnmp: 17200,
    gini: 28.1,
    puc75: 9.0,
    pp65: 18.6,
    pp18: 16.1,
    phu: 17.8,
    pre80: 42.0,
    catUso: "Comercial (C-O)",
    status: 'Definitive',
    primaryPropertyUse: 'semvo:AllUses',
    provSource: 'semvo:obs-3803802004-2022-RNMP',
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
    name: "Sección 01-002 (Casco La Laguna)",
    municipality: "San Cristóbal de La Laguna",
    island: "Tenerife",
    year: 2022,
    rnmp: 13400,
    gini: 31.0,
    puc75: 15.8,
    pp65: 21.5,
    pp18: 14.0,
    phu: 23.1,
    pre80: 58.0,
    catUso: "Residencial (V)",
    status: 'Definitive',
    primaryPropertyUse: 'semvo:AllUses',
    provSource: 'semvo:obs-3801301002-2022-RNMP',
    provDataset: 'ds:atlas-economic',
    geometry: {
      type: "Polygon",
      coordinates: [[
        [-16.320, 28.490], [-16.308, 28.495], [-16.302, 28.482],
        [-16.315, 28.480], [-16.320, 28.490]
      ]]
    }
  },

  // ==========================================
  // --- AÑO 2021 (DATOS HISTÓRICOS) ---
  // ==========================================

  {
    id: "3802301001",
    name: "Sección 01-001 (Casco Histórico)",
    municipality: "La Orotava",
    island: "Tenerife",
    year: 2021,
    rnmp: 10950,
    gini: 34.5,
    puc75: 21.2,
    pp65: 25.0,
    pp18: 12.9,
    phu: 26.5,
    pre80: 64.2,
    catUso: "Residencial (V)",
    status: 'Definitive',
    primaryPropertyUse: 'semvo:AllUses',
    provSource: 'semvo:obs-3802301001-2021-RNMP',
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
    id: "3803802004",
    name: "Sección 02-004 (Rambla Santa Cruz)",
    municipality: "Santa Cruz de Tenerife",
    island: "Tenerife",
    year: 2021,
    rnmp: 16100,
    gini: 29.5,
    puc75: 10.4,
    pp65: 17.9,
    pp18: 16.8,
    phu: 16.9,
    pre80: 42.0,
    catUso: "Comercial (C-O)",
    status: 'Definitive',
    primaryPropertyUse: 'semvo:AllUses',
    provSource: 'semvo:obs-3803802004-2021-RNMP',
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
    name: "Sección 01-002 (Casco La Laguna)",
    municipality: "San Cristóbal de La Laguna",
    island: "Tenerife",
    year: 2021,
    rnmp: 12500,
    gini: 32.2,
    puc75: 17.1,
    pp65: 20.8,
    pp18: 14.5,
    phu: 22.0,
    pre80: 58.0,
    catUso: "Residencial (V)",
    status: 'Definitive',
    primaryPropertyUse: 'semvo:AllUses',
    provSource: 'semvo:obs-3801301002-2021-RNMP',
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
import os
from pathlib import Path
import numpy as np
import pandas as pd
import morph_kgc

# Rutas base relativas al script
BASE_DIR = Path(__file__).resolve().parent.parent
RAW_DIR = BASE_DIR / "data" / "raw"
PROC_DIR = BASE_DIR / "data" / "processed"
MAPPINGS_DIR = BASE_DIR / "mappings"
RDF_DIR = BASE_DIR / "data" / "rdf"


def preprocesar_atlas(ruta_entrada, ruta_salida, columnas_medidas, columnas_enteras=None, col_id="CUSEC"):
    if columnas_enteras is None:
        columnas_enteras = []

    df = pd.read_csv(ruta_entrada, sep=";", skiprows=1, dtype={col_id: str})
    df["estado_obs"] = ""
    condicion_nulo_fila = pd.Series(False, index=df.index)

    for col in columnas_medidas:
        if col in df.columns:
            col_str = df[col].astype(str).str.strip()
            es_nulo = col_str.isin(["", ".", "nan", "<NA>"]) | df[col].isnull()
            condicion_nulo_fila = condicion_nulo_fila | es_nulo

            # Limpiar solo las celdas nulas de esta columna sin borrar las válidas de la fila
            df.loc[es_nulo, col] = np.nan
            df[col] = df[col].astype(str).str.replace(",", ".", regex=False)
            df[col] = pd.to_numeric(df[col], errors="coerce")

            if col in columnas_enteras:
                df[col] = df[col].astype("Int64")
            else:
                df[col] = df[col].astype("Float64")

    df.loc[condicion_nulo_fila, "estado_obs"] = "SuppressedData"

    os.makedirs(os.path.dirname(ruta_salida), exist_ok=True)
    df.to_csv(ruta_salida, index=False, sep=",")
    print(f"[OK] Archivo procesado: {ruta_salida}")


def preprocesar_infraestructuras(ruta_entrada, ruta_salida):
    df = pd.read_csv(ruta_entrada, sep=";", dtype={"REFCAT": str})

    mapeo_usos = {
        "1_residential": "ResidentialUse",
        "3_industrial": "IndustrialUse",
        "4_2_retail": "RetailUse",
    }
    df["CAT_USO"] = df["CAT_USO"].map(mapeo_usos).fillna(df["CAT_USO"])

    columnas_enteras = ["NUM_INMUE", "NUM_EDVIV", "CAT_TIME"]
    for col in columnas_enteras:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce").astype("Int64")

    os.makedirs(os.path.dirname(ruta_salida), exist_ok=True)
    df.to_csv(ruta_salida, index=False, sep=",")
    print(f"[OK] Archivo de infraestructuras procesado: {ruta_salida}")


def generar_ntriples(archivo_csv, archivo_yaml, archivo_salida):
    if not os.path.exists(archivo_csv) or not os.path.exists(archivo_yaml):
        print(f"[ERROR] Faltan archivos: '{archivo_csv}' o '{archivo_yaml}'.")
        return

    config_ini = f"""
    [DataSource1]
    mappings: {os.path.abspath(archivo_yaml)}
    """

    print(f"Iniciando materialización de tripletas para {os.path.basename(archivo_yaml)}...")
    cwd_original = os.getcwd()
    try:
        # Cambiamos temporalmente a la carpeta donde están los CSV procesados
        os.chdir(os.path.dirname(os.path.abspath(archivo_csv)))
        grafo_resultante = morph_kgc.materialize(config_ini)
        
        os.makedirs(os.path.dirname(os.path.abspath(archivo_salida)), exist_ok=True)
        grafo_resultante.serialize(destination=os.path.abspath(archivo_salida), format="nt")
        print(f"[OK] Mapeo completado ({len(grafo_resultante)} tripletas) -> {archivo_salida}")
    except Exception as e:
        print(f"[ERROR] Durante la ejecución del mapeo: {e}")
    finally:
        # Restauramos siempre el directorio original
        os.chdir(cwd_original)


if __name__ == "__main__":
    # 1. Dimensión Económica
    columnas_economicas = ["SAL_23", "PEN_23", "DES_23", "ORTP_23", "ORTI_23", "RNMP_23", "PUC10_23", "GINI_23"]
    preprocesar_atlas(
        RAW_DIR / "Atlas2023_economica.csv",
        PROC_DIR / "atlas_economico_prep.csv",
        columnas_medidas=columnas_economicas,
    )
    generar_ntriples(
        PROC_DIR / "atlas_economico_prep.csv",
        MAPPINGS_DIR / "mapping_economic_2023.yaml",
        RDF_DIR / "output_economic_2023.nt",
    )

    # 2. Dimensión Demográfica
    columnas_demograficas = ["EM_23", "PP18_23", "PP65_23", "PHU_23", "POB_23", "PESP_23"]
    preprocesar_atlas(
        RAW_DIR / "Atlas2023_demografica.csv",
        PROC_DIR / "atlas_demografico_prep.csv",
        columnas_medidas=columnas_demograficas,
        columnas_enteras=["POB_23"],
    )
    generar_ntriples(
        PROC_DIR / "atlas_demografico_prep.csv",
        MAPPINGS_DIR / "mapping_demographic_2023.yaml",
        RDF_DIR / "output_demographic_2023.nt",
    )

    # 3. Dimensión Infraestructuras
    preprocesar_infraestructuras(
        RAW_DIR / "Atlas2023_infraestructura.csv",
        PROC_DIR / "atlas_infraestructuras_prep.csv",
    )
    generar_ntriples(
        PROC_DIR / "atlas_infraestructuras_prep.csv",
        MAPPINGS_DIR / "mapping_infrastructure_2023.yaml",
        RDF_DIR / "output_infraestructure_2023.nt",
    )
# Capa ETL - AdaPTa Islas

Scripts de preprocesado y materialización de tripletas RDF (YARRRML / Morph-KGC) compatibles con la ontología **SEMVO**.

## Requisitos e instalación

1. Crear y activar un entorno virtual de Python (Python 3.10+):
   ```bash
   python -m venv .venv
   # Windows:
   .venv\Scripts\activate
   # Linux/macOS:
   source .venv/bin/activate
   ```

2. Instalar las dependencias del proyecto:

```bash
   pip install -r etl/requirements.txt
   ```

3. Ejecutar el pipeline completo:

```bash
   python etl/scripts/run_etl.py
   ```

Proximamente, automatizado en Docker.
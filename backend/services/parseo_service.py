import re

def extraer_monto(texto):
    lineas = texto.split("\n")
    
    for i, linea in enumerate(lineas):
        if re.search(r'\bTOTAL\b', linea, re.IGNORECASE):
           
            numeros = re.findall(r'\d+[.,]\d{2}|\d+€', linea)
            if numeros:
                return limpiar_monto(numeros[-1])
            
           
            if i + 1 < len(lineas):
                numeros = re.findall(r'\d+[.,]\d{2}|\d+€', lineas[i + 1])
                if numeros:
                    return limpiar_monto(numeros[0])
    
    return None

def limpiar_monto(monto):
    
    monto = monto.replace("€", "").replace(",", ".").strip()
    return float(monto)


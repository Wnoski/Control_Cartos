import pytesseract
import fitz
import io
from services import parseo_service
from PIL import Image, ImageFilter, ImageEnhance
from pathlib import Path

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"


# Orquestador principal - recibe el archivo del front, guarda y extrae texto
def extraer_texto(archivo):
    
        nombre_archivo = archivo.filename
        extension = Path(nombre_archivo).suffix.lower()

        contenido_bytes = archivo.file.read()

        if extension == ".pdf":
            
            texto = extraer_texto_pdf(contenido_bytes)
            
        else:
            
            imagen = Image.open(io.BytesIO(contenido_bytes))
            texto = extraer_texto_imagen(imagen)
            
        monto = parseo_service.extraer_monto(texto) 
        return monto
    

# Extrae texto de PDF, primero digital luego OCR si es escaneado
def extraer_texto_pdf(bytes_pdf):
    doc = fitz.open(stream=bytes_pdf, filetype="pdf")
    texto = ""

    for pagina in doc:
        texto += pagina.get_text()

    if not texto.strip():
        for pagina in doc:
            pixmap = pagina.get_pixmap(dpi=300)
            imagen_bytes = pixmap.tobytes("png")
            imagen = Image.open(io.BytesIO(imagen_bytes))
            texto += extraer_texto_imagen(imagen) + "\n"

    return texto

# Preprocesa y extrae texto de una imagen con Tesseract
def extraer_texto_imagen(imagen):
    imagen = preprocesar_imagen(imagen)
    return pytesseract.image_to_string(imagen, lang="spa")

# Preprocesa la imagen para mejorar resultados del OCR
def preprocesar_imagen(imagen):
    imagen = imagen.convert("L")
    imagen = ImageEnhance.Contrast(imagen).enhance(2.0)
    imagen = imagen.filter(ImageFilter.SHARPEN)
    imagen = imagen.resize((imagen.width * 2, imagen.height * 2), Image.LANCZOS)
    return imagen


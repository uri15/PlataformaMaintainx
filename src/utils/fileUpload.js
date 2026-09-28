import { compressImageFile } from './imageCompressor.js';

/**
 * Sube un archivo (imagen o documento) al servidor para guardarlo en disco (/uploads).
 * En caso de fallo de red o servidor no disponible, regresa transparentemente
 * el DataURL comprimido como fallback seguro.
 * 
 * @param {File|Blob|string} fileOrDataUrl - Archivo original o cadena base64/dataURL
 * @param {Object} options - Configuración de subida
 * @param {'photos'|'documents'|'avatars'} options.folder - Carpeta destino
 * @param {string} [options.name] - Nombre original del archivo
 * @param {string} [options.type] - Tipo ('image' o 'document')
 * @returns {Promise<{ url: string, name: string, size: number, type: string, isLocal?: boolean }>}
 */
export async function uploadFileToServer(fileOrDataUrl, options = {}) {
  const {
    folder = 'photos',
    name = '',
    type = 'image',
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.75
  } = options;

  let dataUrl = '';
  let fileName = name || (fileOrDataUrl instanceof File ? fileOrDataUrl.name : 'archivo');
  let fileSize = fileOrDataUrl instanceof File ? fileOrDataUrl.size : 0;
  let fileType = type;

  try {
    // 1. Obtener DataURL (comprimiendo si es imagen)
    if (typeof fileOrDataUrl === 'string') {
      dataUrl = fileOrDataUrl;
    } else if (fileOrDataUrl instanceof File || fileOrDataUrl instanceof Blob) {
      if (fileOrDataUrl.type && fileOrDataUrl.type.startsWith('image/')) {
        fileType = 'image';
        dataUrl = await compressImageFile(fileOrDataUrl, maxWidth, maxHeight, quality);
      } else {
        fileType = 'document';
        dataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => reject(new Error('Error al leer archivo'));
          reader.readAsDataURL(fileOrDataUrl);
        });
      }
    }

    if (!dataUrl) {
      throw new Error('No se pudo generar dataURL del archivo');
    }

    // 2. Enviar al endpoint REST del servidor
    const response = await fetch('/api/v1/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: dataUrl,
        name: fileName,
        folder,
        type: fileType
      })
    });

    if (response.ok) {
      const result = await response.json();
      return {
        url: result.url,
        name: result.name || fileName,
        size: result.size || fileSize,
        type: fileType,
        isLocal: false
      };
    } else {
      console.warn(`[Upload] El servidor respondió con estado ${response.status}. Usando fallback local.`);
    }
  } catch (err) {
    console.warn('[Upload] Error al conectar con /api/v1/upload, guardando localmente:', err.message);
  }

  // Fallback seguro: conserva DataURL para no perder información
  return {
    url: dataUrl,
    name: fileName,
    size: fileSize,
    type: fileType,
    isLocal: true
  };
}

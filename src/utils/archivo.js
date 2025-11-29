export function obtenerExtensionArchivo(file) {
  switch (file.mimetype) {
    case 'image/jpeg':
      return 'jpg';
    case 'image/png':
      return 'png';
    case 'image/webp':
      return 'webp';
    default:
      return null; // tipo no permitido
  }
}
const https = require('https');

/**
 * Geocodificación inversa usando la API gratuita de Nominatim (OpenStreetMap).
 * Convierte coordenadas (lat, lon) en una dirección legible.
 */
exports.reverseGeocode = (lat, lon) => {
  return new Promise((resolve, reject) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`;

    const options = {
      headers: {
        // Nominatim requiere un User-Agent descriptivo
        'User-Agent': 'FourPark-API/1.0 (contact@fourpark.com)',
        'Accept-Language': 'es',
      },
    };

    https.get(url, options, (response) => {
      let data = '';
      response.on('data', chunk => { data += chunk; });
      response.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.error) return reject(new Error(json.error));
          // Priorizar display_name o construir desde componentes
          const addr = json.address;
          const parts = [
            addr?.road,
            addr?.house_number,
            addr?.neighbourhood || addr?.suburb,
            addr?.city || addr?.town || addr?.municipality,
            addr?.state,
          ].filter(Boolean);
          resolve(parts.length ? parts.join(', ') : json.display_name || `${lat}, ${lon}`);
        } catch {
          reject(new Error('Error al parsear respuesta de geocodificación'));
        }
      });
    }).on('error', reject);
  });
};

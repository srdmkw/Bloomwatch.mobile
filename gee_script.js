// Создание карты
const map = L.map('map').setView([41.3, 69.2], 5);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 10,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Функция для запроса NDVI с NASA POWER API
async function getNDVI(lat, lon) {
  const url = `https://power.larc.nasa.gov/api/temporal/monthly/point?parameters=NDVI&community=AG&longitude=${lon}&latitude=${lat}&start=2020&end=2025&format=JSON`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.properties.parameter.NDVI;
  } catch (e) {
    console.error("Ошибка получения данных:", e);
    return null;
  }
}

// При клике на карту — показать NDVI
map.on('click', async (e) => {
  const lat = e.latlng.lat.toFixed(3);
  const lon = e.latlng.lng.toFixed(3);
  const ndviData = await getNDVI(lat, lon);

  if (!ndviData) {
    L.popup()
      .setLatLng(e.latlng)
      .setContent("❌ Не удалось получить данные NASA")
      .openOn(map);
    return;
  }

  const years = Object.keys(ndviData);
  const lastYear = years[years.length - 1];
  const lastValue = ndviData[lastYear].toFixed(3);

  L.popup()
    .setLatLng(e.latlng)
    .setContent(`📍 Координаты: ${lat}, ${lon}<br>🌿 NDVI (${lastYear}): ${lastValue}`)
    .openOn(map);
});

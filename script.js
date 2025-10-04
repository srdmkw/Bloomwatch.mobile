// Создаем карту Leaflet
const map = L.map('map').setView([41.3, 69.2], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 10,
  attribution: '&copy; OpenStreetMap contributors',
}).addTo(map);

// Получаем данные NDVI с NASA POWER API
async function getNDVI(lat, lon) {
  const url = `https://power.larc.nasa.gov/api/temporal/monthly/point?parameters=NDVI&community=AG&longitude=${lon}&latitude=${lat}&start=2023&end=2025&format=JSON`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (!data.properties?.parameter?.NDVI) {
      throw new Error("Нет данных NDVI");
    }
    return data.properties.parameter.NDVI;
  } catch (e) {
    console.error("Ошибка получения данных:", e);
    return null;
  }
}

// Обработка кликов по карте
map.on('click', async (e) => {
  const { lat, lng } = e.latlng;
  const ndviData = await getNDVI(lat.toFixed(2), lng.toFixed(2));

  if (!ndviData) {
    L.popup()
      .setLatLng(e.latlng)
      .setContent("❌ Не удалось получить данные NASA.")
      .openOn(map);
    return;
  }

  const years = Object.keys(ndviData);
  const lastYear = years[years.length - 1];
  const lastValue = ndviData[lastYear];

  L.popup()
    .setLatLng(e.latlng)
    .setContent(
      `📍 Координаты: ${lat.toFixed(2)}, ${lng.toFixed(2)}<br>
       🌿 NDVI (${lastYear}): ${lastValue.toFixed(3)}`
    )
    .openOn(map);
});

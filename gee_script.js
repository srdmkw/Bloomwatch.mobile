// Google Earth Engine snippet (paste into code editor: https://code.earthengine.google.com/)
/*
  Simple NDVI time-series + SOS detection per tile.
  This is a starting point — adapt to your AOI and export results to Drive/Cloud.
*/
var start = '2023-01-01';
var end = '2025-12-31';
var region = ee.Geometry.Rectangle([-180,-60,180,85]); // global (be careful)
var collection = ee.ImageCollection('MODIS/061/MOD13Q1')
  .filterDate(start, end)
  .select('NDVI');

var ndviSmoothed = collection.map(function(img){ return img.visualize(); });

// Example: compute per-pixel mean and anomaly for a period
var mean = collection.filterDate('2024-01-01','2024-12-31').mean();
var anomaly = collection.mean().subtract(mean);

// For phenology, use time-series per pixel and apply Savitzky-Golay smoothing (examples exist in GEE community)
/* export to drive example:
Export.image.toDrive({
  image: mean,
  description: 'NDVI_mean_2024',
  scale: 250,
  region: region,
  maxPixels: 1e13
});
*/
print('GEE snippet loaded. Adapt for SOS detection and export.');

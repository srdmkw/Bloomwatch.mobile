const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

// sample dates (in production: generate from DB or tile metadata)
const dates = ["2025-03-28","2025-04-05","2025-04-15"];

// load sample geojson per date from samples folder
app.get('/api/dates', (req, res) => {
  res.json(dates);
});

app.get('/api/blooms', (req, res) => {
  const date = req.query.date;
  if(!date || !dates.includes(date)) {
    return res.status(400).json({type:'FeatureCollection',features:[]});
  }
  try {
    const data = require('./samples/' + date + '.geojson');
    return res.json(data);
  } catch(e){
    console.error('missing sample for', date, e);
    return res.json({type:'FeatureCollection',features:[]});
  }
});

// fallback to index.html for SPA
app.get('*', (req,res)=> {
  res.sendFile(path.join(__dirname,'public','index.html'));
});

app.listen(port, ()=> console.log(`BloomWatch server running on http://localhost:${port}`));

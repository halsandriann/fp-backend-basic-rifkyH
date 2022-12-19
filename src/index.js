const express = require('express');
const routes = require('./routes');

const app = express();

/**
 * Body Parser
 */
app.use(express.json());

app.use('/api', routes);

const data = require('./data/example.js');

app.get('/', (req, res) => {
  res.send('<h1>Argentina Menang</h1>');
  //res.sendFile('/data/example.js', { root: __dirname });
});

//1. API dapat menyimpan catatan pada /data/example.js
// coba dengan selain 1 dan 2
app.post('/notes', (req, res) => {
  const { id, title, body, created_at, updated_at } = req.body;

  data.push({ id, title, body, created_at, updated_at });

  res.status(201).send({
    status: 'success',
    message: 'catatan berhasil ditambahkan',
    data: {
      id: parseInt(id),
      title,
      body,
      created_at,
      updated_at,
    },
  });
});

//2. API dapat menampilkan seluruh catatan
app.get('/notes', (req, res) => {
  res.status(200).send({
    status: 'success',
    data: {
      notes: data,
    },
  });
});

//3. API dapat menampilkan detail catatan
app.get('/notes/:id', (req, res) => {
  const id = req.params.id;
  const item = data.find((item) => item.id == id);

  if (item) {
    res.status(200).send({
      status: 'success',
      data: {
        id: parseInt(id),
        title: item.title,
        body: item.body,
        created_at: item.created_at,
        updated_at: item.updated_at,
      },
    });
  } else {
    res.status(404).send({
      status: 'fail',
      message: 'Catatan tidak ditemukan',
    });
  }
});

//4. API dapat mengubah catatan
app.put('/notes/:id', (req, res) => {
  const id = req.params.id;
  const item = data.find((item) => item.id == id);

  if (item) {
    const { title, body } = req.body;
    const created_at = item.created_at;
    const updated_at = new Date();

    item.title = title;
    item.body = body;
    item.updated_at = updated_at;

    res.status(200).send({
      status: 'success',
      message: 'catatan berhasil diperbarui',
      data: {
        id: parseInt(id),
        title: item.title,
        body: item.body,
        created_at,
        updated_at: item.updated_at,
      },
    });
  } else {
    res.status(404).send({
      status: 'fail',
      message: 'Catatan tidak ditemukan',
    });
  }
});

//5. API dapat menghapus catatan

app.delete('/notes/:id', (req, res) => {
  const id = req.params.id;
  const index = data.findIndex((item) => item.id == id);

  if (index === -1) {
    return res.status(404).send({
      status: 'fail',
      message: 'Catatan tidak ditemukan',
    });
  }

  data.splice(index, 1);

  res.status(200).send({
    status: 'success',
    message: 'Catatan berhasil dihapus',
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

const express = require('express');

const app = express();

app.get('/api/course/list', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST');
  res.header('Content-Type', 'application/json;charset=utf-8');
  res.json({
    code: 0,
    list: [
      { name: '语文', id: 0 },
      { name: '数学', id: 1 },
      { name: '英语', id: 2 },
      { name: '物理', id: 3 },
      { name: '化学', id: 4 },
      { name: '生物', id: 5 },
    ]
  });
});

app.listen(9090, () => {
  console.log('mock 启动成功');
})
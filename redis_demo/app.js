const express = require('express');
const app = express();

app.get('/post', entries.form);
app.post('post', entries.submit);
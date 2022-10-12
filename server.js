const express = require('express');
const app = express();

// PORT || 5000 means: process. env. PORT means the PORT number you manually set. 3000 is the default port 
// If you havent set it manually then it will listen to 5000
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('API Running');
})


app.listen(PORT, () => {
    console.log(`Server Started on port ${PORT}`)
});
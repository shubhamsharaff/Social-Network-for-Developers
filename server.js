const express = require('express');
const app = express();
const connectDB = require('./config/db');
// PORT || 5000 means: process. env. PORT means the PORT number you manually set. 3000 is the default port 
// If you havent set it manually then it will listen to 5000
const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();
// Initializing middleware
app.use(express.json({extended:false}));

app.get('/', (req, res) => {
    res.send('API Running');
})

// Define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/profile', require('./routes/api/profile'));



app.listen(PORT, () => {
    console.log(`Server Started on port ${PORT}`)
});
const express = require('express');
const port = process.env.PORT || 5000;
const app = express();
app.use(express.json());

const userRoutes = require('./routes/users.route')

app.use('/user', userRoutes);

app.get('/', (req, res) => {
    res.send('Random user server is running');
});

app.listen(port, () => {
    console.log('Listening from port', port);
});
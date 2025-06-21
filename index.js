const express = require('express');

const cors = require('cors');
const bodyParser = require('body-parser');
const adminRouter = require('./routes/admin');
const userRouter = require('./routes/user');
const dataRouter = require('./routes/adminSelectedData');

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;
app.use(bodyParser.json({ limit: '100mb' })); // For application/json
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' })); // For application/x-www-form-urlencoded
app.use(cors({
  origin: ['https://portfolio-arunabha.netlify.app', 'https://arunsprotfolioeditor.netlify.app'],
  credentials: true,
}));

app.use('/admin',adminRouter);
app.use('/user',userRouter);
app.use('/dataSelected',dataRouter);


app.listen(PORT, ()=>
    {
        console.log(`Application is running on ${PORT}`);
    })





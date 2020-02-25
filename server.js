const express = require('express');
const app = express();
const cors = require('cors');
const bodyparser = require('body-parser');
app.use(bodyparser.json())
const PORT =3000;
app.use(cors());
const api = require('./routes/api')
app.use('/api',api);
app.get('/api',api);
app.listen(PORT,()=>
{
    console.log(`Example app listening on port ${PORT}!`)
});
app.get('/',(req,res)=>
{
 res.send("ok");
});
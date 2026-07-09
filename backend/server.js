//start server 
require('dotenv').config();
const app=require('./src/app');
const port = 3000
const another="http://localhost:3000/"
const connectdb= require('./src/db/db')

connectdb();

app.listen(port, () => {
  console.log(`Server is running on  ${another}`)
})
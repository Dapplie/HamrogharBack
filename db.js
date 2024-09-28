const mongoose = require('mongoose');
require('dotenv').config();
mongoose
  .connect('mongodb+srv://Daps22:GHsSKAaidcFrZp7y@cluster0.lcdlj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('database connected successfully.'))
  .catch((err) => console.log('Error while connecting to database'));

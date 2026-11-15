require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/players', require('./routes/players'));

// mongoose.connect(process.env.MONGO_URI)
mongoose.connect("mongodb+srv://7upkalai_db_user:Uh OnqMbplMlYJEiD@titaniccc.yx7olyy.mongodb.net/test?retryWrites=true&w=majority")
  .then(() => {
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on ${process.env.PORT || 5000}`)
    );
  })
  .catch(err => console.error(err));

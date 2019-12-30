require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
let path = require('path');
let session = require('express-session');
const mongoose = require('mongoose');
// Router
let app = express();
let controller = require('./controller');
// socket IO 
mongoose.connect(process.env.MONGO_DB, {useNewUrlParser: true,useUnifiedTopology: true ,useFindAndModify: false  },(erro)=>{
  if(erro){
    console.log("Lỗi " + erro);
  }else{
    console.log("Connected to mongodb " + process.env.MONGO_DB);
  }
});

app.use(express.static(path.join(__dirname , './../public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views',path.join(__dirname,'/views'));
app.set('view engine','ejs');
app.use(session({
    secret: 'phong nguyen',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge:1000*60*60*12
    }
}))
app.get('/',controller.indexpage)
app.listen(process.env.PORT,()=>{
    console.log('Web listen on port :' + process.env.PORT);
})
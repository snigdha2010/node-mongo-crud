const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;


const password = 'mx4ipXZcGWfJUDS6';
const uri = "mongodb+srv://snigdha2010:mx4ipXZcGWfJUDS6@cluster0.1sg5c.mongodb.net/organicbd?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true , useUnifiedTopology: true });

//create the app
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


//connect to db
client.connect(err => {
  const productCollection = client.db("organicbd").collection("products");

  //post
  app.post('/addProduct',(req,res)=>{
      const product = req.body;
      console.log(product)
      productCollection.insertOne(product)
      .then(result =>{
        res.redirect('/')
      })
  })

  //read add pd
  app.get('/products',(req,res)=>{
      productCollection.find({}).limit(4)
      .toArray((err,documents)=>{
          res.send(documents);
      })
  })

  //load single pd from db
  app.get('/prducts/:id',(req,res)=>{
      productCollection.find({_id:ObjectId(req.params.id)})
      .toArray((err,document)=>{
          res.send(document[0])
      })
  })

  //update data in db
  app.patch('/update/:id',(req,res)=>{
      productCollection.updateOne({_id:ObjectId(req.params.id)},
      {
          $set: {price:req.body.price}
      })
      .then(result =>{
          res.send(result.modifiedCount>0)
      })
      
  })
  //delet
  app.delete('/delete/:id',(req,res)=>{
      productCollection.deleteOne({_id:ObjectId(req.params.id)})
      .then(result =>{
          res.send(result.deletedCount>0)
      })
  })

});

//
app.get('/',(req,res)=>{
    //res.send("Hello I am working")
    res.sendFile(__dirname + '/index.html');
    console.log("server started")
})

//send data to db 


//create the local host by listener
app.listen(3000);
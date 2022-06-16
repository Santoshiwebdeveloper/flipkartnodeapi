let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let cors = require('cors')
let dotenv = require('dotenv');
dotenv.config()
let port = process.env.PORT || 9870;
let mongo = require('mongodb');
let MongoClient = mongo.MongoClient;
// let mongoUrl = process.env.MonogUrl;
let mongoUrl = process.env.MongoLiveUrl;
let db;

//middleware (supporting lib)
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cors())

app.get('/',(req,res) => {
    res.send('Express Server default')
})


app.get('/products',(req,res) => {
  let categoryname = req.query.categoryname
  let query = {}
  if(categoryname){
    query = {"categories.category_name":categoryname}
  }

  db.collection('products').find(query).toArray((err,result) => {
    if(err) throw err;
    res.send(result)
  })
})

// app.get('/products',(req,res) => {
//   db.collection('products').find().toArray((err,result) => {
//     if(err) throw err;
//     res.send(result)
//   })
// })


app.get('/items/:collections',(req,res) => {
  db.collection(req.params.collections).find().toArray((err,result) => {
    if(err) throw err;
    res.send(result)
  })
})

app.get('/location',(req,res) => {
    db.collection('location').find().toArray((err,result) => {
      if(err) throw err;
      res.send(result)
    })
})

app.get('/categories',(req,res) => {
    db.collection('categories').find().toArray((err,result) => {
      if(err) throw err;
      res.send(result)
    })
})


//best selling products
app.get('/bestsellingproducts',(req,res) => {
  db.collection('products').find({$and:[{product_count:{$gt:900}}]}).toArray((err,result) => {
    if(err) throw err;
    res.send(result)
  })
})

app.get(`/filter/:categoryid`,(req,res) => {
  let sort = {cost:1}
  let categoryid = Number(req.params.categoryid)
  let brandid = Number(req.query.brandid)
  let lcost = Number(req.query.lcost)
  let hcost = Number(req.query.hcost)
  let query = {}
  if(req.query.sort){
    sort={cost:req.query.sort}
  }

  if(lcost && hcost && brandid){
    query={
      "categories.category_id":categoryid,
      $and:[{cost:{$gt:lcost,$lt:hcost}}],
      "brands.brand_id":brandid
    }
  }
  else if(lcost && hcost){
    query={
      "categories.category_id":categoryid,
      $and:[{cost:{$gt:lcost,$lt:hcost}}]
    }
  }
  else if(brandid){
    query={
      "categories.category_id":categoryid,
      "brands.brand_id":brandid
    }
  }else{
    query={
      "categories.category_id":categoryid
    }
  }
  db.collection('products').find(query).sort(sort).toArray((err,result) => {
    if(err) throw err;
    res.send(result)
  })
})

// app.get('/details/:id',(req,res) => {
//   let id = mongo.ObjectId(req.params.id)
//   db.collection('restaurants').find({_id:id}).toArray((err,result) => {
//     if(err) throw err;
//     res.send(result)
//   })
// })

app.get('/details/:id',(req,res) => {
  let id = Number(req.params.id)
  db.collection('products').find({product_id:id}).toArray((err,result) => {
    if(err) throw err;
    res.send(result)
  })
})

// based on selected product display remaining products related to brand name
app.get('/relatedproductdetails/:pname',(req,res) => {
  let pname = req.params.pname;
  let query = {}
  if(pname){
    query = {"brands.brand_name":pname}
  }
  db.collection('products').find(query).toArray((err,result) => {
    if(err) throw err;
    res.send(result)
  })
})
// app.get('/menu/:id',(req,res) => {
//   let id = Number(req.params.id)
//   db.collection('menu').find({restaurant_id:id}).toArray((err,result) => {
//     if(err) throw err;
//     res.send(result)
//   })
// })

app.get('/orders',(req,res) => {
  let email = req.query.email;
  let query = {}
  if(email){
    //query = {email:email}
    query = {email}
  }
  db.collection('orders').find(query).toArray((err,result) => {
    if(err) throw err;
    res.send(result)
  })
})

//menu on basis user selected ids
app.post('/menuItem',(req,res) => {
  if(Array.isArray(req.body)){
    db.collection('products').find({product_id:{$in:req.body}}).toArray((err,result) => {
      if(err) throw err;
      res.send(result)
    })
  }else{
    res.send('Invalid Input')
  }
})

app.post('/placeOrder',(req,res) => {
  console.log(req.body)
  db.collection('orders').insert(req.body,(err,result) => {
    if(err) throw err;
    res.send(result)
  })
})

app.put('/updateOrder/:id',(req,res) => {
    let oid = Number(req.params.id);
    db.collection('orders').updateOne(
      {orderId:oid},
      {
        $set:{
          "status":req.body.status,
          "bank_name":req.body.bank_name,
          "date":req.body.date
        }
      },(err,result) => {
        if(err) throw err;
        res.send('Order Updated')
      }
    )
})

app.delete('/deleteOrder/:id',(req,res) => {
    let oid =  mongo.ObjectId(req.params.id)
    db.collection('orders').remove({_id:oid},(err,result) => {
      if(err) throw err;
      res.send('Order Deleted')
    })
})


//Connection with db
MongoClient.connect(mongoUrl,(err,client) => {
  if(err) console.log(`Error While Connecting`);
  db = client.db('dummydb');
  app.listen(port,(err) => {
    if(err) throw err;
    console.log(`Express Server listening on port ${port}`)
  })
})


/*
app.get('/restaurants/:id',(req,res) => {
  let id = req.params.id;
  let state = req.query.state
  let country  = req.query.country
  console.log(`>>>>>state>>>`,state)
  console.log(`>>>>>country>>>`,country)
  res.send(id)

  // db.collection('restaurants').find().toArray((err,result) => {
  //   if(err) throw err;
  //   res.send(result)
  // })
})
*/
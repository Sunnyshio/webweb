var express = require('express');
var app = express();

app.set("view engine", "ejs");

var fs = require("firebase-admin");
let serviceAccount;
if (process.env.GOOGLE_CREDENTIALS != null) {
    serviceAccount = JSON.parse(process.env.GOOGLE_CREDENTIALS)
}
else {
    serviceAccount = require("luxury-bags-28430-firebase-adminsdk-ailu1-3ecf54f6fe.json");
}
fs.initializeApp({
    credential: fs.credential.cert(serviceAccount)
});

const db = fs.firestore();
const ingColl = db.collection('items');

app.get('/', async function (req, res) {
  const items = await ingColl.get();
  let data = {
      url: req.url,
      itemData: items.docs,
  }
  res.render('index', data);
});

app.get('/item/:itemid', async function (req, res) {
  try {
      console.log(req.params.itemid);

  } catch (e) {
  }
  const item_id = req.params.itemid;
  const item_ref = ingColl.doc(item_id);
  const doc = await item_ref.get();
  let itemData = doc.data();

  const procure_ref = itemColl.doc(item_id).collection('sales1')
  hist_array=[]
  await procure_ref.get().then(subCol => {
    subCol.docs.forEach(element => {
        hist_array.push(element.data());
    })
    console.log('Procurement data:', hist_array)

    res.render('item', {itemData, db, hist_array})
  });
});
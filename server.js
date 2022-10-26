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
  if (!doc.exists) {
      console.log('No such document!');
  } else {
      console.log('Document data:', doc.data());
  }
  // const items = await ingColl.get();
  let data = {
      url: req.url,
      itemData: doc.data(),
  }
  res.render('item', data);
});

app.get("/", (req, res) => {
    res.render("index.ejs");
})
// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));


app.listen(port, function() {
  console.log('Our app is running on http://localhost:' + port);
});
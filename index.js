const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.HUBSPOT_ACCESS_TOKEN;
const CUSTOM_OBJECT_TYPE = process.env.CUSTOM_OBJECT_TYPE;

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get("/", async (req, res) => {
    const endpoint = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}?properties=game_name,publisher,price`;
    const headers = {
      Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
      'Content-Type': 'application/json'
    };
  
    try {
      const resp = await axios.get(endpoint, { headers });
      const allRecords = resp.data.results;
  
      const data = allRecords.filter(record =>
        record.properties &&
        record.properties.game_name &&
        record.properties.publisher &&
        record.properties.price
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
      console.log("✅ Filtered records:", data);
      res.render('homepage', { title: 'Custom Object Table', records: data });
    } catch (err) {
      console.error("❌ Error fetching records:", err.response?.data || err.message);
      res.status(500).send("Error fetching custom object records");
    }
  });
  
  
  
// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get("/update-cobj", (req, res) => {
    res.render("updates", {
        title: "Update Custom Object Form | Integrating With HubSpot I Practicum"
    });
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post("/update-cobj", async (req, res) => {
    const { game_name, publisher, price } = req.body;
  
    console.log("🔧 Form data received:", req.body);
  
    const endpoint = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`;
    const headers = {
      Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
      'Content-Type': 'application/json'
    };
  
    const newRecord = {
      properties: {
        game_name,
        publisher,
        price: parseFloat(price)
      }
    };
  
    console.log("📤 Sending to HubSpot:", newRecord);
  
    try {
      const response = await axios.post(endpoint, newRecord, { headers });
      console.log("✅ Record created:", response.data);
      res.redirect("/");
    } catch (err) {
      console.error("❌ Error creating record:", err.response?.data || err.message);
      res.status(500).send("Error creating custom object record");
    }
  });
  


/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
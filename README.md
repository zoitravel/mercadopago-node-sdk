# Mercadopago SDK module for Payments integration

* [Usage](#usage)
* [Using Mercadopago Checkout](#checkout)
* [Using Mercadopago Payment collection](#payments)

<a name="usage"></a>
### Usage:

```
$ npm install mercadopago
```

* Get your credentials at [Mercadopago Developers Site](https://developers.mercadopago.com/beta/api-de-checkout#get-credentials).
* Replace your CLIENT_ID and CLIENT_SECRET.

```javascript
var MP = require ("mercadopago");

var mp = new MP ("CLIENT_ID", "CLIENT_SECRET");
```

<a name="checkout"></a>
### Using Mercadopago Checkout

Create a Checkout preference:

```javascript
var preference = {
        "items": [
            {
                "title": "Test",
                "quantity": 1,
                "currency_id": "USD",
                "unit_price": 10.5
            }
        ]
    };

mp.createPreference (preference, function (err, data){
        if (err) {
            console.log (err);
        } else {
            console.log (JSON.stringify (data, null, 4));
        }
    });
```

Get an existent Checkout preference:

```javascript
mp.getPreference ("PREFERENCE_ID", function (err, data){
        if (err) {
            console.log (err);
        } else {
            console.log (JSON.stringify (data, null, 4));
        }
    });
```

Update an existent Checkout preference:

```javascript
var preference = {
        "items": [
            {
                "title": "Test Modified",
                "quantity": 1,
                "currency_id": "USD",
                "unit_price": 20.4
            }
        ]
    };

mp.updatePreference ("PREFERENCE_ID", preference, function (err, data){
        if (err) {
            console.log (err);
        } else {
            console.log (JSON.stringify (data, null, 4));
        }
    });
```

<a name="payments"></a>
### Using Mercadopago Payment

Searching:

```javascript
var filters = {
        "id": null,
        "site_id": null,
        "external_reference": null
    };

mp.searchPayment (filters, function (err, data){
        if (err) {
            console.log (err);
        } else {
            console.log (JSON.stringify (data, null, 4));
        }
    });
```

Receiving IPN notification:

```javascript
var MP = require ("mercadopago"),
	http = require("http"),
	url = require('url');

var mp = new MP ("CLIENT_ID", "CLIENT_SECRET");

function onRequest(request, response) {
	var qs = url.parse (request.url, true).query;

	mp.getPaymentInfo (qs["id"], function (err, data){
        if (err) {
            console.log (err);
            response.writeHead(200, {
                'Content-Type' : 'application/json; charset=utf-8'
            });
            response.write (err);
            response.end();
        } else {
            console.log (JSON.stringify (data, null, 4));
            response.writeHead(200, {
                'Content-Type' : 'application/json; charset=utf-8'
            });
            response.write (JSON.stringify (data));
            response.end();
        }
    });
}

http.createServer(onRequest).listen(8888);
```

Cancel (only for pending payments):

```javascript
mp.cancelPayment ("ID", function (err, data){
        if (err) {
            console.log (err);
        } else {
            console.log (JSON.stringify (data, null, 4));
        }
    });
```

Refund (only for accredited payments):

```javascript
mp.refundPayment ("ID", function (err, data){
        if (err) {
            console.log (err);
        } else {
            console.log (JSON.stringify (data, null, 4));
        }
    });
```
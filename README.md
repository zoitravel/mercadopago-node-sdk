# MercadoPago SDK module for Payments integration

* [Usage](#usage)
* [Using MercadoPago Checkout](#checkout)
* [Using MercadoPago Payment collection](#payments)

<a name="usage"></a>
## Usage:

```
$ npm install mercadopago
```

* Get your **CLIENT_ID** and **CLIENT_SECRET** in the following address:
	* Argentina: [https://www.mercadopago.com/mla/herramientas/aplicaciones](https://www.mercadopago.com/mla/herramientas/aplicaciones)
	* Brazil: [https://www.mercadopago.com/mlb/ferramentas/aplicacoes](https://www.mercadopago.com/mlb/ferramentas/aplicacoes)
	* México: [https://www.mercadopago.com/mlm/herramientas/aplicaciones](https://www.mercadopago.com/mlm/herramientas/aplicaciones)
	* Venezuela: [https://www.mercadopago.com/mlv/herramientas/aplicaciones](https://www.mercadopago.com/mlv/herramientas/aplicaciones)

```javascript
var MP = require ("mercadopago");

var mp = new MP ("CLIENT_ID", "CLIENT_SECRET");
```

### Get your Access Token:

```javascript
mp.getAccessToken(function (err, accessToken){
    console.log (accessToken);
});
```

<a name="checkout"></a>
## Using MercadoPago Checkout

### Create a Checkout preference:

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

<a href="http://developers.mercadopago.com/documentacion/recibir-pagos#glossary">Others items to use</a>

### Get an existent Checkout preference:

```javascript
mp.getPreference ("PREFERENCE_ID", function (err, data){
        if (err) {
            console.log (err);
        } else {
            console.log (JSON.stringify (data, null, 4));
        }
    });
```

### Update an existent Checkout preference:

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
## Using MercadoPago Payment

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


<a href="http://developers.mercadopago.com/documentacion/busqueda-de-pagos-recibidos">More search examples</a>

### Receiving IPN notification:

* Go to **Mercadopago IPN configuration**:
	* Argentina: [https://www.mercadopago.com/mla/herramientas/notificaciones](https://www.mercadopago.com/mla/herramientas/notificaciones)
	* Brasil: [https://www.mercadopago.com/mlb/ferramentas/notificacoes](https://www.mercadopago.com/mlb/ferramentas/notificacoes)
	* México: [https://www.mercadopago.com/mlm/herramientas/notificaciones](https://www.mercadopago.com/mlm/herramientas/notificaciones)
	* Venezuela: [https://www.mercadopago.com/mlv/herramientas/notificaciones](https://www.mercadopago.com/mlv/herramientas/notificaciones)<br />

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

### Cancel (only for pending payments):

```javascript
mp.cancelPayment ("ID", function (err, data){
        if (err) {
            console.log (err);
        } else {
            console.log (JSON.stringify (data, null, 4));
        }
    });
```

### Refund (only for accredited payments):

```javascript
mp.refundPayment ("ID", function (err, data){
        if (err) {
            console.log (err);
        } else {
            console.log (JSON.stringify (data, null, 4));
        }
    });
```
<a href=http://developers.mercadopago.com/documentacion/devolucion-y-cancelacion> About Cancel & Refund </a>

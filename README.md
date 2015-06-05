# MercadoPago SDK module for Payments integration

* [Install](#install)
* [Basic checkout](#basic-checkout)
* [Customized checkout](#custom-checkout)
* [Generic methods](#generic-methods)

<a name="install"></a>
## Install

```
$ npm install mercadopago
```

### Promises and Callbacks support

Every method supports either promises and callbacks. For example:

```javascript
var at = mp.getAccessToken ();

at.then (
    function (accessToken) {
        console.log (accessToken);
    },
    function (error) {
        console.log (error);
    });
```
is the same as:

```javascript
mp.getAccessToken(function (err, accessToken){
    if (err) {
        console.log (err);
    } else {
        console.log (accessToken);
    }
});
```

In order to use callbacks, simply pass a function as the last parameter.

<a name="basic-checkout"></a>
## Basic checkout

### Configure your credentials

* Get your **CLIENT_ID** and **CLIENT_SECRET** in the following address:
    * Argentina: [https://www.mercadopago.com/mla/herramientas/aplicaciones](https://www.mercadopago.com/mla/herramientas/aplicaciones)
    * Brazil: [https://www.mercadopago.com/mlb/ferramentas/aplicacoes](https://www.mercadopago.com/mlb/ferramentas/aplicacoes)
    * México: [https://www.mercadopago.com/mlm/herramientas/aplicaciones](https://www.mercadopago.com/mlm/herramientas/aplicaciones)
    * Venezuela: [https://www.mercadopago.com/mlv/herramientas/aplicaciones](https://www.mercadopago.com/mlv/herramientas/aplicaciones)
    * Colombia: [https://www.mercadopago.com/mco/herramientas/aplicaciones](https://www.mercadopago.com/mco/herramientas/aplicaciones)
    * Chile: [https://www.mercadopago.com/mlc/herramientas/aplicaciones](https://www.mercadopago.com/mlc/herramientas/aplicaciones)

```javascript
var MP = require ("mercadopago");

var mp = new MP ("CLIENT_ID", "CLIENT_SECRET");
```

### Preferences

#### Get an existent Checkout preference

```javascript
mp.getPreference ("PREFERENCE_ID");
```

#### Create a Checkout preference

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

mp.createPreference (preference);
```

#### Update an existent Checkout preference:

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

mp.updatePreference ("PREFERENCE_ID", preference);
```

### Payments/Collections

#### Search for payments

```javascript
var filters = {
        "id": null,
        "site_id": null,
        "external_reference": null
    };

mp.searchPayment (filters)
    .then (
        function success (data) {
            console.log (JSON.stringify (data, null, 4));
        },
        function error (err) {
            console.log (err);
        }
    });
```

#### Get payment data

```javascript
mp.getPayment (qs["id"])
    .then (
        function success (data) {
            console.log (JSON.stringify (data, null, 4));
        },
        function error (err) {
            console.log (err);
        }
    });
```

#### Cancel (only for pending payments)

```javascript
mp.cancelPayment ("ID");
```

#### Refund (only for accredited payments)

```javascript
mp.refundPayment ("ID");
```

<a name="custom-checkout"></a>
## Customized checkout

### Configure your credentials

* Get your **ACCESS_TOKEN** in the following address:
    * Argentina: [https://www.mercadopago.com/mla/account/credentials](https://www.mercadopago.com/mla/account/credentials)
    * Brazil: [https://www.mercadopago.com/mlb/account/credentials](https://www.mercadopago.com/mlb/account/credentials)
    * Mexico: [https://www.mercadopago.com/mlm/account/credentials](https://www.mercadopago.com/mlm/account/credentials)
    * Venezuela: [https://www.mercadopago.com/mlv/account/credentials](https://www.mercadopago.com/mlv/account/credentials)
    * Colombia: [https://www.mercadopago.com/mco/account/credentials](https://www.mercadopago.com/mco/account/credentials)

```javascript
var MP = require ("mercadopago");

var mp = new MP ("ACCESS_TOKEN");
```

### Create payment

```javascript
mp.post ("/v1/payments", payment_data)
    .then (...);
```

### Create customer

```javascript
mp.post ("/v1/customers", {"email": "email@test.com"})
    then (...);
```

### Get customer

```javascript
mp.get ("/v1/customers/CUSTOMER_ID")
    .then (...);
```

* View more Custom checkout related APIs in Developers Site
    * Argentina: [https://labs.mercadopago.com.ar/developers](https://labs.mercadopago.com.ar/developers)
    * Brazil: [https://labs.mercadopago.com.br/developers](https://labs.mercadopago.com.br/developers)
    * Mexico: [https://labs.mercadopago.com.mx/developers](https://labs.mercadopago.com.mx/developers)
    * Venezuela: [https://labs.mercadopago.com.ve/developers](https://labs.mercadopago.com.ve/developers)
    * Colombia: [https://labs.mercadopago.com.co/developers](https://labs.mercadopago.com.co/developers)

<a name="generic-methods"></a>
## Generic methods

You can access any other resource from the MercadoPago API using the generic methods:

```javascript
// Get a resource, with optional URL params. Also you can disable authentication for public APIs
mp.get ("/resource/uri", [params], [authenticate=true]);

// Create a resource with "data" and optional URL params.
mp.post ("/resource/uri", data, [params]);

// Update a resource with "data" and optional URL params.
mp.put ("/resource/uri", data, [params]);

// Delete a resource with optional URL params.
mp.delete ("/resource/uri", [params]);
```

 For example, if you want to get the Sites list (no params and no authentication):

```javascript
mp.get ("/sites", null, false)
    .then (function (sites) {
        console.log (sites);
    });
```

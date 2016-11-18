"use strict";

const MP = require("../lib/mercadopago");
const assert = require("assert");
const credentials = require("./../credentials");
const casual = require('casual');
const _ = require('lodash');

process.setMaxListeners(0);

describe("Basic payment operations", function(){
  let mp, paymentPayload, cardToken;

  before ("Instantitate MP", function () {
    mp = new MP(credentials.ACCESS_TOKEN);
    paymentPayload = {
      "payer" : {
        "email": casual.email,
        "identification": {
          "number" : casual.numerify('#######'),
          "type"   : "NIT" //NIT, Otro, RUT
        }
      },
      "installments": 1,
      "binary_mode": true,
      "external_reference": casual.numerify('#######'),
      "transaction_amount": casual.integer(0,1000000),
      "capture": true,
      "token": "854447387a6b9d15444ec84a3e76a66f", //
      "statement_descriptor": casual.short_description,
      "payment_method_id": "visa", // this usaually works
      "notification_url": casual.url,
      "additional_info": {
        "payer": {
          "first_name": casual.first_name,
          "last_name": casual.last_name,
          "registration_date": casual.date
        }
      }
    };
    cardToken = {
      "email": casual.email,
      "cardNumber": "4509 9535 6623 3704", //test card given by mercado pago
      "securityCode": casual.numerify('###'),
      "cardExpirationMonth": '' + casual.integer(1,12), // representing months only
      "cardExpirationYear": '20' + casual.integer(18,25), // easiest way to create a valid expiration from now
      "cardholder" : {
        "name" : _.sample(['APRO','CONT','CALL','FUND','SECU','EXPI','FORM','OTHE']),
        "identification": {
          "number" : casual.numerify('########'),
          "type"   : "Otro" // Other id types don't seem to work
        }
      }
    };
  });

  it('Should create a card token successfully', function(done) {
    this.timeout(5000);

    mp.createCardToken(cardToken)
      .then((res) => {
        assert.equal(!_.isNil(res.response.id), true, 'card token retrieved');
        done();
      })
      .catch(console.log)
  });

  it("Should create a payment an approved payment", function(done) {
    this.timeout(5000);

    mp.createCardToken(cardToken)
      .tap((res) => paymentPayload.token = res.response.id)
      .then((res) => mp.createPayment(paymentPayload))
      .then((res) => {
        assert.equal(!_.isNil(res.response.id), true, 'payment created');
        done();
      })
      .catch(console.log)
  });
});
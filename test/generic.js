"use strict";

const MP = require("../lib/mercadopago");
const MercadoPagoError = MP.MercadoPagoError;
const assert = require("assert");
const credentials = require("./../credentials");

process.setMaxListeners(0);

describe("Generic methods", function(){
	this.timeout(5000);

	let mp;

	before ("Instantitate MP", function () {
		mp = new MP(credentials.ACCESS_TOKEN);
	});

	it("Should get a resource without authorization", function(done) {
		let request = {
			"uri": "/sites/MLA",
			"authenticate": false
		};

    mp.get(request)
      .then((data) => {
        assert.equal(data.status, 200);
        assert.equal(data.response.id, "MLA");
        done();
      })
      .catch(done)
	});

	it("Should not allow unauthorized request", function(done) {
		let request = {
            "uri": "/checkout/preferences/dummy",
            "authenticate": false
		};

		mp.get(request)
      .then((data) => {
				assert(data instanceof MercadoPagoError);
				done();
		});
	});

	it("Should use idempotency and not create duplicated resource", function(done) {
    // Card token
    let data = {
      email : 'test_user_19653727@testuser.com',
      cardNumber : '4509 9535 6623 3704',
      securityCode : '123',
      cardExpirationMonth : '12',
      cardExpirationYear : '2015',
      cardholder : {
        name : 'APRO',
        identification : {
          number : '1234567',
          type   : 'Otro'
        }
      }
    };

    let request = {
      uri : '/card_tokens',
      data : data
    };

    mp.post(request)
      .then((cardtoken) => {
        //Payment
        let data = {
          token : cardtoken.response.id,
          description : 'Payment test',
          transaction_amount : 154.9,
          payment_method_id : 'visa',
          payer : {
            email : 'test@localsdk.com'
          },
          installments : 1
        };
        let request = {
          uri : '/payments',
          data,
          headers : {
            'x-idempotency-key' : "sdk-test-idempotency-dummy-key"
          }
        };

        mp.post(request)
          .then((p1) => {
            mp.post(request)
              .then((p2) => {
                assert.equal(p1.response.id, p2.response.id);
                done();
              }).catch(done)
          }).catch(done)
      }).catch(done);
	});

	it("Should create and delete a customer", function(done) {
    let request = {
      uri : "/customers",
      data : {
        email : "test_"+new Date().getTime()+"@localsdk.com",
        identification : {
          number : '1234567',
          type   : 'Otro'
        }
      }
    };

		mp.post(request)
      .then((customer) => {
        assert.equal(customer.status, 201, "Create customer");
        let request = {
          uri : "/customers/" + customer.response.id
        };

        mp.delete(request)
          .then((deletedCustomer) => {
            assert.equal(deletedCustomer.status, 200);
            done();
          })
      })
      .catch(done);
	});
});
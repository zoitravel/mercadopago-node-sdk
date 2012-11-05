var MP      = require("mercadopago"),
    vows    = require("vows"),
    assert  = require("assert"),
    events  = require("events");

vows
    .describe("Unit Tests")
    .addBatch({
        "Get Preference": {
            topic: function () {
                var _self = this;

                var mp = new MP("CLIENT_ID", "CLIENT_SECRET");

                mp.getPreference("ID")
                    .on("success", function (resp){
                        _self.callback(null, resp);
                    })
                    .on("error", function (resp){
                        _self.callback(true, resp);
                    });
            },
            "status 200": function (err, resp) {
                assert.equal(resp.status, 200);
            }
        },
        "Create Preference": {
            topic: function () {
                var _self = this;

                var mp = new MP("CLIENT_ID", "CLIENT_SECRET");

                var preference = {
                  "items": [
                    {
                      "title": "sdk-nodejs",
                      "quantity": 1,
                      "currency_id": "ARS",
                      "unit_price": 10.5
                    }
                  ]
                };

                mp.createPreference(preference)
                    .on("success", function (resp){
                        _self.callback(null, resp);
                    })
                    .on("error", function (resp){
                        _self.callback(true, resp);
                    });
            },
            "status 201": function (err, resp) {
                assert.isNull(err);

                assert.equal(resp.status, 201);
            },
            "preference data": function (err, resp) {
                assert.isNull(err);

                assert.equal(resp.response.items[0].title, "sdk-nodejs");
                assert.equal(resp.response.items[0].quantity, 1);
                assert.equal(resp.response.items[0].unit_price, 10.5);
                assert.equal(resp.response.items[0].currency_id, "ARS");
            }
        },
        "Update Preference": {
            topic: function () {
                var _self = this;

                var mp = new MP("CLIENT_ID", "CLIENT_SECRET");

                var preference = {
                  "items": [
                    {
                      "title": "test2",
                      "quantity": 1,
                      "currency_id": "ARS",
                      "unit_price": 20.55
                    }
                  ]
                };

                mp.createPreference(preference)
                    .on("success", function (resp){
                        var mp = new MP("CLIENT_ID", "CLIENT_SECRET");

                        var preference = {
                          "items": [
                            {
                              "title": "test2Modified",
                              "quantity": 2,
                              "currency_id": "USD",
                              "unit_price": 100
                            }
                          ]
                        };

                        var preferenceId = resp.response.id;

                        mp.updatePreference (preferenceId, preference)
                            .on("success", function (resp){
                                var updateStatus = resp.status;

                                var mp = new MP("CLIENT_ID", "CLIENT_SECRET");

                                mp.getPreference(preferenceId)
                                    .on("success", function (resp){
                                        resp.updateStatus = updateStatus;

                                        _self.callback(null, resp);
                                    })
                                    .on("error", function (resp){
                                        _self.callback(true, resp);
                                    });
                            })
                            .on("error", function (resp){
                                _self.callback(true, resp);
                            });
                    })
                    .on("error", function (resp){
                        _self.callback(true, resp);
                    });
            },
            "status 200": function (err, resp) {
                assert.isNull(err);

                assert.equal(resp.updateStatus, 200);
            },
            "preference data": function (err, resp) {
                assert.isNull(err);

                assert.equal(resp.response.items[0].title, "test2Modified");
                assert.equal(resp.response.items[0].quantity, 2);
                assert.equal(resp.response.items[0].unit_price, 100);
                assert.equal(resp.response.items[0].currency_id, "USD");
            }
        }
    }).run();

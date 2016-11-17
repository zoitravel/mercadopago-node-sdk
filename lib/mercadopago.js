"use strict";

const p = require("../package");
const request = require ("request");
const Promise = require ("bluebird");

let config = {
	API_BASE_URL: "https://api.mercadopago.com",
	MIME_JSON: "application/json",
	MIME_FORM: "application/x-www-form-urlencoded"
};

function MercadoPagoError(message, status) {
	this.name = "MercadoPagoError";
	this.message = message || "MercadoPago Unknown error";
	this.stack = (new Error()).stack;
	this.status = status || 500;
}

MercadoPagoError.prototype = Object.create(Error.prototype);
MercadoPagoError.prototype.constructor = MercadoPagoError;

let MP = function () {
	let __llAccessToken,
		__clientId,
		__clientSecret,
		__sandbox = false;

	if (arguments.length > 2 || arguments.length < 1) {
		throw new MercadoPagoError("Invalid arguments. Use CLIENT_ID and CLIENT SECRET, or ACCESS_TOKEN", 400);
	}

	if (arguments.length == 1) {
		__llAccessToken = arguments[0];
	}

	if (arguments.length == 2) {
		__clientId = arguments[0];
		__clientSecret = arguments[1];
	}

	// Instance creation
	let mp = {};

    /**
     * Switch or get Sandbox Mode for Basic Checkout
     */
	mp.sandboxMode = function (enable) {
		if (enable !== null && enable !== undefined) {
			__sandbox = enable === true;
		}

		return __sandbox;
	};

    /**
     * Get Access Token for API use
     */
	mp.getAccessToken = function () {
		let next = typeof (arguments[arguments.length -1]) == "function" ? arguments[arguments.length -1] : null;
		let deferred = Promise.defer();

		if (__llAccessToken) {
			next && next(null, __llAccessToken);
			deferred.resolve (__llAccessToken);
		} else {
      MPRestClient.post({
        "uri": "/oauth/token",
        "data": {
          "client_id": __clientId,
          "client_secret": __clientSecret,
          "grant_type": "client_credentials"
        },
        "headers": {
          "Content-type": config.MIME_FORM
        }
      })
      .then((data) => {
        next && next(null, data.response.access_token);
        deferred.resolve (data.response.access_token);
      })
      .catch((err) => {
        next && next(err);
        deferred.reject (err);
      });
    }

    return deferred.promise;
	};

  /** Check authentication function */
  function checkAuthentication(authenticate){
    return new Promise((resolve) => {
      if (authenticate) {
        resolve(mp.getAccessToken());
      } else {
        resolve();
      }
    });

  }

	/**
	Generic resource get
	@param req
	@param params (deprecated)
	@param authenticate = true (deprecated)
	*/
	mp.get = function (req) {
		let next = typeof (arguments[arguments.length -1]) == "function" ? arguments[arguments.length -1] : null;
		let deferred = Promise.defer();

		if (typeof req == "string") {
			req = {
				"uri": req,
				"params": arguments[1],
				"authenticate": arguments[2]
			};
		}

		req.authenticate = req.authenticate !== false;

    checkAuthentication(req.authenticate)
      .then((at) => {
        if (at) {
          req.params || (req.params = {});
          req.params.access_token = at;
        }

        MPRestClient.get(req)
          .then((data) => {
            next && next(null, data);
            deferred.resolve(data);
          })
          .catch((err) => {
            next && next(err);
            deferred.reject(err);
          });
      })
      .catch(() => deferred.reject);

    return deferred.promise;
	};

	/**
	Generic resource post
	@param req
	@param data (deprecated)
	@param params (deprecated)
	*/
	mp.post = function (req) {
		let next = typeof (arguments[arguments.length -1]) == "function" ? arguments[arguments.length -1] : null;
		let deferred = Promise.defer();

		if (typeof req == "string") {
			req = {
				"uri": req,
				"data": arguments[1],
				"params": arguments[2]
			};
		}

		req.authenticate = req.authenticate !== false;

    checkAuthentication(req.authenticate)
      .then((at) => {
        if (at) {
          req.params || (req.params = {});
          req.params.access_token = at;
        }

        MPRestClient.post(req)
          .then((data) => {
            next && next(null, data);
            deferred.resolve (data);
          })
          .catch((err) => {
            next && next(err);
            deferred.reject (err);
          });
      })
      .catch(() => deferred.reject);

		return deferred.promise;
	};

	/**
	Generic resource put
	@param req
	@param data (deprecated)
	@param params (deprecated)
	*/
	mp.put = function (req) {
		let next = typeof (arguments[arguments.length -1]) == "function" ? arguments[arguments.length -1] : null;
		let deferred = Promise.defer();

		if (typeof req == "string") {
			req = {
				"uri": req,
				"data": arguments[1],
				"params": arguments[2]
			};
		}

		req.authenticate = req.authenticate !== false;

    checkAuthentication(req.authenticate)
      .then((at) => {
        if (at) {
          req.params || (req.params = {});
          req.params.access_token = at;
        }

        MPRestClient.put(req)
          .then((data) => {
            next && next(null, data);
            deferred.resolve (data);
          })
          .catch((err) => {
            next && next(err);
            deferred.reject (err);
          });
      })
      .catch(() => deferred.reject);

		return deferred.promise;
	};

	/**
	Generic resource delete
	@param req
	@param params (deprecated)
	*/
	mp.delete = function (req) {
		let next = typeof (arguments[arguments.length -1]) == "function" ? arguments[arguments.length -1] : null;
		let deferred = Promise.defer();

		if (typeof req == "string") {
			req = {
				"uri": req,
				"params": arguments[1]
			};
		}

    req.authenticate = req.authenticate !== false;

    checkAuthentication(req.authenticate)
      .then((at) => {
        if (at) {
          req.params || (req.params = {});
          req.params.access_token = at;
        }

        MPRestClient.delete(req)
          .then ((data) => {
            next && next(null, data);
            deferred.resolve (data);
          })
          .catch((err) => {
            next && next(err);
            deferred.reject (err);
          });
      })
      .catch(() => deferred.reject);

		return deferred.promise;
	};

	// Backward compatibility
	/**
	Create a checkout preference
	@param preference
	@return json
	*/
	mp.createPreference = function (preference){
		let next = typeof (arguments[arguments.length -1]) == "function" ? arguments[arguments.length -1] : null;

		return mp.post ({
			"uri": "/checkout/preferences",
			"data": preference
		}, next);
	};

	/**
	Update a checkout preference
	@param id
	@param preference
	@return json
	*/
	mp.updatePreference = function (id, preference) {
		let next = typeof (arguments[arguments.length -1]) == "function" ? arguments[arguments.length -1] : null;

		return mp.put ({
			"uri": "/checkout/preferences/"+id,
			"data": preference
		}, next);
	};

	/**
	Get a checkout preference
	@param id
	@return json
	*/
	mp.getPreference = function (id) {
		let next = typeof (arguments[arguments.length -1]) == "function" ? arguments[arguments.length -1] : null;

		return mp.get ({
			"uri": "/checkout/preferences/"+id
		},next);
	};

	/**
	Create a preapproval payment
	@param preapprovalPayment
	@return json
	*/
	mp.createPreapprovalPayment = function (preapprovalPayment){
		let next = typeof (arguments[arguments.length -1]) == "function" ? arguments[arguments.length -1] : null;

		return mp.post ({
			"uri": "/preapproval",
			"data": preapprovalPayment
		}, next)
	};

	/**
	Update a preapproval payment
  @param id
	@param preapprovalPayment
	@return json
	*/
	mp.updatePreapprovalPayment = function (id, preapprovalPayment){
		let next = typeof (arguments[arguments.length -1]) == "function" ? arguments[arguments.length -1] : null;

		return mp.put ({
			"uri": "/preapproval/"+id,
			"data": preapprovalPayment
		}, next)
	};

	/**
	Get a preapproval payment
	@param id
	@return json
	*/
	mp.getPreapprovalPayment = function (id) {
		let next = typeof (arguments[arguments.length -1]) == "function" ? arguments[arguments.length -1] : null;

		return mp.get ({
			"uri": "/preapproval/"+id
		}, next);
	};

	/**
	Search payments according to filters, with pagination
	@param filters
	@param offset
	@param limit
	@return json
	*/
	mp.searchPayment = function (filters, offset, limit) {
		let next = typeof (arguments[arguments.length -1]) == "function" ? arguments[arguments.length -1] : null;

		if (!isNaN(offset)) {
			filters.offset = offset;
		}
		if (!isNaN(limit)) {
			filters.limit = limit;
		}

		let uriPrefix = this.__sandbox ? "/sandbox" : "";

		return mp.get ({
			"uri": uriPrefix+"/collections/search",
			"params": filters
		}, next);
	};

	/**
	Get information for specific payment
	@param id
	@return json
	*/
	mp.getPayment = mp.getPaymentInfo = function (id) {
		let next = typeof (arguments[arguments.length -1]) == "function" ? arguments[arguments.length -1] : null;

		let uriPrefix = this.__sandbox ? "/sandbox" : "";

		return mp.get ({
			"uri": uriPrefix+"/collections/notifications/"+id
		}, next);
	};

	/**
	Get information for specific authorized payment
	@param id
	@return json
	*/
	mp.getAuthorizedPayment = function (id) {
		let next = typeof (arguments[arguments.length -1]) == "function" ? arguments[arguments.length -1] : null;

		return mp.get ({
			"uri": "/authorized_payments/"+id
		}, next);
	};

	/**
	Refund accredited payment
	@param id
	@return json
	*/
	mp.refundPayment = function (id) {
		let next = typeof (arguments[arguments.length -1]) == "function" ? arguments[arguments.length -1] : null;

		return mp.put ({
			"uri": "/collections/"+id,
			"data": {
				"status": "refunded"
			}
		}, next);
	};

	/**
	Cancel pending payment
	@param id
	@return json
	*/
	mp.cancelPayment = function (id) {
		let next = typeof (arguments[arguments.length -1]) == "function" ? arguments[arguments.length -1] : null;

		return mp.put ({
			"uri": "/collections/"+id,
			"data": {
				"status": "cancelled"
			}
		}, next);
	};

	/**
	Cancel preapproval payment
	@param id
	@return json
	*/
	mp.cancelPreapprovalPayment = function (id) {
		let next = typeof (arguments[arguments.length -1]) == "function" ? arguments[arguments.length -1] : null;

		return mp.put ({
			"uri": "/preapproval/"+id,
			"data": {
				"status": "cancelled"
			}
		}, next);
	};

	// Instance return
	return mp;
};

MP.version = p.version;

// /*************************************************************************/

let MPRestClient = (function() {
	function buildRequest (req) {
		let request = {};

		request.uri = config.API_BASE_URL + req.uri;
		request.method = req.method || "GET";

		req.headers || (req.headers = {});

		request.headers = {
			"user-agent": "MercadoPago Node.js SDK v"+MP.version,
			"accept": config.MIME_JSON,
			"content-type": config.MIME_JSON
		};
		Object.keys(req.headers).map(function (h) {
			request.headers[h.toLowerCase()] = req.headers[h];
		});

		if (req.data) {
			if (request.headers["content-type"] == config.MIME_JSON) {
				request.json = req.data;
			} else {
				request.form = req.data;
			}
		}

		if (req.params) {
			request.qs = req.params;
		}

		request.strictSSL = true;

		return request;
	}

	function exec (req) {
		let deferred = Promise.defer();

		req = buildRequest(req);

		request(req, function(error, response, body) {
			if (error) {
				deferred.reject (new MercadoPagoError(error));
			} else if (response.statusCode < 200 || response.statusCode >= 300) {
				deferred.reject (new MercadoPagoError(body ? body.message || body : "Unknown", response.statusCode));
			} else {
				try {
					(typeof body == "string") && (body = JSON.parse(body));
				} catch (e) {
					deferred.reject(new MercadoPagoError ("Bad response"));
				}

				deferred.resolve ({
					"status": response.statusCode,
					"response": body
				});
			}
		});

		return deferred.promise;

	}

	// Instance creation
	let restclient = {};

	restclient.get = function (req) {
		req.method = "GET";

		return exec(req);
	};

	restclient.post = function (req) {
		req.method = "POST";

		return exec(req);
	};

	restclient.put = function (req) {
		req.method = "PUT";

		return exec(req);
	};

	restclient.delete = function (req) {
		req.method = "DELETE";

		return exec(req);
	};

	return restclient;
})();

module.exports = MP;
module.exports.MercadoPagoError = MercadoPagoError;
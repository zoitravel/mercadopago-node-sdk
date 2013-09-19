var package = require("../package"),
	request = require ("request");

var config = {
	API_BASE_URL: "https://api.mercadolibre.com",
	MIME_JSON: "application/json",
	MIME_FORM: "application/x-www-form-urlencoded"
};

MP = function (clientId, clientSecret) {
	this.__clientId = clientId;
	this.__clientSecret = clientSecret;
	this.__sandbox = false;
};

MP.version = package.version;

MP.prototype.sandboxMode = function (enable) {
	if (enable !== null) {
		this.__sandbox = enable === true;
	}

	return this.__sandbox;
};

MP.prototype.getAccessToken = function () {
	var __self = this;

	var next = typeof (arguments[arguments.length -1]) == "function" ? arguments[arguments.length -1] : null;

	if (!next) {
		throw new Error ("No callback function defined");
		return;
	}

	MP.restClient.post(
		"/oauth/token",
		{
			"client_id": this.__clientId,
			"client_secret": this.__clientSecret,
			"grant_type": "client_credentials"
		},
		config.MIME_FORM, 
		function(error, resp) {
			if (error) {
				next (error);
			} else if (resp.status != 200) {
				next (resp.response)
			} else {
				next (null, resp.response.access_token);
			}
		}
	);
};

/**
Get information for specific payment
@param id
@return json
*/    
MP.prototype.getPayment = MP.prototype.getPaymentInfo = function (id) {
	var __self = this;

	var next = typeof (arguments[arguments.length -1]) == "function" ? arguments[arguments.length -1] : null;

	if (!next) {
		throw new Error ("No callback function defined");
		return;
	}

	this.getAccessToken (function (err, accessToken){
		if (err) {
			next (err);
			return;
		}

		var uriPrefix = __self.__sandbox ? "/sandbox" : "";

		MP.restClient.get(
			uriPrefix+"/collections/notifications/"+id+"?access_token="+accessToken,
			config.MIME_JSON, 
			next
		);
	});
};

/**
Get information for specific authorized payment
@param id
@return json
*/    
MP.prototype.getAuthorizedPayment = function (id) {
	var __self = this;

	var next = typeof (arguments[arguments.length -1]) == "function" ? arguments[arguments.length -1] : null;

	if (!next) {
		throw new Error ("No callback function defined");
		return;
	}

	this.getAccessToken (function (err, accessToken){
		if (err) {
			next (err);
			return;
		}

		MP.restClient.get(
			"/authorized_payments/"+id+"?access_token="+accessToken,
			config.MIME_JSON, 
			next
		);
	});
};

/**
Refund accredited payment
@param id
@return json
*/    
MP.prototype.refundPayment = function (id) {
	var __self = this;

	var next = typeof (arguments[arguments.length -1]) == "function" ? arguments[arguments.length -1] : null;

	if (!next) {
		throw new Error ("No callback function defined");
		return;
	}

	this.getAccessToken (function (err, accessToken){
		if (err) {
			next (err);
			return;
		}

		MP.restClient.put(
			"/collections/"+id+"?access_token="+accessToken,
			{
				"status": "refunded"
			},
			config.MIME_JSON, 
			next
		);
	});
};

/**
Cancel pending payment
@param id
@return json
*/    
MP.prototype.cancelPayment = function (id) {
	var __self = this;

	var next = typeof (arguments[arguments.length -1]) == "function" ? arguments[arguments.length -1] : null;

	if (!next) {
		throw new Error ("No callback function defined");
		return;
	}

	this.getAccessToken (function (err, accessToken){
		if (err) {
			next (err);
			return;
		}

		MP.restClient.put(
			"/collections/"+id+"?access_token="+accessToken,
			{
				"status": "cancelled"
			},
			config.MIME_JSON, 
			next
		);
	});
};

/**
Cancel preapproval payment
@param id
@return json
*/    
MP.prototype.cancelPreapprovalPayment = function (id) {
	var __self = this;

	var next = typeof (arguments[arguments.length -1]) == "function" ? arguments[arguments.length -1] : null;

	if (!next) {
		throw new Error ("No callback function defined");
		return;
	}

	this.getAccessToken (function (err, accessToken){
		if (err) {
			next (err);
			return;
		}

		MP.restClient.put(
			"/preapproval/"+id+"?access_token="+accessToken,
			{
				"status": "cancelled"
			},
			config.MIME_JSON, 
			next
		);
	});
};

/**
Search payments according to filters, with pagination
@param filters
@param offset
@param limit
@return json
*/
MP.prototype.searchPayment = function (filters, offset, limit) {
	var __self = this;

	var next = typeof (arguments[arguments.length -1]) == "function" ? arguments[arguments.length -1] : null;

	if (!next) {
		throw new Error ("No callback function defined");
		return;
	}

	this.getAccessToken (function (err, accessToken){
		if (err) {
			next (err);
			return;
		}

		var uriPrefix = __self.__sandbox ? "/sandbox" : "";

		MP.restClient.get(
			uriPrefix+"/collections/search?"+__self.__build_query(filters)+'&access_token='+accessToken,
			config.MIME_JSON, 
			next
		);
	});
};

/**
Create a checkout preference
@param preference
@return json
*/
MP.prototype.createPreference = function (preference){
	var __self = this;

	var next = typeof (arguments[arguments.length -1]) == "function" ? arguments[arguments.length -1] : null;

	if (!next) {
		throw new Error ("No callback function defined");
		return;
	}

	this.getAccessToken (function (err, accessToken){
		if (err) {
			next (err);
			return;
		}

		MP.restClient.post(
			"/checkout/preferences?access_token="+accessToken,
			preference,
			config.MIME_JSON, 
			next
		);
	});
};

/**
Update a checkout preference
@param id
@param preference
@return json
*/
MP.prototype.updatePreference = function (id, preference) {
	var __self = this;

	var next = typeof (arguments[arguments.length -1]) == "function" ? arguments[arguments.length -1] : null;

	if (!next) {
		throw new Error ("No callback function defined");
		return;
	}

	this.getAccessToken (function (err, accessToken){
		if (err) {
			next (err);
			return;
		}

		MP.restClient.put(
			"/checkout/preferences/"+id+"?access_token="+accessToken,
			preference,
			config.MIME_JSON, 
			next
		);
	});
};

/**
Get a checkout preference
@param id
@param preference
@return json
*/
MP.prototype.getPreference = function (id) {
	var __self = this;

	var next = typeof (arguments[arguments.length -1]) == "function" ? arguments[arguments.length -1] : null;

	if (!next) {
		throw new Error ("No callback function defined");
		return;
	}

	this.getAccessToken (function (err, accessToken){
		if (err) {
			next (err);
			return;
		}

		MP.restClient.get(
			"/checkout/preferences/"+id+"?access_token="+accessToken,
			config.MIME_JSON, 
			next
		);
	});
};

/**
Create a preapproval payment
@param preference
@return json
*/
MP.prototype.createPreapprovalPayment = function (preapprovalPayment){
	var __self = this;

	var next = typeof (arguments[arguments.length -1]) == "function" ? arguments[arguments.length -1] : null;

	if (!next) {
		throw new Error ("No callback function defined");
		return;
	}

	this.getAccessToken (function (err, accessToken){
		if (err) {
			next (err);
			return;
		}

		MP.restClient.post(
			"/preapproval?access_token="+accessToken,
			preapprovalPayment,
			config.MIME_JSON, 
			next
		);
	});
};

/**
Get a preapproval payment
@param id
@param preference
@return json
*/
MP.prototype.getPreapprovalPayment = function (id) {
	var __self = this;

	var next = typeof (arguments[arguments.length -1]) == "function" ? arguments[arguments.length -1] : null;

	if (!next) {
		throw new Error ("No callback function defined");
		return;
	}

	this.getAccessToken (function (err, accessToken){
		if (err) {
			next (err);
			return;
		}

		MP.restClient.get(
			"/preapproval/"+id+"?access_token="+accessToken,
			config.MIME_JSON, 
			next
		);
	});
};

/*************************************************************************/
MP.prototype.__build_query = function (params) {
	var elements = []

	for (var key in params) {
		if (params[key] == null) {
			params[key] = "";
		}

		elements.push(key+"="+escape(params[key]));
	}

	return elements.join("&");
};

MP.restClient = {
	__exec: function (uri, req, next) {
		req.uri = config.API_BASE_URL + uri;

		req.headers = {
			"User-Agent": "MercadoPago Node.js SDK v"+MP.version,
			"Accept": config.MIME_JSON
		}

		request(req, function(error, response, body) {
			(typeof body == "string") && (body = JSON.parse(body));

			if (error) {
				next (error);
			} else {
				next (null, {
							"status": response.statusCode,
							"response": body
						});
			}
		});
	},

	get: function (uri, contentType, next) {
		var req = {
			"method": "GET"
		}
		contentType == config.MIME_JSON && (req.json = true);

		this.__exec (uri, req, next);
	},

	post: function (uri, data, contentType, next) {
		var req = {
			"method": "POST"
		}

		contentType == config.MIME_JSON && (req.json = data);
		contentType == config.MIME_FORM && (req.form = data);

		this.__exec (uri, req, next);
	},

	put: function (uri, data, contentType, next) {
		var req = {
			"method": "PUT"
		}
		contentType == config.MIME_JSON && (req.json = data);
		contentType == config.MIME_FORM && (req.form = data);

		this.__exec (uri, req, next);
	}
};

module.exports = MP;
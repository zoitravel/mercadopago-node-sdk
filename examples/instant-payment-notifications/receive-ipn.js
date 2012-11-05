var MP = require ("../../project/lib/mercadopago"),
    config = require ("../config");

exports.run = function (req, res) {
    var mp = new MP (config.client_id, config.client_secret);

    mp.getPaymentInfo (req.param("id"), function (err, data){
        if (err) {
            res.send (err);
        } else {
            res.render ("jsonOutput", {"result": data});
        }
    });
};
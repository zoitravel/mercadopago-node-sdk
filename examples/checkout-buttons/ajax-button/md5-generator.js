var MD5 = require ("MD5");

exports.run = function (req, res) {
    var data =  "CLIENT_ID"+                    
                "CLIENT_SECRET"+                
                "1"+                            // item_quantity
                "ARS"+                          // item_currency_id
                "10.00"+                        // item_unit_price

                "CODE_012"+                     // item_id
                "BILL_001"+                     // external_reference
                ""+                             // excluded_payment_types_id
                ""+                             // excluded_payment_methods_id
                "";                             // credit_card_installments

    // Get md5 hash
    var md5 = MD5(data);

    res.send ({"md5": md5});
};
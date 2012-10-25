var MD5 = require ("MD5");

exports.run = function (req, res) {
    var data = {
        // Required
        "item_title": "Title",
        "item_quantity": "1",
        "item_unit_price": "10.00",
        "item_currency_id": "ARS", //Argentina: ARS, Brasil: BRL

        // Optional
        "item_id": "CODE_012",
        "item_description": "Description",
        "item_picture_url": "Image URL",
        "external_reference": "BILL_001",
        "payer_name": "",
        "payer_surname": "",
        "payer_email": "",
        "back_url_success": "https://www.success.com",
        "back_url_pending": ""
    };

    string md5String =  "CLIENT_ID"+                    
                        "CLIENT_SECRET"+                
                        data.item_quantity+                  // item_quantity
                        data.item_currency_id+               // item_currency_id
                        data.item_unit_price+                // item_unit_price

                        data.item_id+                        // item_id
                        data.external_reference;             // external_reference

    // Get md5 hash
    var md5 = MD5(md5String);

    res.render ("checkout-buttons/basic-button/button", {"data": data, "md5": md5});
};

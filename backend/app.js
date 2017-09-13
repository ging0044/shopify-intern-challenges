let get = require('./get');

let page = 1;
let invalid_customers = [];


get.get(page, function (data, err) {
    if (err) {
        console.error(err);
        return;
    }

    let validations = data.validations;
    let customers = data.customers;

    customers.forEach((customer) => {
        let invalid_customer = {id: customer.id, invalid_fields: []};
        validations.forEach((validation) => {
            let fieldName = Object.keys(validation)[0];
            let fieldConstraints = validation[fieldName];
            if (customer.hasOwnProperty(fieldName)) {
                if (typeof fieldConstraints.required !== 'undefined' && !fieldConstraints.required && customer[fieldName] === null) return;
                if (typeof fieldConstraints.required !== 'undefined' && (typeof customer[fieldName] === 'undefined' || customer[fieldName] === null)) {
                    //if true, field must not be null, else does not matter
                    invalid_customer.invalid_fields.push(fieldName);
                }
                else if (typeof fieldConstraints.type !== 'undefined' && typeof customer[fieldName] !== fieldConstraints.type) {
                    //if type is specified, type must match (obv), if no type given, does not matter
                    invalid_customer.invalid_fields.push(fieldName);
                }
                else if (typeof fieldConstraints.length !== 'undefined') {
                    //if length is specified, type is string
                    //length object contains min and max keys (optional)
                    if (typeof customer[fieldName] !== 'string') {
                        invalid_customer.invalid_fields.push(fieldName);
                    }
                    else if (typeof fieldConstraints.length.min !== 'undefined' && customer[fieldName].length < fieldConstraints.length.min) {
                        invalid_customer.invalid_fields.push(fieldName);
                    }
                    else if (typeof fieldConstraints.length.max !== 'undefined' && customer[fieldName].length > fieldConstraints.length.max) {
                        invalid_customer.invalid_fields.push(fieldName);
                    }
                }
            }
        });
        if (invalid_customer.invalid_fields.length !== 0) {
            invalid_customers.push(invalid_customer);
        }
    });
    console.dir({invalid_customers}, {depth: 11, colors: true});
});
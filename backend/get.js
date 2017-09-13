let https = require('https');
let Url = 'https://backend-challenge-winter-2017.herokuapp.com/customers.json?page=';

module.exports = {
    get: function(page, callback, customers) {https.get(Url + page, (res) => {
        const { statusCode } = res;
        const contentType = res.headers["content-type"];

        let err;
        if (statusCode !== 200){
            err = new Error('Failed GET request: Status code ' + statusCode);
        }
        else if (!/^application\/json/.test(contentType)){
            err = new Error('Unexpected content-type: ' + contentType);
        }
        if (err){
            callback(null, err);
            return;
        }

        let data = '';
        res.on('data', (x) => {
            data += x;
        });

        res.on('end', () => {
            try {
                data = JSON.parse(data);
                //console.log(data);

                if (customers)
                    data.customers.push.apply(data.customers, customers);
                this._checkPages(data, page, callback);
            }
            catch (e) {
                callback(null, e);
            }
        });
    })},
    _checkPages: function(data, page, callback) {
        if (data.customers.length < data.pagination.total) {
            this.get(++page, callback, data.customers);
            return;
        }
        try {
            callback(data);
        }
        catch (e) {
            callback(null, e);
        }
    }
};
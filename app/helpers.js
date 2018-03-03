const qs = require('qs');
const crypto = require('crypto');
const got = require('got');

module.exports = {

    isEmptyObject: (obj) => {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    },

    buildMessageSignature: (path, request, secret, nonce) => {
        const message = qs.stringify(request);
        const secret_buffer = new Buffer(secret, 'base64');
        const hash = new crypto.createHash('sha256');
        const hmac = new crypto.createHmac('sha512', secret_buffer);
        const hash_digest = hash.update(nonce + message).digest('binary');
        const hmac_digest = hmac.update(path + hash_digest, 'binary').digest('base64');

        return hmac_digest;
    },

    rawRequest: async (url, headers, data, timeout) => {

        headers['User-Agent'] = 'Kraken NodeJs API Trading Bot';

        const options = {headers, timeout};

        Object.assign(options, {
            method: 'POST',
            body: qs.stringify(data),
        });

        const {body} = await got(url, options);
        const response = JSON.parse(body);

        if (response.error && response.error.length) {
            const error = response.error
                .filter((e) => e.startsWith('E'))
                .map((e) => e.substr(1));

            if (!error.length) {
                throw new Error("Kraken API returned an unknown error");
            }

            throw new Error(error.join(', '));
        }

        return response.result;
    }

};
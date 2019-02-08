const View = {
    generate(text = null, data = null, success = true) {
        const response = {
            status: success ? 'success' : 'failed',
            body: {}
        };

        if (text !== null) {
            response.body.text = text;
        }

        if (data !== null) {
            response.body.data = data;
        }

        return response;
    }
};

module.exports = View;
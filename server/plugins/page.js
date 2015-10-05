exports.front = {
    file: function (request) {
        return '../client/view/' + 'index.html';
    }
};
exports.get = {
    file: function (request) {
        return '../client/' + request.params.filename;
    }
};
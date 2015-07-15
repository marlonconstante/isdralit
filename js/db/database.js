/* global exports */

/* global exports */

/**
 * Created by marlon on 17/12/14.
 */
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro de conexão:'));
db.once('open', function () {
    console.log('Conexão realizada com sucesso');
});

exports.saveOrUpdate = function (model, data, callback) {
    if (data._id) {
        model.findByIdAndUpdate(data._id, data, callback);
    } else {
        new model(data).save(callback);
    }
};

exports.remove = function (model, id, callback) {
    model.findByIdAndRemove(id, callback);
};

exports.findAll = function (model, query, fields, callback) {
    model.find(query, fields).sort('order').lean().exec(callback);
};

exports.saveAll = function (values, callback) {
    values.forEach(function (value) {
        value.save(callback);
    });
};

exports.removeAll = function (model, callback) {
    model.remove(callback);
};

exports.Menu = require('./menu');
exports.Banner = require('./banner');
exports.Product = require('./product');
exports.Information = require('./information');
exports.Item = require('./item');

var initialCharge = require('./initial-charge');
initialCharge.start();
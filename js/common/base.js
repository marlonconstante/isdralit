/**
 * Created by marlon on 30/12/14.
 */
var $ = require('jquery');
var ko = require('knockout');
var utils = require('./utils');

var external = this;

exports.isAdmin = function () {
    return external.inputValue('path') == 'admin';
};

exports.findAll = function (name, observableArray, query, itemAction, completionAction) {
    $.ajax({
        url: '/' + name + '/find' + external.queryString(query)
    }).done(function (values) {
        if (itemAction) {
            values.forEach(function (value) {
                itemAction(value);
            });
        }
        ko.utils.arrayPushAll(observableArray, values);
        if (completionAction) {
            completionAction();
        }
    });
};

exports.queryString = function (data) {
    utils.removeInvalidAttributes(data);
    if (!$.isEmptyObject(data)) {
        return '?'.concat($.param(data));
    }
    return '';
};

exports.inputValue = function (name) {
    return $('input[name=' + name + ']').val();
};

exports.currentQuery = function () {
    return JSON.parse(external.inputValue('query'));
};

exports.getBackgroundUrl = function (value) {
    return value ? 'url(' + value + ')' : 'none';
};

exports.addBackgroundImage = function (item, fieldName) {
    var value = item[fieldName];
    if ($.isArray(value)) {
        value = value.length ? value[0] : '';
    }
    if (value && value.path)
    {
        value = '/' + value.path;
    }
    item.backgroundImage = external.getBackgroundUrl(value);
};

exports.showContent = function () {
    $('body > .spinner').css('display', 'none');
    $('body > .content').css('display', 'block');
};

exports.ViewModel = function () {
    var self = this;

    self.menus = ko.observableArray([]);

    self.openUrl = function (value) {
        window.location = value['url'];
    };

    if (!external.isAdmin()) {
        external.findAll('menu', self.menus, {}, function (menu) {
            menu.isInstitucional = menu.name == 'Institucional';
            if (menu.isInstitucional)
            {
                menu.institutions = ko.observableArray([]);
                external.findAll('institution', menu.institutions, {}, function (institution) {
                    //console.log( institution);
                });
            }
        });
    }

    external.showContent();
};
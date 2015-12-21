'use strict';

var tabs = require('sdk/tabs');
var { get_cookie_permission } = require('cookie_permissions.js');
var { update_state } = require('menu.js');

tabs.on('activate', function(tab) {
    var perm = get_cookie_permission(tab.url);
    update_state(tab, perm);
});

tabs.on('ready', function(tab) {
    if (tab === tabs.activeTab) {
        var perm = get_cookie_permission(tab.url);
        update_state(tab, perm);
    }
});

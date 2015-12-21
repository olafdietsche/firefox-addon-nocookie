// -*- mode: javascript -*-
// Copyright (c) 2015 Olaf Dietsche

const { Cc, Ci } = require('chrome');

var io_svc = Cc['@mozilla.org/network/io-service;1'].getService(Ci.nsIIOService);
var cookie_permission = Cc['@mozilla.org/cookie/permission;1'].getService(Ci.nsICookiePermission);
var pref_svc = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService);
var permission_mgr = Cc["@mozilla.org/permissionmanager;1"].getService(Ci.nsIPermissionManager);

function make_uri(spec) {
    return io_svc.newURI(spec, null, null);
}

function normalize_uri(uri) {
    var re = /(.+?):\/\/(.+?)[\/#]/;
    var m = re.exec(uri);
    if (!m)
        return uri;

    var scheme = m[1];
    var host = m[2].split('.');
    return scheme + '://' + host[host.length - 2] + '.' + host[host.length - 1];
}

function default_cookie(spec) {
    spec = normalize_uri(spec);
    var uri = make_uri(spec);
    cookie_permission.setAccess(uri, Ci.nsICookiePermission.ACCESS_DEFAULT);
}

exports.default_cookie = default_cookie;

function allow_cookie(spec) {
    spec = normalize_uri(spec);
    var uri = make_uri(spec);
    cookie_permission.setAccess(uri, Ci.nsICookiePermission.ACCESS_ALLOW);
}

exports.allow_cookie = allow_cookie;

function deny_cookie(spec) {
    spec = normalize_uri(spec);
    var uri = make_uri(spec);
    cookie_permission.setAccess(uri, Ci.nsICookiePermission.ACCESS_DENY);
}

exports.deny_cookie = deny_cookie;

function session_cookie(spec) {
    spec = normalize_uri(spec);
    var uri = make_uri(spec);
    cookie_permission.setAccess(uri, Ci.nsICookiePermission.ACCESS_SESSION);
}

exports.session_cookie = session_cookie;

// From https://developer.mozilla.org/en-US/docs/Cookies_Preferences_in_Mozilla
// 0 = accept all cookies by default
// 1 = only accept from the originating site (block third party cookies)
// 2 = block all cookies by default

function get_cookie_behaviour() {
    var branch = pref_svc.getBranch('network.cookie.');
    var res = branch.getIntPref('cookieBehavior');
    switch (res) {
    case 0:
        return 'cookie-default-allow';
    case 1:
        return 'cookie-default-allow-third-party-deny';
    case 2:
        return 'cookie-default-deny';
    case 3:
        return 'cookie-default-allow-third-party-visited';
    }

    console.error('behaviour=' + res);
    throw 'Never reached';
}

function get_cookie_permission(spec) {
    spec = normalize_uri(spec);
    var uri = make_uri(spec);
    var perm = permission_mgr.testPermission(uri, 'cookie');
    switch(perm) {
    case Ci.nsICookiePermission.ACCESS_DEFAULT:
        return get_cookie_behaviour();
    case Ci.nsICookiePermission.ACCESS_ALLOW:
        return 'cookie-allow';
    case Ci.nsICookiePermission.ACCESS_DENY:
        return 'cookie-deny';
    case Ci.nsICookiePermission.ACCESS_SESSION:
        return 'cookie-session';
    }

    console.error('permission=' + perm);
    throw 'Never reached';
}

exports.get_cookie_permission = get_cookie_permission;

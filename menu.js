var { data } = require('sdk/self');
var { Panel } = require('sdk/panel');
var { ToggleButton } = require('sdk/ui/button/toggle');
var tabs = require('sdk/tabs');
var _ = require("sdk/l10n").get;
var permission = require('cookie_permissions.js');

var cookie_icons = {
    'default-allow': {
        label: _('cookie-default-id'),
        icon: {
            '16': data.url('cookie-default-16.png'),
            '32': data.url('cookie-default-32.png'),
            '64': data.url('cookie-default-64.png')
        }
    },
    'default-deny': {
        label: _('cookie-default-id'),
        icon: {
            '16': data.url('cookie-default-block-16.png'),
            '32': data.url('cookie-default-block-32.png'),
            '64': data.url('cookie-default-block-64.png')
        }
    },
    'allow': {
        label: _('cookie-allow-id'),
        icon: {
            '16': data.url('cookie-allow-16.png'),
            '32': data.url('cookie-allow-32.png'),
            '64': data.url('cookie-allow-64.png')
        }
    },
    'deny': {
        label: _('cookie-deny-id'),
        icon: {
            '16': data.url('cookie-block-16.png'),
            '32': data.url('cookie-block-32.png'),
            '64': data.url('cookie-block-64.png')
        }
    },
    'session': {
        label: _('cookie-session-id'),
        icon: {
            '16': data.url('cookie-session-16.png'),
            '32': data.url('cookie-session-32.png'),
            '64': data.url('cookie-session-64.png')
        }
    }
};

var button = ToggleButton({
    id: 'open-permissions-btn',
    label: 'Set Cookie Permissions',
    icon: {
        '16': data.url('nocookie-16.png'),
        '32': data.url('nocookie-32.png'),
        '64': data.url('nocookie-64.png')
    },
    onChange: handle_change
});

var panel = Panel({
    contentURL: data.url('permission_menu.html'),
    contentScriptFile: data.url('permission_menu_panel.js'),
    onHide: handle_hide
});

panel.on('show', function() {
    var perm = permission.get_cookie_permission(tabs.activeTab.url);
    panel.port.emit('show', perm);
});

panel.port.on('set-default', function() {
    permission.default_cookie(tabs.activeTab.url);
    var perm = permission.get_cookie_permission(tabs.activeTab.url);
    update_state(tabs.activeTab, perm);
    panel.hide();
});

panel.port.on('set-allow', function() {
    permission.allow_cookie(tabs.activeTab.url);
    button.state(tabs.activeTab, cookie_icons['allow']);
    panel.hide();
});

panel.port.on('set-deny', function() {
    permission.deny_cookie(tabs.activeTab.url);
    button.state(tabs.activeTab, cookie_icons['deny']);
    panel.hide();
});

panel.port.on('set-session', function() {
    permission.session_cookie(tabs.activeTab.url);
    button.state(tabs.activeTab, cookie_icons['session']);
    panel.hide();
});

panel.port.on('open-settings-privacy', function() {
    tabs.open({ url: 'about:preferences#privacy' });
    panel.hide();
});

panel.port.once('panel-size', function(data) {
    panel.resize(data.width, data.height);
});

exports.panel = panel;

function handle_change(state) {
    if (state.checked) {
        panel.show({ position: button });
    }
}

function handle_hide() {
    button.state('window', { checked: false });
}

function update_state(tab, state) {
    switch(state) {
    case 'cookie-default-allow':
    case 'cookie-default-allow-third-party-deny':
    case 'cookie-default-allow-third-party-visited':
        button.state(tab, cookie_icons['default-allow']);
        break;
    case 'cookie-default-deny':
        button.state(tab, cookie_icons['default-deny']);
        break;
    case 'cookie-allow':
        button.state(tab, cookie_icons['allow']);
        break;
    case 'cookie-deny':
        button.state(tab, cookie_icons['deny']);
        break;
    case 'cookie-session':
        button.state(tab, cookie_icons['session']);
        break;
    }
}

exports.update_state = update_state;

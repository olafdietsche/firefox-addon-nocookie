var menu_default = document.getElementById('cookie-default');
var menu_allow = document.getElementById('cookie-allow');
var menu_deny = document.getElementById('cookie-deny');
var menu_session = document.getElementById('cookie-session');
var menu_privacy_settings = document.getElementById('open-settings-privacy');

function get_outer_rect(elt) {
    var style = window.getComputedStyle(elt);
    var marginTop = parseInt(style.marginTop);
    var marginBottom = parseInt(style.marginBottom);
    var marginLeft = parseInt(style.marginLeft);
    var marginRight = parseInt(style.marginRight);
    return { width: elt.offsetWidth + marginLeft + marginRight,
             height: elt.offsetHeight + marginTop + marginBottom };
}

function set_panel_size() {
    var menu = document.getElementById('menu');
    var rect = get_outer_rect(menu);
    self.port.emit('panel-size', { width: rect.width, height: rect.height });
}

var panel_size_done = false;

self.port.on('show', function(permission) {
    switch(permission) {
    case 'cookie-default':
    case 'cookie-default-allow':
    case 'cookie-default-deny':
        // TODO: set label (Default (Allow), Default (Block))
        menu_default.checked = true;
        break;
    case 'cookie-allow':
        menu_allow.checked = true;
        break;
    case 'cookie-deny':
        menu_deny.checked = true;
        break;
    case 'cookie-session':
        menu_session.checked = true;
        break;
    }

    if (!panel_size_done) {
        set_panel_size();
        panel_size_done = true;
    }
});

menu_default.addEventListener('click', function() {
    self.port.emit('set-default');
});

menu_allow.addEventListener('click', function() {
    self.port.emit('set-allow');
});

menu_deny.addEventListener('click', function() {
    self.port.emit('set-deny');
});

menu_session.addEventListener('click', function() {
    self.port.emit('set-session');
});

menu_privacy_settings.addEventListener('click', function() {
    self.port.emit('open-settings-privacy');
});

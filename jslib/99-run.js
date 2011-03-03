Ext.onReady(function() {
    Ext.QuickTips.init();
    Ext.History.init();

    Pad.UI = new Pad.Viewport;
    Ext.History.on('change', function(token) {
        if (token) {
            console.log(token);
        } else {
            console.log("init", token);
        }
    });
    var hash = Ext.History.getToken();
    var pages = hash.split(/#/);
    for (var i = 0; i < pages.length; i++) {
        var parts = pages[i].split(/\//);
        parts.shift();
        console.log(parts);
        if (parts[0] == 'mirrors') {
            Pad.UI.TabPanel.add(new Pad.Mirrors);
        } else if (parts[0] == 'recent') {
            Pad.UI.TabPanel.add(new Pad.Recent);
        }
    }
});
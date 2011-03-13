Ext.onReady(function() {
    Ext.QuickTips.init();
    Ext.History.init();

    Pad.UI = new Pad.Viewport;
    Ext.History.on('change', function(token) {
        if (token) {
            Util.loadPage(token);
        }
    });
    var hash = Ext.History.getToken() || '/home';
    Util.loadPage(hash);
});
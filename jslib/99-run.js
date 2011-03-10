Ext.onReady(function() {
    Ext.QuickTips.init();
    Ext.History.init();

    Pad.UI = new Pad.Viewport;
    Ext.History.on('change', function(token) {
        if (token) {
            Util.loadPage(token);
        } else {
            console.log("init", token);
        }
    });
    var hash = Ext.History.getToken();
    if(!hash) return;
    hash = hash.replace(/%23/g, "#");
    var pages = hash.split(/#/);
    for (var i = 0; i < pages.length; i++) {
        Util.loadPage(pages[i]);
    }
});
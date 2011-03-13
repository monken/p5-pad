Ext.ns('Pad.TabPanel');

Pad.TabPanel = Ext.extend(Ext.TabPanel, {
    style:'padding:10px 0px 10px 0px',
    id: 'pad-reader',
    enableTabScroll: true,
    //bbar:[{}],
    //activeItem: 0, 
    plain: true,
    add: function(c) {
        var found;
        if(this.items) this.items.each(function(item) {
            if(item.xtype != c.xtype) return;
            for(var i = 0; i < item.identifier.length; i++) {
                if(item[item.identifier[i]] != c[c.identifier[i]]) {
                    return;
                }
            }
            found = item;
            return false;
        });
        if(found) return this.activate(found);
        var comp = Pad.TabPanel.superclass.add.call(this, c);
        if(!Ext.isArray(comp)) comp.on('close', function(tab) {
            Pad.UI.FilesPanel.remove(tab);
            Pad.UI.RelatedPanel.remove(tab);
        });
        if(this.rendered) this.activate(c);
    },
    initEvents: function() {
        Pad.TabPanel.superclass.initEvents.call(this, arguments);
        this.on('tabchange', this.onTabChange);
        this.on('close', this.onClose);
    },
    onTabChange: function(panel, c) {
        c.setToken();
    },
    proxyLink: function(link) {
        return false;
    }
});

new Ext.KeyMap(document, {
    key: "w",
    ctrl: false,
    alt: false,
    shift: false,
    fn: function(a, e) {
        if(e.target.tagName == 'INPUT') return;
        if(Pad.UI.TabPanel.items.items.length == 1) return;
        var tab = Pad.UI.TabPanel.getActiveTab();
        if(tab.xtype == 'padhome') return;
        tab.fireEvent('close', tab);
        Pad.UI.TabPanel.remove(tab, true);
    },
});

new Ext.KeyMap(document, {
    key: Ext.EventObject.ESC,
    ctrl: false,
    shift: false,
    alt: false,
    fn: function(a, e) {
        document.activeElement.blur()
    },
});
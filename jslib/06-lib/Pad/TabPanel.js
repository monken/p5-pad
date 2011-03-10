Ext.ns('Pad.TabPanel');

Pad.TabPanel = Ext.extend(Ext.TabPanel, {
    style:'padding:10px 0px 10px 0px',
    id: 'pad-reader',
    enableTabScroll: true,
    //bbar:[{}],
    activeItem: 0, 
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
        this.loadPortlets(Ext.isArray(c) ? c[0] : c, Ext.isArray(c) ? false : true);
    },
    loadPortlets: function(c, count) {
        if(c.loaded) {
            Pad.UI.FilesPanel.add({author: c.author, release: c.release, xtype: 'padfiles' }, count);
            Pad.UI.RelatedPanel.add({author: c.author, release: c.release, xtype: 'padrelated' }, count);
        } else {
            c.on('load', this.loadPortlets.createDelegate(this, [c, count]));
        }
    },
    initEvents: function() {
        Pad.TabPanel.superclass.initEvents.call(this, arguments);
        this.on('tabchange', this.onTabChange);
        this.on('close', this.onClose);
    },
    onTabChange: function(panel, c) {
        if(c) this.loadPortlets(c);
        c.setToken();
    },
    proxyLink: function(link) {
        return false;
    }
});

new Ext.KeyMap(document, {
    key: "w",
    ctrl: true,
    alt: true,
    fn: function() {
        var tab = Ext.getCmp('pad-reader').getActiveTab();
        Ext.getCmp('pad-reader').remove(tab, true);
    },
});
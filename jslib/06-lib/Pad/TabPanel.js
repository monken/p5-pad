Ext.ns('Pad.TabPanel');

Pad.TabPanel = Ext.extend(Ext.TabPanel, {
    style:'padding:10px 0px 10px 0px',
    id: 'pad-reader',
    enableTabScroll: true,
    bbar:[{}],
    activeItem: 0, 
    plain: true,
    add: function(c) {
        var found;
        if(this.items) this.items.each(function(item) {
            if(item.xtype != c.xtype) return;
            if(item.file == c.file) {
                found = item;
                return false;
            }
        });
        if(found) return this.activate(found);
        
        var comp = Pad.TabPanel.superclass.add.call(this, c);
        if(!Ext.isArray(comp)) comp.on('close', function(tab) {
            Pad.UI.FilesPanel.remove(tab);
            Pad.UI.RelatedPanel.remove(tab);
        });
        if(this.rendered) this.activate(c);
        
        
        this.loadPortlets(c);
    },
    loadPortlets: function(c) {
        if(c.title) {
            Pad.UI.FilesPanel.add(new Pad.Files({module: c.title, release: c.release}));
            Pad.UI.RelatedPanel.add(new Pad.RelatedModules({module: c.title, file: c.file}));
        }
    },
    initEvents: function() {
        Pad.TabPanel.superclass.initEvents.call(this, arguments);
        this.on('tabchange', this.onTabChange);
        this.on('close', this.onClose);
    },
    onTabChange: function(panel, c) {
        if(c) this.loadPortlets(c);
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
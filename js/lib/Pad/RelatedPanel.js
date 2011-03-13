Ext.ns('Pad.RelatedPanel');

Pad.RelatedPanel = Ext.extend(Pad.CardPortlet, {
    iconCls: 'silk-package-link',
    title: 'Related Modules',
    identifier: 'release'
});

Pad.RelatedPanel.Accordion = Ext.extend(Ext.Panel, {
    layout: 'accordion',
    xtype: 'related',
    references: 0,
    loaded: false,
    initComponent: function() {
        this.items = [{
            xtype: 'padportletdataview',
            title: 'Documentation',
            release: this.release,
            author: this.author,
            api: Release.documentation,
            listeners: {
                load: this.onLoad.createDelegate(this)
            }
        },
        {
            xtype: 'padportletdataview',
            title: 'Dependencies',
            release: this.release,
            author: this.author,
            api: Release.dependencies,
            listeners: {
                load: this.onLoad.createDelegate(this)
            }

        }];
        this.addEvents('load');
        Pad.RelatedPanel.Accordion.superclass.initComponent.call(this, arguments);
    },
    onLoad: function() {
        var loaded = true;
        this.items.each(function(c) {
            if(!c.loaded) loaded = false;
        });
        if(loaded) this.fireEvent('load');
    }

});

Ext.reg('padrelated', Pad.RelatedPanel.Accordion);
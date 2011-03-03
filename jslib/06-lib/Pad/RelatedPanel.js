Ext.ns('Pad.RelatedPanel');

Pad.RelatedPanel = Ext.extend(Pad.CardPortlet, {
    iconCls: 'silk-package-link',
    title: 'Related Modules',
    identifier: 'release'
});

Pad.RelatedPanel.Accordion = Ext.extend(Ext.Panel, {
    layout: 'accordion',
    xtype: 'related',
    initComponent: function() {
        this.items = [{
            xtype: 'padportletdataview',
            title: 'Documentation',
            release: this.release,
            author: this.author,
            api: Release.documentation,
            
        },
        {
            xtype: 'padportletdataview',
            title: 'Dependencies',
            release: this.release,
            author: this.author,
            api: Release.dependencies

        }];
        Pad.RelatedPanel.Accordion.superclass.initComponent.call(this, arguments);
    }

});

Ext.reg('padrelated', Pad.RelatedPanel.Accordion);
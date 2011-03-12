Pad.Recent = Ext.extend(Pad.Panel, {
    title: 'Recent',
    layout: 'border',
    iconCls:'silk-new',
    grid: {
        region: 'center',
        border: false,
        xtype: 'padgridpanelrelease',
        title: null,
        api: { read: Release.recent },
        sortInfo: { field: 'date', direction: 'DESC' },
        groupField: 'day',
    },
    initComponent: function() {
        this.grid = Ext.ComponentMgr.create(this.grid);
        this.items = [this.grid],
        Pad.Recent.superclass.initComponent.call(this, arguments);
    },
    initEvents: function() {
        this.grid.getStore().on('load', this.onLoad, this);
        this.grid.getStore().on('beforeload', this.onBeforeLoad, this);
    },
});

new Ext.KeyMap(document, {
    key: "r",
    ctrl: false,
    shift: false,
    alt: false,
    fn: function(a, e) {
        if(e.target.tagName == 'INPUT') return;
        Pad.UI.TabPanel.add(new Pad.Recent);
        e.preventDefault();
    },
});
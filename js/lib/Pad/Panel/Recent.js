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
        var grid = Ext.ComponentMgr.create(this.grid);
        this.items = [grid],
        Pad.Recent.superclass.initComponent.call(this, arguments);
    }
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
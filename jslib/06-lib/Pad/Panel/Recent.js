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
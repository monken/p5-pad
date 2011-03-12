Pad.GridPanel.Release = Ext.extend(Pad.GridPanel, {
    title: 'Releases',
    iconCls: 'silk-page',
    api: { read: Release.search },
    autoExpandColumn: 'abstract',
    cm: [
    {
        header: "Release",
        width: 220,
        sortable: false,
        dataIndex: 'name',
        renderer: Ext.util.Format.htmlEncode
    },
    {
        header: "Abstract",
        sortable: false,
        dataIndex: 'abstract',
        id: 'abstract',
        renderer: Ext.util.Format.htmlEncode
    },
    {
        header: "Distribution",
        hidden: true,
        sortable: false,
        dataIndex: 'distribution',
        renderer: Ext.util.Format.htmlEncode
    },
    {
        header: "",
        width: 70,
        sortable: false,
        dataIndex: 'none',
        align: 'center',
        renderer: function(value, s,r) { return '<a href="' + r.data.download_url + '">Download</a>' }
    },
    {
        header: "Date",
        hidden: true,
        sortable: false,
        dataIndex: 'day',
        renderer: Ext.util.Format.dateRenderer("l, jS F Y")
    },
    {
        header: "Released",
        width: 120,
        sortable: false,
        dataIndex: 'date',
        align: 'right',
        renderer: Util.dateTimeRenderer
    },
    ],
    fields: ['day', 'name', 'abstract', 'date', 'distribution', 'download_url'],
    initEvents: function() {
        this.on('rowdblclick', this.onRowDblClick, this);
        Pad.GridPanel.Release.superclass.initEvents.call(this, arguments);
    },
    onRowDblClick: function(grid, index, e) {
        var row = this.getStore().getAt(index);
        var module = row.get('distribution').replace(/-/g, '::');
        Pad.UI.TabPanel.add(new Pad.Reader.Pod({ title: module }));
    },
});

Ext.reg('padgridpanelrelease', Pad.GridPanel.Release);
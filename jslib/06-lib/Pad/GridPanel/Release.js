Pad.GridPanel.Release = Ext.extend(Pad.GridPanel, {
    title: 'Releases',
    iconCls: 'silk-page',
    api: { read: Release.search },
    autoExpandColumn: 'abstract',
    cm: [
    {
        header: "Release",
        width: 220,
        sortable: true,
        dataIndex: 'name'
    },
    {
        header: "Abstract",
        sortable: true,
        dataIndex: 'abstract',
        id: 'abstract'
    },
    {
        header: "Distribution",
        hidden: true,
        dataIndex: 'distribution',
    },
    {
        header: "",
        width: 70,
        sortable: true,
        dataIndex: 'none',
        align: 'center',
        renderer: function(value, s,r) { return '<a href="' + r.data.download_url + '">Download</a>' }
    },
    {
        header: "Date",
        hidden: true,
        dataIndex: 'day',
        renderer: Ext.util.Format.dateRenderer("l, jS F Y")
    },
    {
        header: "Released",
        width: 120,
        sortable: true,
        dataIndex: 'date',
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
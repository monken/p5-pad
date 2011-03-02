Pad.GridPanel.Release = Ext.extend(Pad.GridPanel, {
    title: 'Releases',
    iconCls: 'silk-page',
    api: { read: Release.search },
    autoExpandColumn: 'abstract',
    cm: [
    {
        header: "Release",
        width: 180,
        sortable: true,
        dataIndex: 'name'
    },
    {
        header: "Abstract",
        width: 150,
        sortable: true,
        dataIndex: 'abstract',
        id: 'abstract'
    },
    {
        header: "Distribution",
        hidden: true,
        id: 'distribution'
    },
    {
        header: "",
        width: 70,
        sortable: true,
        dataIndex: 'none',
    },
    {
        header: "Released",
        width: 120,
        sortable: true,
        dataIndex: 'date',
        renderer: Util.dateRenderer
    },
    ],
    fields: ['name', 'abstract', 'date', 'distribution'],
    groupField: 'distribution'
});

Ext.reg('padgridpanelrelease', Pad.GridPanel.Release);
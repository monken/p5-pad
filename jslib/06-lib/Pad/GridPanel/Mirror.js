Pad.GridPanel.Mirror = Ext.extend(Pad.GridPanel, {
    title: 'Mirrors',
    iconCls: 'silk-page',
    api: {
        read: Mirror.byLocation
    },
    autoExpandColumn: 'org',
    cm: [{
        header: "Name",
        width: 100,
        sortable: true,
        dataIndex: 'name'
    },
    {
        header: "Organization",
        id: 'org',
        sortable: true,
        dataIndex: 'org'
    },
    {
        header: "City",
        width: 100,
        sortable: true,
        dataIndex: 'city'
    },
    {
        header: "Region",
        width: 100,
        sortable: true,
        dataIndex: 'region',
        hidden: true
    },
    {
        header: "Country",
        width: 100,
        sortable: true,
        dataIndex: 'country'
    },
    {
        header: "Continent",
        width: 100,
        sortable: true,
        dataIndex: 'continent'
    },
    {
        header: "Protocols",
        width: 90,
        sortable: true,
        dataIndex: 'none',
        renderer: Util.protocolRenderer
    },
    {
        header: "Distance",
        width: 70,
        sortable: true,
        dataIndex: 'distance',
        align: 'right',
        renderer: Util.distanceRenderer,
    },
    {
        dataIndex: 'http',
        hidden: true
    },
    {
        dataIndex: 'rsync',
        hidden: true
    },
    {
        dataIndex: 'ftp',
        hidden: true
    },
    {
        dataIndex: 'location',
        hidden: true
    },
    {
        header: "Inception",
        width: 90,
        sortable: true,
        dataIndex: 'inceptdate',
        align: 'right',
        renderer: Util.dateRenderer
    },
    ],
    initComponent: function() {
        this.tbar = ['->', 'Toggle protocols:', {
            text: 'http',
            enableToggle: true,
            handler: this.toggleProtocol,
            scope: this,
            pressed: true
        },
        ' ', {
            text: 'ftp',
            enableToggle: true,
            handler: this.toggleProtocol,
            scope: this,
            pressed: true
        },
        ' ', {
            text: 'rsync',
            enableToggle: true,
            handler: this.toggleProtocol,
            scope: this,
            pressed: true
        }];
        Pad.GridPanel.Mirror.superclass.initComponent.call(this, arguments);
        this.store.on('beforeload', this.loadProtocols, this);
    },
    loadProtocols: function(store) {
        this.getTopToolbar().items.each(function(button) {
            store.setBaseParam(button.text, button.pressed);
        });
        store.setBaseParam("limit", 20000);
    },
    toggleProtocol: function() {
        this.store.reload();
    },
    onRender: function(c) {
        Pad.GridPanel.Mirror.superclass.onRender.call(this, c);
        Util.getLocation(this.getStore().load.createDelegate(this.getStore()));
        this.getBottomToolbar().hide();
    },
});

Ext.reg('padgridpanelmirror', Pad.GridPanel.Mirror);
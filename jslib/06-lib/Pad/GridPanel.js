Pad.GridPanel = Ext.extend(Ext.grid.GridPanel, {
    api: null,
    stripeRows: true,
    store: {
        autoLoad: false,
        remoteSort: true,
        baseParams: {
            limit: 50
        },
        root: 'data',
        groupOnSort: true,
        groupField: 'distribution',
    },
    initComponent: function() {
        Ext.apply(this.store, {
            listeners: {
                exception: this.onException.createDelegate(this)
            },
            reader: new Ext.data.JsonReader({fields: this.fields}),
            proxy: new Pad.DataProxy({
                api: this.api
            })
        });
        this.store = new Ext.data.GroupingStore(this.store);
        if (this.cm[0].id != 'numberer') this.cm.unshift(new Ext.grid.RowNumberer());
        Ext.apply(this, {
            region: 'center',
            cm: new Ext.grid.ColumnModel(this.cm),
            store: this.store,
            bbar: new Ext.PagingToolbar({
                pageSize: 50,
                store: this.store,
                displayInfo: true,
            })
        });
        Pad.GridPanel.superclass.initComponent.call(this, arguments);
        this.initEvents();
    },
    onRender: function(c) {
        Pad.GridPanel.superclass.onRender.call(this, c);
        this.getStore().load();
    },
    initEvents: function() {
        this.on('rowdblclick', this.onRowDblClick, this);

    },
    onRowDblClick: function(grid, index, e) {
        var row = this.getStore().getAt(index);
        var form = new this.form;
        form.on('submit', this.store.reload.createDelegate(this.store));
        form.load(row.get('id'));
    },
    onException: function(proxy, type, action, options, response, arg) {
        Ext.Msg.show({
            title: 'Fehler',
            msg: 'Die Suche konnte nicht ausgeführt werden.',
            buttons: Ext.Msg.OK,
            icon: Ext.Msg.ERROR
        });
        this.onLoad();
    }
});
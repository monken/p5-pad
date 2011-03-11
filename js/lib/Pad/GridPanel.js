Pad.GridPanel = Ext.extend(Ext.grid.GridPanel, {
    api: null,
    stripeRows: true,
    viewConfig: {},
    rowNumberer: true,
    store: {
        autoLoad: false,
        remoteSort: true,
        baseParams: {
            limit: 50
        },
        root: 'data',
        //groupOnSort: true,
        groupField: 'distribution',
    },
    buildFields: function() {
        var fields = [];
        for(var i = 0; i < this.cm.length; i++) {
            fields.push(this.cm[i].dataIndex);
        }
        return fields;
    },
    initComponent: function() {
        if(!this.fields) this.fields = this.buildFields();
        Ext.apply(this.store, {
            listeners: {
                exception: this.onException.createDelegate(this)
            },
            reader: new Ext.data.JsonReader({fields: this.fields}),
            proxy: new Pad.DataProxy({
                api: this.api
            }),
            groupField: this.groupField,
            sortInfo: this.sortInfo,
            baseParams: { fields: this.fields }
        });
        this.store = new Ext.data.GroupingStore(this.store);
        this.view = new Ext.grid.GroupingView(this.viewConfig);
        if (this.rowNumberer && this.cm[0].id != 'numberer') this.cm.unshift(new Ext.grid.RowNumberer({ width: 28 }));
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
        this.store.on('load', this.onLoad, this);

    },
    onLoad: function(store) {
        
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
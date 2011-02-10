Ext.ns('Pad.RelatedModules');

Pad.RelatedModules = Ext.extend(Ext.Panel, {
    view: {
        tpl: '<tpl for="."><div class="pad-related-item">{name}</div></tpl>',
        singleSelect: true,
        overClass: 'pad-related-item-selected',
        itemSelector: '.pad-related-item',
        emptyText: '',
        deferEmptyText: false,
        autoScroll: true,
    },
    store: {
        root: 'data',
        fields: ['name']
    },
    initComponent: function() {
        Pad.RelatedModules.superclass.initComponent.call(this, arguments);
        this.addEvents('load');
    },
    afterRender: function() {
        Pad.RelatedModules.superclass.afterRender.call(this, arguments);
        this.view.applyTo = this.body;
        this.view = new Ext.DataView(this.view);
        this.store = new Ext.data.DirectStore(this.store);
        this.relayEvents(this.store.proxy, ['beforeload', 'exception']);
        this.store.proxy.on('load', this.onLoad, this);
        this.store.proxy.on('exception', this.onException, this);
        
        this.view.bindStore(this.store);
        this.view.on('click', this.onClick);
        if(!this.module) return;
        var read = this.file ? File.related : Module.related;
        this.store.proxy.setApi(Ext.data.Api.actions.read, read);
        this.store.load({ params: this.file ? this.file : this.module });
    },
    onLoad: function(prov, res) {
        this.file = res.result.file || this.destroy();
        this.fireEvent('load');
    },
    onException: function(prov, res) {
        this.destroy();
    },
    onClick: function(view, index, dom, e) {
        var module = view.getSelectedRecords()[0].data;
        if (e.shiftKey) {
            pod = new Pad.Reader.Source.Code({
                title: module.name,
            });
        } else {
            pod = new Pad.Reader.Pod({
                title: module.name,
            });
        }
        Pad.UI.TabPanel.add(pod);
    }
});
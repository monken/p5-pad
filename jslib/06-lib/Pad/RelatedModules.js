Ext.ns('Pad.RelatedModules');

Pad.RelatedModules = Ext.extend(Ext.Panel, {
    references: 1,
    xtype: 'padrelated',
    view: {
        tpl: '<tpl for="."><div class="pad-related-item">{module} {version}</div></tpl>',
        singleSelect: true,
        overClass: 'pad-related-item-selected',
        itemSelector: '.pad-related-item',
        emptyText: '',
        deferEmptyText: false,
        autoScroll: true,
    },
    store: {
        root: 'data',
        fields: ['module', 'version'],
    },
    initComponent: function() {
        Pad.RelatedModules.superclass.initComponent.call(this, arguments);
        this.store.proxy = new Pad.DataProxy({ api: { read: Release.dependencies } });
        this.store = new Ext.data.JsonStore(this.store);
        this.view = new Ext.DataView(this.view);
        this.view.on('click', this.onClick);
        
        this.relayEvents(this.store.proxy, ['load', 'beforeload', 'exception']);
    },
    afterRender: function() {
        Pad.RelatedModules.superclass.afterRender.call(this, arguments);
        this.view.render(this.body);
        this.view.bindStore(this.store);
        
        this.store.load({ params: { author: this.author, release: this.release } });
    },
    onException: function(res) {
        this.destroy();
    },
    onClick: function(view, index, dom, e) {
        var module = view.getSelectedRecords()[0].data;
        if (e.shiftKey) {
            pod = new Pad.Reader.Source.Code({
                title: module.module,
            });
        } else {
            pod = new Pad.Reader.Pod({
                title: module.module,
            });
        }
        Pad.UI.TabPanel.add(pod);
    }
});
Ext.reg('padrelated', Pad.RelatedModules);
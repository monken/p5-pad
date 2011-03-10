Pad.Portlet.DataView = Ext.extend(Ext.Panel, {
    references: 0,
    autoScroll: true,
    view: {
        singleSelect: true,
        overClass: 'pad-related-item-selected',
        itemSelector: '.pad-related-item',
        emptyText: '',
        deferEmptyText: false,
        autoScroll: true,
        tpl: '<tpl for="."><div class="pad-related-item"><tpl if="module">{module}</tpl><tpl if="!module">{path}</tpl> <tpl if="version &gt; 0">{version}</tpl></div></tpl>',
    },
    store: {
        root: 'data',
        fields: ['module', 'version', 'name', 'path', 'id', 'release', 'author'],
    },
    initComponent: function() {
        Pad.Portlet.DataView.superclass.initComponent.call(this, arguments);
        this.store = new Ext.data.JsonStore(Ext.applyIf({
            fields: this.fields,
            proxy: new Pad.DataProxy({
                api: {
                    read: this.api
                }
            })
        },
        this.store));
        this.view = new Ext.DataView(Ext.applyIf({
            tpl: this.tpl
        },
        this.view));
        this.view.on('click', this.onClick);
        this.relayEvents(this.store.proxy, ['load', 'beforeload', 'exception']);
    },
    afterRender: function() {
        Pad.Portlet.DataView.superclass.afterRender.call(this, arguments);
        this.view.render(this.body);
        this.view.bindStore(this.store);
        this.store.load({
            params: {
                author: this.author,
                release: this.release
            }
        });
    },
    onException: function(res) {
        this.destroy();
    },
    onClick: function(view, index, dom, e) {
        var module = view.getSelectedRecords()[0].data;
        if (e.shiftKey) {
            pod = new Pad.Reader.Source.Code({
                title: module.module || module.name,
                file_id: module.id,
                release: module.release,
                author: module.author,
                path: module.path,
            });
        } else {
            pod = new Pad.Reader.Pod({
                title: module.module || module.name,
                file_id: module.id,
                release: module.release,
                author: module.author,
                path: module.path,
            });
        }
        Pad.UI.TabPanel.add(pod);
    }
});

Ext.reg('padportletdataview', Pad.Portlet.DataView);
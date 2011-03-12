Pad.Search = Ext.extend(Pad.Panel, {
    iconCls: 'silk-zoom',
    layout: 'border',
    identifier: ['query'],
    title: 'New Search',
    query: '',
    xtype: 'padsearch',
    controller: 'search',
    search: {
        region: 'north',
        layout: 'form',
        xtype: 'panel',
        height: 200,
        border: false,
        items: [{
            xtype: 'textfield',
            enableKeyEvents: true,
            fieldLabel: 'Search',
            name: 'search'
        }, {
            xtype: 'checkboxgroup',
            items: [{
                boxLabel: 'POD',
                checked: true,
            },
            {
                boxLabel: 'Abstract',
                checked: true,
            },
            {
                boxLabel: 'Indexed only',
                checked: true,
            }]
        }]
    },
    grid: {
        region: 'center',
        autoLoad: false,
        border: false,
        xtype: 'padgridpanelsearch',
        api: {
            read: Release.search
        },
    },
    initComponent: function() {
        this.grid = Ext.ComponentMgr.create(this.grid);
        this.search = Ext.ComponentMgr.create(this.search);
        this.field = this.search.find('name', 'search')[0];
        this.items = [this.search, this.grid],
        this.grid.store.setBaseParam('author', this.title);
        Pad.Search.superclass.initComponent.call(this, arguments);
        if(this.query) {
            this.field.setValue(this.query);
            this.updateTitle();
            this.grid.getStore().setBaseParam('query', this.query);
            this.grid.store.load();
        }
    },
    afterRender: function() {
        Pad.Search.superclass.afterRender.apply(this, arguments);
        this.field.focus(true, 100);
    },
    updateTitle: function(field, e) {
        this.query = this.field.getValue();
        if(this.query) {
            this.setTitle('"' + Ext.util.Format.htmlEncode(this.query) + '"');
        } else {
            this.setTitle("New Search");
        }
    },
    initEvents: function() {
        this.grid.getStore().on('load', this.onLoad, this);
        this.grid.getStore().on('beforeload', this.onBeforeLoad, this);
        this.field.on('keyup', this.updateTitle, this);
        this.field.on('specialkey', this.doSearch, this);
        
    },
    doSearch: function(field, e) {
        this.updateTitle(field, e);
        if (e.getCharCode() != 13) return;
        this.setToken();
        this.grid.getStore().setBaseParam('query', this.query);
        this.grid.getStore().load();
    },
    setToken: function() {
        Ext.History.add(["", this.controller, this.query].join("/"));
    }
});

new Ext.KeyMap(document, {
    key: "s",
    ctrl: false,
    shift: false,
    alt: false,
    fn: function(a, e) {
        if (e.target.tagName == 'INPUT') return;
        Pad.UI.TabPanel.add(new Pad.Search);
        e.preventDefault();
    },
});
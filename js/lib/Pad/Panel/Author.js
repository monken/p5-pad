Pad.Author = Ext.extend(Pad.Panel, {
    iconCls: 'silk-user',
    layout: 'border',
    identifier: ['title'],
    xtype: 'padauthor',
    controller: 'author',
    overview: {
        region: 'north',
        xtype: 'panel',
        height: 200,
        html: "Deine Mudder",
        border: false,
        tbar: [{ text: 'Foo' }]
    },
    grid: {
        region: 'center',
        border: false,
        xtype: 'padgridpanelrelease',
        api: { read: Release.byAuthor },
        groupField: 'distribution',
    },
    initComponent: function() {
        var grid = Ext.ComponentMgr.create(this.grid);
        this.items = [Ext.ComponentMgr.create(this.overview), grid],
        grid.store.setBaseParam('author', this.title);
        Pad.Author.superclass.initComponent.call(this, arguments);
    },
    setToken: function() {
        Ext.History.add(["", this.controller, this.title].join("/"));
    }
});
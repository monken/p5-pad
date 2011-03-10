Pad.Panel = Ext.extend(Ext.Panel, {
    closable: true,
    identifier: ['title'],
    xtype: 'padpanel',
    setToken: function() {
        Ext.History.add(["", this.title.toLowerCase()].join("/"));
    }
});
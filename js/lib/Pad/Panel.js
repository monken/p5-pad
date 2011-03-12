Pad.Panel = Ext.extend(Ext.Panel, {
    closable: true,
    identifier: ['title'],
    xtype: 'padpanel',
    loaded: false,
    setToken: function() {
        Ext.History.add(["", this.title.toLowerCase()].join("/"));
    },
    initComponent: function() {
        Pad.Panel.superclass.initComponent.apply(this, arguments);
        this.initEvents();
    },
    initEvents: function() {},
    onBeforeLoad: function() {
        this.loaded = false;
        this.oldIconCls = this.iconCls;
        this.setIconClass('silk-loading');
    },
    onLoad: function(ev) {
        this.setIconClass(this.oldIconCls);
        this.loaded = true;
    },
});
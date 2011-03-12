Pad.Home = Ext.extend(Pad.Panel, {
    iconCls: 'silk-house',
    identifier: ['title'],
    xtype: 'padhome',
    controller: 'home',
    title: 'Home',
    autoLoad: 'home.htm',
    closable: false,
    afterRender: function() {
        Pad.Home.superclass.afterRender.apply(this, arguments);
        this.body.getUpdater().on("update", this.onLoad, this);
        this.body.getUpdater().on("beforeupdate", this.onBeforeLoad, this);
    }
});

new Ext.KeyMap(document, {
    key: "h",
    ctrl: false,
    shift: false,
    alt: false,
    fn: function(a, e) {
        if(e.target.tagName == 'INPUT') return;
        Pad.UI.TabPanel.add(new Pad.Home);
        e.preventDefault();
    },
});
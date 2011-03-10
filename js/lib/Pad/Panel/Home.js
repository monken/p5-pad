Pad.Home = Ext.extend(Pad.Panel, {
    iconCls: 'silk-house',
    identifier: ['title'],
    xtype: 'padhome',
    controller: 'home',
    title: 'Home',
    autoLoad: 'home.htm',
    closable: false,
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
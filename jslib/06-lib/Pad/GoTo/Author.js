Pad.GoTo.Author = Ext.extend(Pad.GoTo, {
    title: 'Go to author',
    api: Author.search,
    tpl: '<tpl for="."><div class="x-combo-list-item">{pauseid} <div style="float:right">({name})</div></div></tpl>',
    onSelect: function(combo, r) {
        Pad.UI.TabPanel.add(new Pad.Author({ title: r.get('pauseid') }));
        this.close();
    }
});

new Ext.KeyMap(document, {
    key: "a",
    crtl: true,
    alt: true,
    fn: function(a, e) {
        (new Pad.GoTo.Author()).show();
        e.preventDefault();
    },
});
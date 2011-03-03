Pad.GoTo.Module = Ext.extend(Pad.GoTo, {
    title: 'Go to module',
    api: Module.search,
    
    onSelect: function(combo, r) {
        var pod;
        if (combo.shift) {
            pod = new Pad.Reader.Source.Code({
                title: r.data.name,
                release: r.data.release,
                path: r.data.path,
            });
        } else {
            pod = new Pad.Reader.Pod({
                title: r.data.name,
                release: r.data.release,
                path: r.data.path,
            });
        }
        Pad.UI.TabPanel.add(pod);
        this.close();
    }
});

new Ext.KeyMap(document, {
    key: "m",
    crtl: true,
    alt: true,
    fn: function(a, e) {
        (new Pad.GoTo.Module()).show();
        e.preventDefault();
    }
});
Ext.ns('Pad.Reader.Source');

Pad.Reader.Source = Ext.extend(Pad.Reader, {
    title: 'Pad.Reader',
    xtype: 'padreadersource',
    autoScroll: true,
    iconCls: 'silk-page-white-code',
    closable: true,
    tbar: [],
    onRender: function(tab) {
        Pad.Reader.Source.superclass.onRender.call(this, tab);
        this.load();
    },
    load: function() {
        File.source(this.file, this.onLoad.createDelegate(this));
    },
    onLoad: function(prov, res) {
        Pad.Reader.Source.superclass.onLoad.call(this, prov, res);
        this.body.insertHtml('afterBegin', res.result.html);
        this.podLines = res.result.pod_lines;
        this.release = res.result.release;
        var tb = this.getTopToolbar();
        var lines = this.body.child('.highlight').dom.firstChild.children.length;
        tb.addText(Ext.util.Format.number(lines, '0,0') + ' lines');
        if(res.result.sloc)
            tb.addText(' (' + Ext.util.Format.number(res.result.sloc, '0,0') + ' sloc)');
        tb.addSeparator();
        tb.addText(Ext.util.Format.number(res.result.size / 1024, '0,000.0') + ' kb');
        tb.addFill();
        tb.add({
            iconCls: 'silk-printer',
            tooltip: 'Print document'
        });
        tb.doLayout();
    }
});
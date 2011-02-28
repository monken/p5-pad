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
    onLoad: function(res) {
        Pad.Reader.Source.superclass.onLoad.call(this, res);
        this.body.insertHtml('afterBegin', '<pre class="brush: pl; class-name: \'highlight\'; toolbar: false;">' + Ext.util.Format.htmlEncode(res.source) + '</pre>');
        SyntaxHighlighter.highlight();
        this.podLines = res.pod_lines;
        this.release = res.release;
        var tb = this.getTopToolbar();
        var lines = this.body.child('.container').dom.children.length;
        tb.addText(Ext.util.Format.number(lines, '0,0') + ' lines');
        if(res.sloc)
            tb.addText(' (' + Ext.util.Format.number(res.sloc, '0,0') + ' sloc)');
        tb.addSeparator();
        tb.addText(Ext.util.Format.number(res.stat.size / 1024, '0,000.0') + ' kb');
        tb.addFill();
        tb.add({
            iconCls: 'silk-printer',
            tooltip: 'Print document'
        });
        tb.doLayout();
    }
});
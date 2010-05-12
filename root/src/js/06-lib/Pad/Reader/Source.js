Ext.ns('Pad.Reader.Source');

Pad.Reader.Source = Ext.extend(Pad.Reader, {
    title: 'Pad.Reader',
    autoScroll: true,
    iconCls: 'silk-page-white-code',
    closable: true,
    tbar: [
        { text: 'Strip POD', iconCls:'silk-text-dropcaps', pressed: true, enableToggle: true, handler: function() {
            this.ownerCt.ownerCt.togglePod(this.pressed);
        } }
    ],
    onRender: function(tab) {
        Pad.Reader.Pod.superclass.onRender.call(this, tab);
        var that = this;
        Module.code(this.title, function(prov, res) {
            that.body.insertHtml('afterBegin', res.result.html);
            that.podLines = res.result.pod_lines;
            var tb = that.getTopToolbar();
            tb.addSeparator();
            var lines = that.body.child('.highlight').dom.firstChild.children.length;
            tb.addText(Ext.util.Format.number(lines, '0,0') + ' lines (' + 
            Ext.util.Format.number(res.result.sloc, '0,0') + ' sloc)');
            tb.addSeparator();
            tb.addText(Ext.util.Format.number(res.result.size/1024, '0,000.0') + ' kb');
            tb.addFill();
            tb.add({iconCls:'silk-printer',tooltip:'Print document'});
            tb.doLayout();
            that.togglePod(true);
        });
    },
    togglePod: function(toggle) {
        toggle = toggle ? 'none' : '';
        var lines = this.podLines;
        if(!lines) return;
        for(var i = 0; i < lines.length; i++) {
            var start  = lines[i][0],
                length = lines[i][1];
            var sourceC = this.body.child('.highlight').dom.firstChild.children;    
            var linesC = this.body.child('.line-numbers').dom.children;
            var x;
            for(x = start; x < start + length; x++) {
                sourceC[x-1].style.display = toggle;
                linesC[x-1].style.display = toggle;
            }
            
        }
    }
});
Ext.ns('Pad.Reader.Source.Code');

Pad.Reader.Source.Code = Ext.extend(Pad.Reader.Source, {
    title: 'Pad.Reader',
    autoScroll: true,
    iconCls: 'silk-page-white-code',
    xtype: 'padreadersourcecode',
    closable: true,
    tbar: [{
        text: 'Strip POD',
        iconCls: 'silk-text-dropcaps',
        pressed: true,
        enableToggle: true,
        handler: function() {
            this.ownerCt.ownerCt.togglePod(this.pressed);
        }
    }],
    load: function() {
        Module.code(this.title, this.onLoad.createDelegate(this));
    },
    onLoad: function(res) {
        var tb = this.getTopToolbar();
        tb.addSeparator();
        Pad.Reader.Source.Code.superclass.onLoad.call(this, res);
        this.togglePod(true);
    },
    togglePod: function(toggle) {
        toggle = toggle ? 'none' : '';
        var lines = this.podLines;
        if (!lines) return;
        for (var i = 0; i < lines.length; i++) {
            var start = lines[i][0],
            length = lines[i][1];
            var sourceC = this.body.child('.container').dom.children;
            var linesC = this.body.child('.gutter').dom.children;
            var x;
            for (x = start; x < start + length; x++) {
                sourceC[x].style.display = toggle;
                linesC[x].style.display = toggle;
            }
    
        }
    }
});
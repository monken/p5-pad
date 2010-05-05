Ext.ns('Pad.Reader.Pod');

Pad.Reader.Pod = Ext.extend(Pad.Reader, {
    title: 'Pad.Reader',
    autoScroll: true,
    iconCls: 'silk-package',
    padding: '5px 5px 5px 25px',
    closable: true,
    tbar: [
        {iconCls: 'silk-star',enableToggle:true, tooltip: 'Add to favorites'},
        '->',
        {iconCls:'silk-page-white-code', text: 'Source Code', enableToggle: true},
        {iconCls:'silk-bug', text: 'Report Bug'},
        {iconCls:'silk-award-gold', text: 'Rate Distribution'},
        {iconCls:'silk-wrench', text: 'Tools', menu: [{text:'Diff Releases'},{text:'Grep Release'}]},
        {iconCls:'silk-printer',tooltip:'Print document'}
    ],
    initComponent: function() {
        Pad.Reader.Pod.superclass.initComponent.call(this, arguments);
        Ext.apply(this, { toc: new Pad.Reader.TOC.Pod({}) });

    },
    onRender: function(tab) {
        Pad.Reader.Pod.superclass.onRender.call(this, tab);
        var that = this;
        Module.pod(this.title, function(prov, res) {
            that.body.insertHtml('afterBegin', res.result.html);
            this.toc.tree.root.appendChild(res.result.toc);
        });
        console.log(this.toc);
        this.toc.render(this.body);
    },
    afterRender: function(tab,foo) {
        Pad.Reader.Pod.superclass.afterRender.call(this, tab);
        this.tabEl.dd = new Ext.dd.DragSource(this.tabEl, { ddGroup: 'group', 
        dropEl: this,
        onMouseUp: function(e) {
            if(!this.dropEl.isVisible()){
                this.dropEl.show();
            }
        }
        });
    }
});
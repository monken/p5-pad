Ext.ns('Pad.Reader.TOC');

Pad.Reader.TOC.Pod = Ext.extend(Ext.Container, {
    afterRender: function(el) {
        //Pad.Reader.TOC.Pod.superclass.call(this, el);
        //console.log(el, this);
        el.insertHtml('afterBegin', '<div class="x-toolbar pad-toc-container"><div class="pad-toc-tree"></div>T<br>O<br>C<div class="pad-toc-tool"></div></div>');
        var button = new Ext.Button({
            renderTo: el.child('.pad-toc-tool'),
            iconCls: 'silk-control-play',
            enableToggle: true,
            tooltip: 'Remain expanded'
        });
        
        this.tree = new Ext.tree.TreePanel({
             autoScroll:true,
             rootVisible: false,
             height: 150,
             renderTo: el.child('.pad-toc-tree'),
             root:{ id:'root',
             text:'Moose',
             expanded:true,
             children: []
        }});
        var treeWidth = this.tree.getWidth() + 2;
        
        var toc = el.child('.pad-toc-container');
        console.log(toc);
        var x = toc.getX() - treeWidth;
        toc.setX(x);
        
        
        
        var opts = { };
        var mouseenter = function(e, tab) {
            if(opts.anim && opts.anim.isAnimated) return;
            toc.setX(x + treeWidth, opts);
        };
        var mouseleave = function(e, tab, opt){
            if(opts.anim && opts.anim.isAnimated || button.pressed) return;
            toc.setX(x, opts);
        }

        toc.on('mouseenter', mouseenter);
        toc.on('mouseleave', mouseleave);
    }
}
);

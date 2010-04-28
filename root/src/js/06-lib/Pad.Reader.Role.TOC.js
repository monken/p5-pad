Role('Pad.Reader.Role.TOC', {
    after: {
        afterRender: function() {
            return;
            console.log(this);
            this.tbar.insertHTML('afterEnd', '<div class="x-toolbar pad-toc-container" id="pad-toc-container"><div class="pad-toc-tree" id="pad-toc-tree"></div>T<br>O<br>C<div class="pad-toc-tool" id="pad-toc-tool"></div></div>');
            var button = new Ext.Button({
                renderTo: 'pad-toc-tool',
                iconCls: 'silk-control-play',
                enableToggle: true,
                tooltip: 'Remain expanded'
            });
            
            var tree = new Ext.tree.TreePanel({
                 autoScroll:true,
                 rootVisible: false,
                 height: 150,
                 renderTo: 'pad-toc-tree',
                 root:{ id:'root',
                 text:'Moose',
                 expanded:true,
                 children: [
                    {text: 'NAME', leaf:true},
                    {text: 'SYNOPSIS', leaf:true},
                    {text: 'DESCRIPTION', leaf:true}]
            }});
            var treeWidth = tree.getWidth() + 2;
            
            var toc = Ext.get('pad-toc-container');
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
});

Ext.ns('Pad.Reader.TOC');

Pad.Reader.TOC.Pod = Ext.extend(Ext.Container, {
    parseTOC: function(pod) {
        this.tree.root.appendChild(this.buildTree(pod));
    },
    buildTree: function(html) {
        var toc = [];
        for(var i = 0; i < html.children.length; i++) {
            var child = html.children[i];
            var item = { text: child.firstChild.innerHTML, id: child.firstChild.getAttribute('href').replace(/#/, "") };
            if(child.children.length > 1) {
                item.children = this.buildTree(child.children[1]);
            } else {
                item.leaf = true;
            }
            toc.push(item);
        }
        return toc;
    },
    afterRender: function(el) {
        el.insertHtml('afterBegin', '<div class="x-toolbar pad-toc-container"><div class="pad-toc-tree"></div>T<br>O<br>C<div class="pad-toc-tool"></div></div>');
        this.el = el.child('.pad-toc-container');
        var button = new Ext.Button({
            renderTo: el.child('.pad-toc-tool'),
            iconCls: 'silk-control-play',
            enableToggle: true,
            tooltip: 'Remain expanded'
        });

        this.tree = new Ext.tree.TreePanel({
            autoScroll: true,
            rootVisible: false,
            height: 150,
            renderTo: el.child('.pad-toc-tree'),
            root: {
                id: 'root',
                text: 'TOC',
                expanded: true,
                children: []
            }
        });
        var treeWidth = this.tree.getWidth() + 2;

        this.getEl().alignTo(this.container, 'tl-tl', [0, 27]);
        var toc = el.child('.pad-toc-container');
        var x = toc.getX() - treeWidth;
        this.el.setX(x);

        var opts = {};
        var mouseenter = function(e, tab) {
            if (opts.anim && opts.anim.isAnimated) return;
            toc.setX(x + treeWidth, opts);
        };
        var mouseleave = function(e, tab, opt) {
            if (opts.anim && opts.anim.isAnimated || button.pressed) return;
            toc.setX(x, opts);
        }

        toc.on('mouseenter', mouseenter);
        toc.on('mouseleave', mouseleave);
    }
});
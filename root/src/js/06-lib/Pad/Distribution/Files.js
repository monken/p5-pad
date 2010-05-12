Ext.ns('Pad.Distribution.Files');

Pad.Distribution.Files = Ext.extend(Ext.tree.TreePanel, {
    autoScroll: true,
    rootVisible: false,
    initComponent: function() {
        Ext.apply(this, {
            root: {
                id: this.distribution,
                expanded: true,
                //listeners: { append: this.onLoad }
            }
        });
        this.on('click', this.onClick);
        Pad.Distribution.Files.superclass.initComponent.call(this, arguments);

    },
    loader: new Ext.tree.TreeLoader({
        directFn: function(root, cb) {
            Distribution.files(root, cb)
        }
    }),
    onRender: function(tree) {
        Pad.Distribution.Files.superclass.onRender.call(this, tree);
        new Ext.tree.TreeSorter(this, {
            folderSort: true
        });
    },
    onLoad: function(tree, node) {
        console.log(node, 1);
        node.firstChild.expand();
    },
    onClick: function(node) {
        if (node.attributes.module) {
            var pod = new Pad.Reader.Pod({
                title: node.attributes.module
            });
            Ext.getCmp('pad-reader').add(pod);
            Ext.getCmp('pad-reader').activate(pod);
        }
    }

});
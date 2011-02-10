Ext.ns('Pad.Files');

Pad.Files = Ext.extend(Ext.tree.TreePanel, {
    autoScroll: true,
    rootVisible: false,
    anchor: '100%',
    animate: false,
    cls: 'x-portlet',
    initComponent: function() {
        var that = this;
        Ext.apply(this, {
            root: {
                id: this.module,
                expanded: true,
                listeners: {
                    expand: function(node) {
                        node.expandChildNodes();
                    }
                }
            }
        });
        
        Pad.Files.superclass.initComponent.call(this, arguments);
        var iconCls = this.iconCls;
        this.on('click', this.onClick, this);
        this.on('load', this.onLoad, this);

    },
    loader: new Ext.tree.TreeLoader({
        directFn: function(root, cb) {
            Module.files(root, cb)
        }
    }),
    onRender: function(tree) {
        Pad.Files.superclass.onRender.call(this, tree);
        new Ext.tree.TreeSorter(this, {
            folderSort: true
        });

    },
    onLoad: function() {
        if (!this.root.firstChild) return this.root.on('expand', this.destroy, this);
        this.release = this.root.firstChild.attributes.release;
    },
    onClick: function(node, e) {
        var pod;
        if (node.hasChildNodes()) return node.toggle();

        var file = "";
        node.bubble(function(node) {
            if (node.getDepth() == 0) return;
            file = node.text + (file ? '/' + file : '');
        });

        if (node.attributes.module && !e.shiftKey) pod = new Pad.Reader.Pod({
            title: node.attributes.module,
            release: this.release,
            file: file,
        });
        else if (node.attributes.module) pod = new Pad.Reader.Source.Code({
            title: node.attributes.module,
            release: this.release,
            file: file,
        });
        else pod = new Pad.Reader.Source({
            title: node.attributes.text,
            release: this.release,
            file: file,
        });
        Pad.UI.TabPanel.add(pod);

    }

});
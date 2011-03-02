Ext.ns('Pad.Files');
Pad.Files = Ext.extend(Ext.tree.TreePanel, {
    autoScroll: true,
    rootVisible: true,
    anchor: '100%',
    animate: false,
    xtype: 'padfiles',
    references: 1,
    cls: 'x-portlet',
    initComponent: function() {
        var that = this;
        Ext.apply(this, {
            root: {
                id: this.author + "/" + this.release,
                text: this.author + "/" + this.release,
                expanded: true,
                level: -1,
            }
        });
        
        Pad.Files.superclass.initComponent.call(this, arguments);
        var iconCls = this.iconCls;
        this.on('click', this.onClick, this);
        this.on('load', this.onLoad, this);

    },
    loader: new Ext.tree.TreeLoader({
        load: function(node, cb, scope) {
            var tree = node.ownerTree;
            var that = this;
            var level = node.attributes.level + 1;
            Release.files({ author: tree.author, release: tree.release, level: level, prefix: level == 0 ? '' : node.attributes.path }, function(result) {
            that.handleResponse({
                            responseData: Ext.isArray(result) ? result : null,
                            responseText: result,
                            argument: { node: node, callback: cb, scope: scope }
                        });
                    });
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
    },
    onClick: function(node, e) {
        var pod;
        if (node.hasChildNodes()) return node.toggle();

        var file = node.attributes.path;

        if (node.attributes.module && !e.shiftKey) pod = new Pad.Reader.Pod({
            title: node.attributes.module,
            release: this.release,
            author: this.author,
            file: file,
        });
        else if (node.attributes.module) pod = new Pad.Reader.Source.Code({
            title: node.attributes.module,
            release: this.release,
            author: this.author,
            file: file,
        });
        else pod = new Pad.Reader.Source({
            title: node.attributes.text,
            author: this.author,
            release: this.release,
            file: file,
        });
        Pad.UI.TabPanel.add(pod);

    }

});

Ext.reg('padfiles', Pad.Files);
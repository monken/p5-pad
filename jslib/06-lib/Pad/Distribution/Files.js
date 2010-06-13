Ext.ns('Pad.Distribution.Files');

Pad.Distribution.Files = Ext.extend(Ext.tree.TreePanel, {
    autoScroll: true,
    rootVisible: false,
    anchor : '100%',
    frame : true,
    collapsible : true,
    closable : true,
    tools: [{id:'refresh'}],
    draggable : true,
    iconCls: 'silk-bricks',
    cls : 'x-portlet',
    initComponent: function() {
        var that = this;
        Ext.apply(this, {
            title: this.distribution,
            root: {
                id: this.distribution,
                expanded: true,
                listeners: {
                    expand: function(node) {
                        node.expandChildNodes();
                    }
                }
            }
        });
        this.on('click', this.onClick);
        Pad.Distribution.Files.superclass.initComponent.call(this, arguments);
        var iconCls = this.iconCls;
        this.getLoader().on('beforeload', function(node) {
            that.setIconClass('silk-loading');
        });
        this.getLoader().on('load', function(node) {
            that.setIconClass(iconCls);
        });

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
    onClick: function(node) {
        var pod = node.attributes.module 
            ? new Pad.Reader.Pod({
                title: node.attributes.module
            }) 
            : new Pad.Reader.Source({
                title: node.attributes
        });
        Ext.getCmp('pad-reader').add(pod);
        Ext.getCmp('pad-reader').activate(pod);
        
    }

});
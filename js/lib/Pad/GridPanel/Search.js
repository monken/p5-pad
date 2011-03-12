Pad.GridPanel.Search = Ext.extend(Pad.GridPanel, {
    title: 'Releases',
    iconCls: 'silk-page',
    api: { read: Release.search },
    autoExpandColumn: 'name',
    resultTpl: "{module}",
    rowNumberer: false,
    viewConfig: {
        enableRowBody: true, 
        getRowClass: function(r, rowIndex, rp, ds){
            var pod;
            if( r.data.highlight && r.data.highlight.pod) pod = r.data.highlight.pod.join(" ... ");
            rp.body = '<br><p style="color: #666">'+pod+'</p>';
            return 'x-grid3-row-expanded';
        }
    },
    cm: [
    {
        header: "Description",
        sortable: false,
        width: 220,
        id: 'name',
        dataIndex: 'module',
        renderer: function(v, row, r) {
            return '<div class="pad-search-result"><strong>' + (v || r.data.path) + '</strong><p>' + r.data["abstract"] + '</p>';
        }
       },
    {
        header: "Release",
        width: 160,
        sortable: false,
        dataIndex: 'release',
        renderer: Ext.util.Format.htmlEncode
    },
    {
        header: "Author",
        width: 80,
        sortable: false,
        dataIndex: 'author',
        renderer: Util.authorRenderer
    },
    ],
    fields: ['module', 'path', 'abstract', 'release', 'author', 'highlight'],
    initEvents: function() {
        this.on('rowdblclick', this.onRowDblClick, this);
        Pad.GridPanel.Search.superclass.initEvents.apply(this, arguments);
    },
    onRowDblClick: function(grid, index, e) {
        var row = this.getStore().getAt(index);
        var module = row.get('module');
        Pad.UI.TabPanel.add(new Pad.Reader.Pod({ title: module }));
    },
});

Ext.reg('padgridpanelsearch', Pad.GridPanel.Search);
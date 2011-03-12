Pad.Author = Ext.extend(Pad.Panel, {
    iconCls: 'silk-user',
    layout: 'border',
    identifier: ['title'],
    xtype: 'padauthor',
    controller: 'author',
    overview: {
        region: 'north',
        xtype: 'panel',
        height: 200,
        border: false,
        padding: 20,
        //tbar: [{ text: 'Button' }],
        
        tpl: ['<div class="pad-author-overview">',
        '<img src="{gravatar_url}?s=160" class="pad-author-img">',
        '<div class="pod pad-author-id"><h1>{name}</h1> {pauseid}</div>',
        '<a href="mailto:{email}" class="pad-author-email">{email}</a>',
        '<br><br>',
        '<table><tr><td>BackPAN Archive:</td><td><a href="http://backpan.perl.org/authors/{dir}/" target="_blank">{dir}</a></td></tr>',
        '<tr><td>Schwartz Factor:</td><td>',
        '<a href="http://use.perl.org/~brian_d_foy/journal/8314" target="_blank"><span id="pad-author-schwartz-{pauseid}"><i>loading...</i></span></a></td></tr></table>',
        '</div>']
    },
    grid: {
        region: 'center',
        border: false,
        xtype: 'padgridpanelrelease',
        api: { read: Release.byAuthor },
        groupField: 'distribution',
    },
    initComponent: function() {
        this.grid = Ext.ComponentMgr.create(this.grid);
        this.overview = Ext.ComponentMgr.create(this.overview);
        this.items = [this.overview, this.grid],
        this.grid.store.setBaseParam('author', this.title);
        Pad.Author.superclass.initComponent.call(this, arguments);
    },
    afterRender: function() {
        Pad.Author.superclass.afterRender.apply(this, arguments);
        Author.details({id: this.title }, this.renderDetails.createDelegate(this));
        
    },
    renderDetails: function(res) {
        this.overview.update(res);
        Author.schwartz({id: this.title }, this.injectSchwartz.createDelegate(this));
    },
    injectSchwartz: function(res) {
        var terms = res.facets.schwartz.terms;
        var rels = 0;
        for(var i = 0; i < terms.length; i++) {
            rels += terms[i].count;
        }
        var schwartz = terms.length/rels;
        console.log(this.title);
        Ext.get("pad-author-schwartz-" + this.title).dom.innerHTML = Ext.util.Format.number(schwartz, '0.0000');
    },
    initEvents: function() {
        this.grid.getStore().on('load', this.onLoad, this);
        this.grid.getStore().on('beforeload', this.onBeforeLoad, this);
    },
    setToken: function() {
        Ext.History.add(["", this.controller, this.title].join("/"));
    },
});
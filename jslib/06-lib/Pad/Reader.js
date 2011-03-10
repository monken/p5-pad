Ext.ns('Pad.Reader');

Pad.Reader = Ext.extend(Pad.Panel, {
    title: 'Pad.Reader',
    xtype: 'padreader',
    loaded: false,
    identifier: ['author','release','path'],
    scrollCache: {
        top: 0,
        left: 0
    },
    initComponent: function() {
        if(this.path) this.title = this.path;
        Pad.Reader.superclass.initComponent.call(this, arguments);
        this.initEvents();
    },
    initEvents: function() {
        this.addEvents('load');
    },
    afterRender: function() {
        Pad.Reader.superclass.afterRender.call(this, arguments);
        this.ownerCt.on('beforetabchange', this.onDeactivate, this);
        this.on('activate', this.onActivate, this);

    },
    setToken: function() {
        if(!this.loaded) return this.on('load', this.setToken, this);
        Ext.History.add(
            "/" + [this.controller, this.author, this.release, this.path].join("/")
        );
    },
    onDeactivate: function(tab, newtab, oldtab) {
        if (!oldtab || oldtab != this) return;
        this.scrollCache = this.body.getScroll();
    },
    onActivate: function(tab, newtab, oldtab) {
        this.body.scrollTo('top', this.scrollCache.top);
    },
    onRender: function(tab) {
        Pad.Reader.superclass.onRender.call(this, tab);
        this.oldIconCls = this.iconCls;
        this.setIconClass('silk-loading');
    },
    onLoad: function(res) {
        this.setIconClass(this.oldIconCls);
        if(res) {
            Ext.copyTo(this, res, ['path', 'release', 'author', 'module']);
            Ext.fly(this.ownerCt.getTabEl(this)).child('span.x-tab-strip-text', true).qtip = [this.author, this.release, this.path].join("/");
            this.setTitle(this.module || this.path);
        } else {
            this.path = this.title;
            this.body.update('Not Found');
        }
        this.loaded = true;
        this.fireEvent('load');
    }

});
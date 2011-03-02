Ext.ns('Pad.Reader');

Pad.Reader = Ext.extend(Ext.Panel, {
    title: 'Pad.Reader',
    xtype: 'padreader',
    loaded: false,
    identifier: 'release',
    scrollCache: {
        top: 0,
        left: 0
    },
    initComponent: function() {
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
            
            if(!this.file) this.file = res.file;
            if(!this.release) this.release = res.release;
            if(!this.author) this.author = res.author;
            Ext.fly(this.ownerCt.getTabEl(this)).child('span.x-tab-strip-text', true).qtip = [this.author, this.release, this.file].join("/");
        } else {
            this.file = this.title;
            this.body.update('Not Found');
        }
        this.loaded = true;
        this.fireEvent('load');
    }

});
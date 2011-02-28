Ext.ns('Pad.Reader');

Pad.Reader = Ext.extend(Ext.Panel, {
    title: 'Pad.Reader',
    xtype: 'padreader',
    scrollCache: {
        top: 0,
        left: 0
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
            this.file = res.file;
            this.release = res.release;
            Ext.fly(this.ownerCt.getTabEl(this)).child('span.x-tab-strip-text', true).qtip = this.file;
        } else {
            this.file = this.title;
            this.body.update('Not Found');
        }
    }

});
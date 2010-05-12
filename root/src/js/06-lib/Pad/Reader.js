Ext.ns('Pad.Reader');

Pad.Reader = Ext.extend(Ext.Panel, {
    title: 'Pad.Reader',
    scrollCache: {top:0,left:0},
    afterRender: function() {
        Pad.Reader.superclass.afterRender.call(this, arguments);
        this.ownerCt.on('beforetabchange', this.onDeactivate, this);
        this.on('activate', this.onActivate, this);

    },
    onDeactivate: function(tab, newtab, oldtab) {
        if(!oldtab || oldtab != this) return;
        this.scrollCache = this.body.getScroll();
    },
    onActivate: function(tab, newtab, oldtab) {
        this.body.scrollTo('top', this.scrollCache.top);
    }

});
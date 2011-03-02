Ext.ns('Pad.CardPortlet');

Pad.CardPortlet = Ext.extend(Ext.Panel, {
    layout: 'card',
    cls: 'x-portlet',
    height: 200,
    title: 'Browser',
    activeItem: 0,
    iconCls: 'silk-bricks',
    anchor: '100%',
    frame: true,
    identifier: 'distribution',
    collapsible: true,
    draggable: true,
    add: function(c, count) {
        var found = this.find(this.identifier, c[this.identifier]);
        if (found && found[0]) {
            if(count) found[0].references++;
            return this.activate(found[0]);
        }

        if(Ext.isArray(c)) return;
        c = Ext.ComponentMgr.create(c);
        var comp = Pad.CardPortlet.superclass.add.call(this, c);
        comp.on('beforeload', this.onBeforeLoad, this)
        comp.on('load', this.onLoad, this)
        comp.on('exception', this.onLoad, this)
        this.activate(c);
        return c;
    },
    remove: function(c) {
        var found = this.find(this.identifier, c[this.identifier]);
        if(!found || !found[0]) return;
        found[0].references--;
        if(found[0].references) return;
        return Pad.CardPortlet.superclass.remove.call(this, found[0]);
    },
    activate: function(c) {
        //this.setTitle(c.distribution);
        if (this.rendered) this.layout.setActiveItem(c);
    },
    initComponent: function() {
        this.initTools();
        this.plugins = new Ext.ux.PanelResizer({
                    minHeight: 100
        });
        Pad.CardPortlet.superclass.initComponent.call(this);
    },
    initTools: function() {
        this.addTool({
            id: 'down',
            handler: this.showMenu.createDelegate(this, [])
        });
    },
    onBeforeLoad: function(node) {
        this.oldIconCls = this.iconCls;
        this.setIconClass('silk-loading');
    },
    onLoad: function(ev) {
        this.setIconClass(this.oldIconCls);
        var c = this.layout.activeItem;
        var found = this.find(this.identifier, c[this.identifier]);
        if(found.length > 1) {
            found[found.length-1].destroy();
            this.activate(found[0]);
        }
    },
    onException: function(proxy, type, action, options) {
        console.log(proxy, type, action, options);
    },
    selectFromMenu: function(m) {
        var add = {};
        add[this.identifier] = m.text
        this.add(add);
    },
    showMenu: function() {
        var menu = new Ext.menu.Menu();
        var that = this;
        this.items.each(function(c) {
            menu.add({
                text: c[that.identifier],
                iconCls: 'silk-bricks',
                handler: that.selectFromMenu,
                scope: that
            });
        });
        if(this.items.length) menu.show(this.getTool('down'));
    },
});
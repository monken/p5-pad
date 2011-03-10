Pad.GoToComboBox = Ext.extend(Ext.form.ComboBox, {
    expand: function() {},
    afterRender: function() {
        Pad.GoToComboBox.superclass.afterRender.call(this, arguments);
        this.list.setStyle({
            left: null,
            top: null,
            height: null,
            width: null,
            position: null,
            "border-width": 0
        });
        this.list.first().setStyle({
            width: null,
            height: 121,
            overflow: 'auto',
            "border-width": 0
        });
        this.keyNav.enter = function(e){
            this.shift = e.shiftKey;
            this.onViewClick();
        };
        this.keyNav.esc = null;
    },
    collapse: function() {},
    restrictHeight: function() {},
});

Pad.GoTo = Ext.extend(Ext.Window, {
    layout: 'border',
    width: 300,
    iconCls: 'silk-package',
    height: 200,
    border: false,
    tpl: '<tpl for="."><div class="x-combo-list-item">{name}</div></tpl>',
    store: {
        root: 'data',
        fields: ['pauseid', 'name', 'release', 'file'],
    },
    combo: {
        region: 'north',
        height: 20,
        xtype: 'combo',
        minChars: 2,
        queryDelay: 100,
        maxHeight: 50,
        shadow: false,
        loadingText: null,
        valueField: 'name',
        displayField: 'name',
        triggerAction: 'all',
        lazyInit: false,
        hideTrigger: true,
        listeners: {
            afterrender: function(el) {
                el.focus(true, 100);
            },
        }
    },
    list: {
        region: 'center',
        title: 'Results',
    },
    initComponent: function() {
        var that = this;
        this.combo = new Pad.GoToComboBox(Ext.applyIf({ tpl: this.tpl }, this.combo));
        this.list = new Ext.Panel(this.list);
        
        this.store.proxy = new Pad.DataProxy({ api: { read: this.api } }),
        this.combo.store = new Ext.data.JsonStore(this.store);
        Ext.apply(this, {
            items: [this.combo, this.list]
        });
        Pad.GoTo.superclass.initComponent.call(this, arguments);
    },
    initEvents: function() {
        Pad.GoTo.superclass.initEvents.call(this, arguments);
        var that = this;
        this.combo.on('select', this.onSelect, this);
        this.combo.getStore().on('beforeload', function() {
            that.setIconClass('silk-loading');
        });
        this.combo.getStore().on('load', function() {
            that.setIconClass('silk-package');
        });
        this.combo.on('specialkey', function(e) {console.log(e)});

    },
    afterRender: function() {
        Pad.GoTo.superclass.afterRender.call(this, arguments);
        this.combo.list.appendTo(this.list.body);
        this.combo.list.show();

    }
});
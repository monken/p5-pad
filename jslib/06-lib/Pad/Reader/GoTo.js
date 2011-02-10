Ext.ns('Pad.Reader.GoTo');
Ext.ns('Pad.Reader.GoToComboBox');

Pad.Reader.GoToComboBox = Ext.extend(Ext.form.ComboBox, {
    expand: function() {},
    afterRender: function() {
        Pad.Reader.GoToComboBox.superclass.afterRender.call(this, arguments);
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

Pad.Reader.GoTo = Ext.extend(Ext.Window, {
    title: 'Go to module',
    layout: 'border',
    width: 300,
    iconCls: 'silk-package',
    height: 200,
    border: false,
    store: {
        root: 'data',
        fields: ['name', 'release', 'file']
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
        this.combo = new Pad.Reader.GoToComboBox(this.combo);
        this.list = new Ext.Panel(this.list);
        this.combo.store = new Ext.data.DirectStore(this.store);
        this.combo.getStore().proxy.setApi(Ext.data.Api.actions.read, Module.search);
        Ext.apply(this, {
            items: [this.combo, this.list]
        });
        Pad.Reader.GoTo.superclass.initComponent.call(this, arguments);
    },
    initEvents: function() {
        Pad.Reader.GoTo.superclass.initEvents.call(this, arguments);
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
        Pad.Reader.GoTo.superclass.afterRender.call(this, arguments);
        this.combo.list.appendTo(this.list.body);
        this.combo.list.show();

    },
    onSelect: function(combo, r) {
        var pod;
        if (combo.shift) {
            pod = new Pad.Reader.Source.Code({
                title: r.data.name,
                release: r.data.release,
                file: r.data.file,
            });
        } else {
            pod = new Pad.Reader.Pod({
                title: r.data.name,
                release: r.data.release,
                file: r.data.file,
            });
        }
        Pad.UI.TabPanel.add(pod);
        this.close();
    }
});

new Ext.KeyMap(document, {
    key: "m",
    crtl: true,
    alt: true,
    fn: function(a, e) {
        (new Pad.Reader.GoTo()).show();
        e.preventDefault();
    },
});
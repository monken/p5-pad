Ext.ns('Pad.Reader.GoTo');

Pad.Reader.GoTo = Ext.extend(Ext.Window, {
    title: 'Go to module',
    layout: 'border',
    width: 300,
    height: 200,
    border: false,
    initComponent: function() {
        var that = this;
        Ext.apply(this, {
            items: [{
                region: 'north',
                height: 20,
                xtype: 'field',
                listeners: {
                    afterrender: function(el) {
                        el.focus(true, 100);
                        el.getEl().on('keydown', that.onKeyDown, that);
                    },
                }
            }, {
                region: 'center',
                title: 'foo'
            }
            ]
        });
        Pad.Reader.GoTo.superclass.initComponent.call(this, arguments);
    },
    afterRender: function(el) {
        Pad.Reader.GoTo.superclass.afterRender.call(this, el);
    },
    onKeyDown: function(e) {
        var key = e.getKey();
        if(key == e.DOWN) {
            
        } else if(key == e.UP) {
            
        } else if(key == e.ENTER) {
            
        } else {
            
        }
    },

});

new Ext.KeyMap(document, {
    key: "t",
    shift: true,
    fn: function() {
        new Pad.Reader.GoTo().show()
    },
});
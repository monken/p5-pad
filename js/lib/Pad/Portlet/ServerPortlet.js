Pad.Portlet.ServerPortlet = Ext.extend(Ext.Panel, {
    cls: 'x-portlet',
    height: 80,
    title: 'Select Server',
    iconCls: 'silk-wrench',
    frame: true,
    initComponent: function() {
        this.items = [{
            xtype: 'combo',
            lazyRender: true,
            triggerAction: 'all',   
            mode: 'local',
            value: API.url,
            store: new Ext.data.ArrayStore({
                id: 0,
                fields: ['value'],
                data: [
                    ['http://api.netcubed.de'],
                    ['http://api2.metacpan.org'],
                    ['http://localhost:5000']]
            }),
            displayField: 'value',
            listeners: {
                change: this.onChange,
                select: this.onChange
            }
        }];
        Pad.Portlet.ServerPortlet.superclass.initComponent.call(this, arguments);
    },
    onChange: function(combo) {
        API.url = combo.getValue();
    }
});
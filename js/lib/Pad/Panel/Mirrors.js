Pad.Mirrors = Ext.extend(Pad.Panel, {
    iconCls: 'silk-server',
    layout: 'border',
    title: 'Mirrors',
    map: {
        xtype: 'gmappanel',
        region: 'south',
        split: true,
        zoomLevel: 1,
        height: 300,
        gmapType: 'map',
        mapConfOpts: ['enableScrollWheelZoom', 'enableDoubleClickZoom', 'enableDragging'],
        mapControls: ['GSmallMapControl', 'GMapTypeControl', 'NonExistantControl'],
        setCenter: {
            lat: 0,
            lng: 0
        }
    },
    grid: {
        region: 'center',
        border: false,
        title: null,
        xtype: 'padgridpanelmirror',
        api: {
            read: Mirror.byLocation
        },
    },
    initComponent: function() {
        this.grid = Ext.ComponentMgr.create(this.grid);
        this.grid.store.on('load', this.setMarkers, this);
        this.grid.on('rowdblclick', this.centerMap, this);
        this.map = Ext.ComponentMgr.create(this.map);
        this.items = [this.map, this.grid],
        Pad.Author.superclass.initComponent.call(this, arguments);
    },
    
    centerMap: function(grid, index, e) {
        var row = grid.getStore().getAt(index);
        var loc = row.data.location;
        var point = new GLatLng(loc[1], loc[0])
        this.map.getMap().setCenter(point, 8);
    },
    setMarkers: function(store, records) {
        var me = Util.location;
        var mePoint = new GLatLng(me.coords.latitude, me.coords.longitude);
        var blueIcon = new GIcon(G_DEFAULT_ICON);
        blueIcon.image = "http://www.google.com/intl/en_us/mapfiles/ms/micons/blue-dot.png";
        this.map.zoomLevel = 5;
        
        this.map.addMarker(mePoint, {
            icon: blueIcon
        },true, true);
        for (var i = 0; i < records.length; i++) {
            var data = records[i].data;
            var loc = data.location;
            if(!loc) continue;
            var point = new GLatLng(loc[1], loc[0]);
            this.map.addMarker(point);
        }
        
        

    },
});
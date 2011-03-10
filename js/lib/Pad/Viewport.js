Pad.Viewport = Ext.extend(Ext.Viewport, {
    layout:'border',
    frame: false,
    defaults: { bodyStyle: 'background-color: #e8f0Fe;', bodyCssClass: 'pad-no-scroll-x', border: false, autoScroll: false },
    
    initComponent: function() {
        this.FilesPanel = new Pad.FilesPanel({items: [] });
        this.RelatedPanel = new Pad.RelatedPanel();
        this.TabPanel = new Pad.TabPanel({ items: [new Pad.Home()] });
        this.ServerPortlet = new Pad.Portlet.ServerPortlet();
        var tools = [];
        this.items = [{
                region: 'center',
                style: 'padding-left: 10px',
                layout: 'fit',
                border:false,
                items: [ this.TabPanel ]
            },{
            xtype:'portal',
            region:'east',
            width: 250,
            items:[{
                width:250,
                style:'padding:10px',
                items:[ 
                this.FilesPanel,
                this.RelatedPanel,
                this.ServerPortlet
                 ]
            }]

            /*
             * Uncomment this block to test handling of the drop event. You could use this
             * to save portlet position state for example. The event arg e is the custom 
             * event defined in Ext.ux.Portal.DropZone.
             */
    //            ,listeners: {
    //                'drop': function(e){
    //                    Ext.Msg.alert('Portlet Dropped', e.panel.title + '<br />Column: ' + 
    //                        e.columnIndex + '<br />Position: ' + e.position);
    //                }
    //            }
        }];
        
        Pad.Viewport.superclass.initComponent.call(this, arguments);
    },
});
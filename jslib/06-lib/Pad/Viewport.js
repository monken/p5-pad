Pad.Viewport = Ext.extend(Ext.Viewport, {
    layout:'border',
    frame: false,
    defaults: { bodyStyle: 'background-color: #e8f0Fe;', bodyCssClass: 'pad-no-scroll-x', border: false, autoScroll: false },
    
    initComponent: function() {
        this.FilesPanel = new Pad.FilesPanel({items: [] });
        this.RelatedPanel = new Pad.RelatedPanel();
        this.TabPanel = new Pad.TabPanel();
        
        this.items = [/*{
            xtype:'portal',
            region:'west',
            width: 200,
            items:[{
                style:'padding:10px',
                width:200,
                items:[{
                    title: 'Welcome',
                    tools: tools,
                    iconCls: 'silk-emoticon-smile',
                    html: '<img src="http://www.gravatar.com/avatar.php?gravatar_id=d534a891101c352b1f7872f4b0a33481&rating=G&size=80&default=http%3A%2F%2Fst.pimg.net%2Ftucs%2Fimg%2Fwho.png" style="float: left; width: 80; height: 80; padding-right: 2px" /> Welcome PERLER.<br><br><a href="#">Logout</a>'
                },{
                    title: 'Search',
                    tools: tools,
                    iconCls: 'silk-magnifier',
                    items: [{xtype: 'combo', emptyText: 'Module Name'}]
                },{
                    title: 'Toolbox',
                    tools: tools,
                    iconCls:'silk-wrench',
                    layout:'accordion',
                    layoutConfig:{
                        animate:true
                    },
                    items: [{
                        html: 'None',
                        title:'Favorites',
                        autoScroll:true,
                        border:false,
                        iconCls:'silk-star',
                        listeners: {
                            'afterrender': function(tab){ 
                                new Ext.dd.DropTarget(tab.getEl(), 
                                 { 
                                    ddGroup: 'group',
                                    notifyDrop: function(dd, e, data) {
                                    console.log(dd,e,data);
                                    console.log(this);
                                        console.log('mulle');
                                        return true;
                                    }
                                });
                            }
                        }

                    },{
                        title:'Recent',
                        html: 'foo',
                        border:false,
                        autoScroll:true,
                        iconCls:'silk-application-view-list'
                    },{
                        title:'Popular',
                        html: 'foo',
                        border:false,
                        autoScroll:true,
                        iconCls:'silk-control-rewind'
                    }]
                },{
                    title: '(3) News',
                    tools: tools,
                    collapsed: true,
                    iconCls: 'silk-rss',
                    items: [{html: 'News Item I'}]
            },{
                    title: '(22) Iron Man',
                    tools: tools,
                    collapsed: true,
                    iconCls: 'silk-rss',
                    items: [{html: 'News Item I'}]
            }]
            }]},*/{
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
                this.RelatedPanel 
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
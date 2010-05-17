
Ext.BLANK_IMAGE_URL = '/static/extjs/images/default/s.gif';

Ext.onReady(function(){

    Ext.Direct.addProvider(Ext.app.REMOTING_API);

    Ext.QuickTips.init();

    var tools = [{
        id:'close',
        handler: function(e, target, panel){
            panel.ownerCt.remove(panel, true);
        }
    }];

    var viewport = new Ext.Viewport({
        layout:'border',
        frame: false,
        defaults: { bodyStyle: 'background-color: #e8f0Fe;', bodyCssClass: 'pad-no-scroll-x', border: false, autoScroll: false },
        items:[{
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
                    html: '<img src="http://www.gravatar.com/avatar.php?gravatar_id=d534a891101c352b1f7872f4b0a33481&rating=G&size=80&default=http%3A%2F%2Fst.pimg.net%2Ftucs%2Fimg%2Fwho.png" style="float: left" /> Welcome PERLER.<br><br><a href="#">Logout</a>'
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
            }]},{
                region: 'center',
                layout: 'fit',
                border:false,
                items: [
                    {
                        xtype: 'tabpanel', 
                        style:'padding:10px 0px 10px 0px',
                        id: 'pad-reader',
                        enableTabScroll: true,
                        bbar:[{}],
                        activeItem: 0, 
                        plain: true,
                        items: [new Pad.Reader.Source({title: 'PPI::Document'}), {
                                title: 'Results for "catalyst dispatch"',
                                closable: true,
                                iconCls: 'silk-magnifier',
                                html: 'foo'
                            }]
                    }]
            },{
            xtype:'portal',
            region:'east',
            width: 200,
            items:[{
                width:200,
                style:'padding:10px',
                items:[ new Pad.Distribution.Files({ distribution: 'PPI' })
                ,{
                    title: 'Related Modules',
                    tools: tools,
                    iconCls: 'silk-package-link',
                    html: '<ul><li>Class::MOP<li>Class::MOP::Class<li>Moose::Meta::Attribute</ul>'
                }]
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
        }]
    });
});


Ext.ns('Pad.Reader.Pod');

Pad.Reader.Pod = Ext.extend(Pad.Reader, {
    title: 'Pad.Reader',
    autoScroll: true,
    iconCls: 'silk-package',
    padding: '5px 5px 5px 25px',
    xtype: 'padreaderpod',
    closable: true,
    tbar: [{
        iconCls: 'silk-star',
        enableToggle: true,
        tooltip: 'Add to favorites'
    },
    '->', {
        iconCls: 'silk-page-white-code',
        text: 'Source Code',
        enableToggle: true,
        handler: function() {
            var pod = new Pad.Reader.Source.Code({
                title: this.ownerCt.ownerCt.title,
                distribution: this.ownerCt.ownerCt.distribution
            });
            Pad.UI.TabPanel.add(pod);
        }
    },
    {
        iconCls: 'silk-bug',
        text: 'Report Bug'
    },
    {
        iconCls: 'silk-award-gold',
        text: 'Rate Distribution'
    },
    {
        iconCls: 'silk-wrench',
        text: 'Tools',
        menu: [{
            text: 'Diff Releases'
        },
        {
            text: 'Grep Release'
        }]
    },
    {
        iconCls: 'silk-printer',
        tooltip: 'Print document'
    }],
    initComponent: function() {
        Pad.Reader.Pod.superclass.initComponent.call(this, arguments);
        Ext.apply(this, {
            toc: new Pad.Reader.TOC.Pod({})
        });

    },
    onRender: function(tab) {
        Pad.Reader.Pod.superclass.onRender.call(this, tab);
        var that = this;
        Module.pod(this.title, this.onLoad.createDelegate(this));
        this.toc.body = this.body;
    },
    onLoad: function(prov, res) {
        Pad.Reader.Pod.superclass.onLoad.call(this, prov, res);
        if(!res.result) return;
        this.body.insertHtml('afterBegin', res.result.html);
        this.toc.tree.root.appendChild(res.result.toc);
        var that = this;
        this.toc.tree.on('click', function(node) {
            that.scrollToSection(node.text);
        });
    },
    afterRender: function(tab, foo) {
        Pad.Reader.Pod.superclass.afterRender.call(this, tab);

        this.toc.render(this.tbar);
        this.tabEl.dd = new Ext.dd.DragSource(this.tabEl, {
            ddGroup: 'group',
            dropEl: this,
            onMouseUp: function(e) {
                if (!this.dropEl.isVisible()) {
                    this.dropEl.show();
                }
            }
        });
    },
    scrollToSection: function(section) {
        var el = Ext.select('a[name="section-' + this.title + '-' + section + '"]');
        if (!el.elements[0]) return;
        var top = (Ext.fly(el.elements[0]).getOffsetsTo(this.body)[1]) + this.body.dom.scrollTop;
        this.body.scrollTo('top', top, {
            duration: .5
        });
    }
});
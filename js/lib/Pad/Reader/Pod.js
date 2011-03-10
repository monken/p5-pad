Ext.ns('Pad.Reader.Pod');

Pad.Reader.Pod = Ext.extend(Pad.Reader, {
    title: 'Pad.Reader',
    autoScroll: true,
    controller: 'pod',
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
        handler: function() {
            var pod = new Pad.Reader.Source.Code({
                title: this.ownerCt.ownerCt.title,
                release: this.ownerCt.ownerCt.release,
                author: this.ownerCt.ownerCt.author,
                path: this.ownerCt.ownerCt.path,
                
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
        Module.pod({ file_id: this.file_id, author: this.author, release: this.release, path: this.path, name: this.name || this.title }, this.onLoad.createDelegate(this));
        this.toc.body = this.body;
    },
    onLoad: function(res) {
        Pad.Reader.Pod.superclass.onLoad.call(this, res);
        if(!res) return;
        res.html = res.html.replace(/<pre>/g, '<pre class="brush: pl; class-name: \'highlight\'; toolbar: false;">');
        res.html = this.fixModuleLinks(res.html);
        this.body.insertHtml('afterBegin', '<div class="pod">' + res.html + '</div>');
        SyntaxHighlighter.highlight();
        this.toc.parseTOC(Ext.select('ul[id="index"]', false, this.body.dom).elements[0]);
        var that = this;
        this.toc.tree.on('click', function(node) {
            that.scrollToSection(node.id);
        });
    },
    fixModuleLinks: function(html) {
        html = html.replace(/ class="moduleLink"/g, ' onclick="Pad.UI.TabPanel.add(new Pad.Reader.Pod({title: this.getAttribute(\'href\')})); return false;"');
        return html;
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
        var el = Ext.select('[id="' + section + '"]', false, this.body.dom);
        if (!el.elements[0]) return;
        var top = (Ext.fly(el.elements[0]).getOffsetsTo(this.body)[1]) + this.body.dom.scrollTop;
        this.body.scrollTo('top', top, {
            duration: .5
        });
    }
});
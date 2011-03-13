Ext.ns('Pad');
var Util = {
    loadPage: function(page) {
        var parts = page.split(/\//);
        parts.shift();
        for(var i = 0; i < parts.length; i++) {
            parts[i] = unescape(parts[i].replace(/\+/g, " "));
        }
        if (parts[0] == 'mirrors') {
            Pad.UI.TabPanel.add(new Pad.Mirrors);
        } else if (parts[0] == 'recent') {
            Pad.UI.TabPanel.add(new Pad.Recent);
        } else if (parts[0] == 'home') {
            Pad.UI.TabPanel.add(new Pad.Home);
        } else if (parts[0] == 'search') {
            Pad.UI.TabPanel.add(new Pad.Search({ query: parts[1] || '' }));
        } else if (parts[0] == 'pod' && parts.length > 3) {
            parts.shift();
            Pad.UI.TabPanel.add(new Pad.Reader.Pod({
                author: parts.shift(),
                release: parts.shift(),
                path: parts.join("/"),
            }));
        } else if (parts[0] == 'pod' && parts.length == 2) {
            Pad.UI.TabPanel.add(new Pad.Reader.Pod({
                title: parts[1]
            }));
        } else if (parts[0] == 'author') {
            Pad.UI.TabPanel.add(new Pad.Author({
                title: parts[1]
            }));
        }
    },
    location: null,
    getLocation: function(cb) {
        if(Util.location) return cb(Util.location);
        var client = new simplegeo.ContextClient('rGXAMBGT59UEhynt9q6qHDsFDJBpFJYk');
        return client.getLocationFromIP( function(err, pos) {
            Util.location = pos;
            cb(pos);
            client.getLocationFromBrowser({enableHighAccuracy: true, maximumAge: 60000}, function(err, pos) {
                    Util.location = pos;
                    cb(pos);
            });
        });
    },
    dateRenderer: function(value) {
        if(!value) return "undefined";
        return Date.parseDate(value, 'c').format('j M Y');
    },
    dateTimeRenderer: function(value) {
        if(!value) return "undefined";
        return Date.parseDate(value, 'c').format('j M Y, H:i:s');
    },
    currencyRenderer: function(value) {
        return Ext.util.Format.number(value, '0.0,00') + " €";
    },
    boolRenderer: function(value) {
        var checked = value && value != 0 ? 'checked="cheked"' : '';
        return '<input type="checkbox" disabled="disabled"' + checked + ' />';
    },
    percentageRenderer: function(value) {
        return Ext.util.Format.number(value * 100, '0.0,00') + ' %';
    },
    distanceRenderer: function(value) {
        return Ext.util.Format.number(value, '0.0,') + ' km';
    },
    taxRenderer: function(value, dom, res) {
        return Util.boolRenderer(res.data.tax_included) + ' &nbsp;&nbsp; ' + Ext.util.Format.number(value * 100, '0.0/i') + ' %';
    },
    urlRenderer: function(value) {
        return "<a href=\"/page/" + value + "\" target=\"_blank\">" + value + "</a>";
    },
    authorRenderer: function(value) {
        return "<a href=\"#/author/" + value + "\">" + value + "</a>";
    },
    protocolRenderer: function(value, dom, res) {
        var pr = [];
        if(res.data.http) {
            pr.push('<a href="' + res.data.http + '" target="_blank">http</a>');
        }
        if(res.data.ftp) {
            pr.push('<a href="' + res.data.ftp + '" target="_blank">ftp</a>');
        }
        if(res.data.rsync) {
            pr.push('<a href="' + res.data.rsync + '" target="_blank">rsync</a>');
        }
        return pr.join(" ");
    }
};
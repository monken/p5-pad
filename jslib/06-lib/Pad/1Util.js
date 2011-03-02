Ext.ns('Pad');
var Util = {
    dateRenderer: function(value) {
        return Date.parseDate(value, 'c').format('d.m.Y H:i:s');
    },
    currencyRenderer: function(value) {
        return Ext.util.Format.number(value, '0.0,00/i') + " €";
    },
    boolRenderer: function(value) {
        var checked = value && value != 0 ? 'checked="cheked"' : '';
        return '<input type="checkbox" disabled="disabled"' + checked + ' />';
    },
    percentageRenderer: function(value) {
        return Ext.util.Format.number(value * 100, '0.0,00/i') + ' %';
    },
    taxRenderer: function(value, dom, res) {
        return Util.boolRenderer(res.data.tax_included) + ' &nbsp;&nbsp; ' + Ext.util.Format.number(value * 100, '0.0/i') + ' %';
    },
    urlRenderer: function(value) {
        return "<a href=\"/page/" + value + "\" target=\"_blank\">" + value + "</a>";
    }
};
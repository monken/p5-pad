Pad.DataProxy = Ext.extend(Ext.data.DataProxy, {
    doRequest: function(action, rs, params, reader, callback, scope, options) {
        this.api[action](params, (function(res) {
            this.fireEvent('load');
            callback.call(scope, {
                records: reader.extractData(Ext.isArray(res) ? res : res.data, true),
                success: true,
                totalRecords: Ext.isArray(res) ? res.length : res.total
            }, options, true);
        }).createDelegate(this));
    },
    
});
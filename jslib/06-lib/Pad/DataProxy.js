Pad.DataProxy = Ext.extend(Ext.data.DataProxy, {
    doRequest: function(action, rs, params, reader, callback, scope, options) {
        this.api[action](params, function(res) {
            callback.call(scope, {
                records: reader.extractData(res, true),
                success: true,
            }, options, true);
        });
    },
    
});
var File;
File = {
    source: function(author, release, path, cb) {
        var reqs = 0;
        var source = {};
        Ext.Ajax.request({
            url: '/api/file/' + [author, release, path].join("/"),
            success: function(res) {
                var file = Ext.decode(res.responseText);
                Ext.copyTo(source, file, ['sloc', 'slop', 'pod_lines', 'stat']);
                reqs++;
                if(reqs == 2) cb(source);
            }
        });
        Ext.Ajax.request({
            url: '/api/source/' + [author, release, path].join("/"),
            success: function(res) {
                source.source = res.responseText;
                reqs++;
                if(reqs == 2) cb(source);
            }
        });
    }
};
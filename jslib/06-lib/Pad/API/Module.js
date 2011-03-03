var Module;
Module = {
    list: function() {},
    get: function(module, cb) {
        Ext.Ajax.request({
            url: '/api/module/' + module,
            success: function(res) {
                var obj = Ext.decode(res.responseText);
                cb(obj);
            }
        });
    },
    pod: function(param, cb) {
        if (!param.path) return Module.get(param.name, function(mod) {
            if (mod.path) Module.pod(mod, cb);
        });
        var reqs = 0;
        Ext.Ajax.request({
            url: '/api/file/' + [param.author, param.release, param.path].join("/"),
            success: function(res) {
                var file = Ext.decode(res.responseText);
                Ext.copyTo(param, file, ['toc']);
                reqs++;
                if (reqs == 2) cb(param);
            }
        });
        Ext.Ajax.request({
            url: '/api/pod/' + [param.author, param.release, param.path].join("/"),
            success: function(res) {
                param.html = res.responseText;
                reqs++;
                if (reqs == 2) cb(param);
            }
        });
    },
    code: function(param, cb) {
        if (!param.path) return Module.get(param.name, function(mod) {
            if (mod.path) Module.code(mod, cb);
        });

        var reqs = 0;
        Ext.Ajax.request({
            url: '/api/file/' + [param.author, param.release, param.path].join("/"),
            success: function(res) {
                var file = Ext.decode(res.responseText);
                Ext.copyTo(param, file, ['sloc', 'slop', 'pod_lines', 'stat']);
                reqs++;
                if (reqs == 2) cb(param);
            }
        });
        Ext.Ajax.request({
            url: '/api/source/' + [param.author, param.release, param.path].join("/"),
            success: function(res) {
                param.source = res.responseText;
                reqs++;
                if (reqs == 2) cb(param);
            }
        });

    },
    search: function(params, cb) {
        params.query = params.query.replace(/::/g, " ");
        var q = params.query.split(/ /);
        for (var i = 0; i < q.length; i++) {
            q[i] = {
                prefix: {
                    name: q[i]
                }
            };
        }
        q.push({
            term: {
                status: 'latest'
            }
        });
        Ext.Ajax.request({
            url: '/api/module/_search',
            jsonData: {
                query: {
                    match_all: {}
                },
                sort: ['name.raw'],
                filter: {
                    and: q
                },
                fields: ['name', 'release', 'author', 'file']
            },
            success: function(res) {
                var mods = Ext.decode(res.responseText);
                var hits = mods.hits.hits;
                var result = [];
                for (var i = 0; i < hits.length; i++) {
                    result.push(hits[i].fields);
                }
                cb(result);
            }
        });
    }
};
var Module;
Module = {
    list: function(){},
    get: function(module, cb){
        Ext.Ajax.request({
            url: '/api/module/' + module,
            success: function(res) {
                var obj = Ext.decode(res.responseText);
                cb(obj);
            }
        });
    },
    pod: function(module, cb) {
        Module.get(module, function(mod) {
            var reqs = 0;
            Ext.Ajax.request({
                url: '/api/file/' + mod.file_id,
                success: function(res) {
                    var file = Ext.decode(res.responseText);
                    Ext.copyTo(mod, file, ['toc']);
                    reqs++;
                    if(reqs == 2) cb(mod);
                }
            });
            Ext.Ajax.request({
                url: '/api/pod/' + mod.name,
                success: function(res) {
                    mod.html = res.responseText;
                    reqs++;
                    if(reqs == 2) cb(mod);
                }
            });
        });
    },
    code: function(module, cb) {
        Module.get(module, function(mod) {
            var reqs = 0;
            Ext.Ajax.request({
                url: '/api/file/' + mod.file_id,
                success: function(res) {
                    var file = Ext.decode(res.responseText);
                    Ext.copyTo(mod, file, ['sloc', 'slop', 'pod_lines', 'stat']);
                    //mod.source = res.responseText;
                    reqs++;
                    if(reqs == 2) cb(mod);
                }
            });
            Ext.Ajax.request({
                url: '/api/source/' + [mod.author, mod.release, mod.file].join("/"),
                success: function(res) {
                    mod.source = res.responseText;
                    reqs++;
                    if(reqs == 2) cb(mod);
                }
            });
        });
    },
    files: function(){},
    search: function(params, cb) {
        params.query = params.query.replace(/::/g, " ");
        var q = params.query.split(/ /);
        for(var i = 0; i < q.length; i++) {
            q[i] = { prefix: { name: q[i] } };
        }
        q.push({ term: { status: 'latest' } });
        Ext.Ajax.request({
            url: '/api/module/_search',
            jsonData: { query: { match_all: {} }, sort: ['name.raw'], filter: { and: q }, fields: ['name', 'release', 'author', 'file'] },
            success: function(res) {
                var mods = Ext.decode(res.responseText);
                var hits = mods.hits.hits;
                var result = [];
                for(var i = 0; i < hits.length; i++) {
                    result.push(hits[i].fields);
                }
                cb(result);
            }
        });
    }
};
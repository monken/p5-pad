var Release;
Release = {
    byAuthor: function(param, cb) {
            Ext.Ajax.request({
                url: '/api/release/_search',
                jsonData: {
                    size: param.limit || 50,
                    from: param.start || 0,
                    query: { match_all: {}},
                    filter: {
                            term: {
                                author: param.author,
                            }
                    },
                    sort: ['distribution', { 'version_numified': { reverse: true}}],
                    fields: ['name', 'version', 'abstract', 'date', 'distribution']
                },
                success: function(res) {
                    var deps = Ext.decode(res.responseText);
                    var hits = deps.hits.hits;
                    var result = [];
                    for (var i = 0; i < hits.length; i++) {
                        result.push(hits[i].fields);
                    }
                    cb({ data: result, total: deps.hits.total });
                }
            });
    },
    dependencies: function(param, cb) {
            Ext.Ajax.request({
                url: '/api/dependency/_search',
                jsonData: {
                    size: 1000,
                    query: { match_all: {}},
                    filter: {
                            term: {
                                author: param.author,
                                release: param.release
                            }
                    },
                    sort: ['module'],
                    fields: ['module', 'version']
                },
                success: function(res) {
                    var deps = Ext.decode(res.responseText);
                    var hits = deps.hits.hits;
                    var result = [];
                    for (var i = 0; i < hits.length; i++) {
                        result.push(hits[i].fields);
                    }
                    cb(result);
                }
            });
    },
    files: function(param, cb) {
        Ext.Ajax.request({
            url: '/api/file/_search',
            jsonData: {
                size: 1000,
                query: {
                    field: {
                        level: param.level
                    }
                },
                filter: {
                    and: [{
                        term: {
                            author: param.author,
                            release: param.release
                        }
                    },
                    {
                        prefix: {
                            path: param.prefix
                        }
                    }]
                },
                fields: ['module', 'path', 'level', 'name', 'directory']
            },
            success: function(res) {
                var files = Ext.decode(res.responseText);
                var hits = files.hits.hits;
                var result = [];
                for (var i = 0; i < hits.length; i++) {
                    var data = hits[i].fields;
                    result.push({
                        text: data.name,
                        module: data.module,
                        path: data.path,
                        level: data.level,
                        leaf: data.directory == "true" ? false : true
                    });
                }
                cb(result);
            }
        });
    },
};
var Release;
Release = {
    search: function(param, cb) {
        if(!param.query) return;
        Ext.Ajax.request({
            url: API.url + '/file/_search',
            jsonData: {
                size: param.limit || 50,
                from: param.start || 0,
                query: {
                    query_string: {
                        fields: ['pod', 'abstract^5'],
                        query: param.query,
                        default_operator: 'AND',
                        allow_leading_wildcard: false
                    }
                },
                filter: {
                    and: [
                    {
                        term: {
                            indexed: true
                        }
                    },
                    {
                        term: {
                            status: 'latest'
                        }
                    },
                    {
                        not: {
                            filter: {
                                missing: {
                                    field: "pod"
                                }
                            }
                        }
                }]},
                highlight : {
                        fields : {
                            module: {},
                            "abstract": {
                                "number_of_fragments": 0
                            },
                            pod : {
                                "number_of_fragments": 5,
                            }
                        },
                        order: 'score',
                        pre_tags : ["<b>"],
                        post_tags : ["</b>"],
                },
                //sort: ['module'],
                fields: param.fields
            },
            success: function(res) {
                var deps = Ext.decode(res.responseText);
                var hits = deps.hits.hits;
                var result = [];
                for (var i = 0; i < hits.length; i++) {
                    hits[i].fields.highlight = hits[i].highlight;
                    result.push(hits[i].fields);
                }
                cb({
                    data: result,
                    total: deps.hits.total
                });
            }
        });
    },
    documentation: function(param, cb) {
        Ext.Ajax.request({
            url: API.url + '/file/_search',
            jsonData: {
                size: param.limit || 50,
                from: param.start || 0,
                query: {
                    match_all: {}
                },
                filter: {
                    and: [{
                        term: {
                            release: param.release
                        }
                    },
                    {
                        term: {
                            author: param.author
                        }
                    },
                    {
                        term: {
                            indexed: true
                        }
                    },
                    {
                        not: {
                            filter: {
                                missing: {
                                    field: "pod"
                                }
                            }
                        }
                    }]
                },
                sort: ['module'],
                fields: ['module', 'name', 'path', 'id', 'release', 'author']
            },
            success: function(res) {
                var deps = Ext.decode(res.responseText);
                var hits = deps.hits.hits;
                var result = [];
                for (var i = 0; i < hits.length; i++) {
                    result.push(hits[i].fields);
                }
                cb({
                    data: result,
                    total: deps.hits.total
                });
            }
        });

    },
    recent: function(param, cb) {
        Ext.Ajax.request({
            url: API.url + '/release/_search',
            jsonData: {
                size: param.limit || 50,
                from: param.start || 0,
                query: {
                    match_all: {}
                },
                sort: [{
                    'date': {
                        reverse: true
                    }
                }],
                fields: ['name', 'version', 'abstract', 'date', 'distribution', 'download_url']
            },
            success: function(res) {
                var deps = Ext.decode(res.responseText);
                var hits = deps.hits.hits;
                var result = [];
                for (var i = 0; i < hits.length; i++) {
                    hits[i].fields.day = Date.parseDate(hits[i].fields.date, "c");
                    result.push(hits[i].fields);
                }
                cb({
                    data: result,
                    total: deps.hits.total
                });
            }
        });
    },
    byAuthor: function(param, cb) {
        Ext.Ajax.request({
            url: API.url + '/release/_search',
            jsonData: {
                size: param.limit || 50,
                from: param.start || 0,
                query: {
                    match_all: {}
                },
                filter: {
                    term: {
                        author: param.author,
                    }
                },
                sort: ['distribution', {
                    'version_numified': {
                        reverse: true
                    }
                }],
                fields: ['name', 'version', 'abstract', 'date', 'distribution']
            },
            success: function(res) {
                var deps = Ext.decode(res.responseText);
                var hits = deps.hits.hits;
                var result = [];
                for (var i = 0; i < hits.length; i++) {
                    result.push(hits[i].fields);
                }
                cb({
                    data: result,
                    total: deps.hits.total
                });
            }
        });
    },
    dependencies: function(param, cb) {
        Ext.Ajax.request({
            url: API.url + '/dependency/_search',
            jsonData: {
                size: 1000,
                query: {
                    match_all: {}
                },
                filter: {
                    and: [{
                        term: {
                            author: param.author,
                        }
                    },
                    {
                        term: {
                            release: param.release,
                        }
                    },
                    {
                        term: {
                            phase: 'runtime',
                        }
                    },
                    ]
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
            url: API.url + '/file/_search',
            jsonData: {
                size: 1000,
                query: {
                    match_all: {

                    }
                },
                filter: {
                    and: [{
                        term: {
                            level: param.level
                        }
                    },
                    {
                        term: {
                            author: param.author
                        }
                    },
                    {
                        term: {
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
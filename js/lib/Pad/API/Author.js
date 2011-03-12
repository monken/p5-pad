var Author;
Author = {
    details: function(params, cb, scope) {
        Ext.Ajax.request({
            url: API.url + '/author/' + params.id,
            success: function(res) {
                var result = Ext.decode(res.responseText);
                cb(result);
            }
        });
    },
    schwartz: function(params, cb, scope) {
        Ext.Ajax.request({
            url: API.url + '/release/_search',
            jsonData: {
                "query": {
                    "match_all": {}
                },
                "facets": {
                    "schwartz": {
                        "terms": {
                            "script_field": "_source.author + \"/\" + _source.distribution"
                        },
                        facet_filter: {
                            term: {
                                author: params.id
                            }
                        }
                    }
                }
            },
            success: function(res) {
                var result = Ext.decode(res.responseText);
                cb(result);
            }
        });
    },
    search: function(params, cb) {
        Ext.Ajax.request({
            url: API.url + '/author/_search',
            jsonData: {
                "size": 20,
                "fields": ['pauseid', 'name'],
                "query": {
                    "dis_max": {
                        "tie_breaker": 0.7,
                        "queries": [{
                            "field": {
                                "name": {
                                    "query": params.query + "*",
                                    "boost": 0.9
                                }
                            }
                        },
                        {
                            "prefix": {
                                "pauseid": params.query.toUpperCase()
                            }
                        }]
                    }
                }
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
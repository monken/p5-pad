var Author;
Author = {
    search: function(params, cb) {
        Ext.Ajax.request({
            url: API.url + '/author/_search',
            jsonData: {
                "size": 20,
                "fields": ['pauseid', 'name'],
                "query": {
                    "dis_max": {
                        "tie_breaker" : 0.7,
                        "queries": [{
                            "field": {
                                "name": {
                                    "query": params.query + "*",
                                    "boost": 0.9 }
                            }
                        },
                        {
                            "prefix": {
                                "pauseid":  params.query.toUpperCase()
                            }
                        }]
                    }
                }
            },
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
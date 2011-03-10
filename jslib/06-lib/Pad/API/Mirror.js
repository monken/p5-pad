var Mirror = {
    byLocation: function(param, cb) {
        if (!param.coords) {
            return Util.getLocation(function(pos) {
                Ext.apply(param, pos);
                Mirror.byLocation(param, cb);
            });
        }

        var orQuery = [];
        Ext.each(['http', 'ftp', 'rsync'], function(p) {
            if(!param[p]) return;
            orQuery.push({
                not: {
                    filter: {
                        missing: {
                            field: p
                        }
                    }
                }
            });
        });
        Ext.Ajax.request({
            url: API.url + '/mirror/_search',
            jsonData: {
                size: param.limit || 50,
                from: param.start || 0,
                query: {
                    match_all: {}
                },
                filter: {
                    or: orQuery
                },
                fields: param.fields,
                sort: {
                    _geo_distance: {
                        location: [param.coords.longitude, param.coords.latitude],
                        order: "asc",
                        unit: "km"
                    }
                }
            },
            success: function(res) {
                res = Ext.decode(res.responseText);
                var hits = res.hits.hits;
                var result = [];

                for (var i = 0; i < hits.length; i++) {
                    hits[i].fields.distance = hits[i].sort[0];
                    result.push(hits[i].fields);
                }
                cb({
                    data: result,
                    total: res.hits.total
                });
            }
        });
    }
};
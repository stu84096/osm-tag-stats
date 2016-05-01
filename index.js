#!/usr/bin/env node
'use strict';

var help = require('./util/help.js');
var tileReduce = require('tile-reduce');
var path = require('path');
var argv = require('minimist')(process.argv.slice(2));
var _ = require('underscore');
var cleanArguments = require('./util/cleanArguments')(argv);
var count = cleanArguments.count,
    geojson = cleanArguments.geojson,
    users = cleanArguments.users,
    dates = cleanArguments.dates,
    mbtilesPath = cleanArguments.mbtiles,
    tagFilter = cleanArguments.filter;
var OSMID = [];

if ((!geojson && !count) || !mbtilesPath || argv.help) {
    help();
}

tileReduce({
    zoom: 12,
    map: path.join(__dirname, 'map.js'),
    sources: [{name: 'osm', mbtiles: mbtilesPath}],
    mapOptions: {
        'count': count,
        'geojson': geojson,
        'dates': dates,
        'users': users,
        'tagFilter': tagFilter
    }
})
.on('reduce', function (id) {
    if (count) {
        OSMID = OSMID.concat(id);
    }
})
.on('end', function () {
    if (count) {
        var uniqueIDs = _.uniq(OSMID);
        console.log('Features total: %d', uniqueIDs.length);
    }
    if (geojson) {
        console.log('The filtered geojson has been written to %s', geojson);
    }
});

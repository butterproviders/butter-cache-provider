'use strict';

var Provider = require('butter-provider')
var PouchDB = require('pouchdb')
var ConfigDir = require('utils-configdir')
var inherits = require('util').inherits

var PouchDBProvider = function () {
    PouchDBProvider.super_.apply(this, arguments)

    this.pouch = new PouchDB(ConfigDir('butter-provider-' + config.name + '/cache/pouch'))
}

inherits(PouchDBProvider, Provider)

module.exports = PouchDBProvider


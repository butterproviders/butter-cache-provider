'use strict';

var Provider = require('butter-provider')

var ConfigDir = require('utils-configdir')
var fx = require('mkdir-recursive')
var PromiseUtils = require('./promises')

var inherits = require('util').inherits

function _make_cached_call (provider, cache, update) {
    return function () {
        var promises = [
            provider.apply(this, arguments),
            cache.apply(this, arguments)
        ]

        var firstSettled = PromiseUtils.firstSettled(promises)
        promises[0].then(data => update.apply(this, [data]))
        return firstSettled
    }
}

var CacheProvider = function () {
    CacheProvider.super_.apply(this, arguments)

    this.configDir = ConfigDir('Butter/cache/butter-provider-' + this.config.name)
    fx.mkdirSync(this.configDir)

    var oldFetch = this.fetch
    this.fetch = _make_cached_call.apply(this, [oldFetch,
                                                this.fetchFromDB, this.updateFetch])
    var oldDetail = this.detail
    this.detail = _make_cached_call.apply(this, [oldDetail,
                                                this.detailFromDB, this.updateDetail])
}

inherits(CacheProvider, Provider)

function UNIMPLEMENTED () = () => {
    console.error('UNIMPLEMENTED')
    return Promise.reject('UNIMPLEMENTED')
}

CacheProvider.prototype.fetchFromDB  = UNIMPLEMENTED
CacheProvider.prototype.updateFetch  = UNIMPLEMENTED
CacheProvider.prototype.detailFromDB = UNIMPLEMENTED
CacheProvider.prototype.updateDetail = UNIMPLEMENTED

module.exports = CacheProvider


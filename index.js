'use strict';

var Provider = require('butter-provider')

var ConfigDir = require('utils-configdir')
var fx = require('mkdir-recursive')
var PromiseUtils = require('./promises')

var inherits = require('util').inherits

function _make_cached_call (provider, cache, update) {
    return function () {
        var promises = [
            provider.apply(this, arguments)
                    .then(data => {
                        update.apply(this, [data])
                        return data
                    }),
            cache.apply(this, arguments)
        ]

        return PromiseUtils.firstSettled(promises)
    }
}

var CacheProvider = function () {
    CacheProvider.super_.apply(this, arguments)

    this.configDir = ConfigDir('Butter/cache/butter-provider-' + this.config.name)
    fx.mkdirSync(this.configDir)

    this._fetch_uncached = this.fetch
    this.fetch = _make_cached_call.apply(this, [this._fetch_uncached,
                                                this.fetchFromDB, this.updateFetch])
    this._detail_uncached = this.detail
    this.detail = _make_cached_call.apply(this, [this._detail_uncached,
                                                this.detailFromDB, this.updateDetail])
}

inherits(CacheProvider, Provider)

function UNIMPLEMENTED () {
    console.error('UNIMPLEMENTED')
    return Promise.reject('UNIMPLEMENTED')
}

CacheProvider.prototype.fetchFromDB  = UNIMPLEMENTED
CacheProvider.prototype.updateFetch  = UNIMPLEMENTED
CacheProvider.prototype.detailFromDB = UNIMPLEMENTED
CacheProvider.prototype.updateDetail = UNIMPLEMENTED

module.exports = CacheProvider


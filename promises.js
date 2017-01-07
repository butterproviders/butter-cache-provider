module.exports = {
    allSettled: function(promises) {
        var wrappedPromises = promises.map(
            p => Promise.resolve(p)
                        .then(val  => ({ ok: true,   value: val }),
                              err => ({ ok: false, reason: err })
                        ));
        return Promise.all(wrappedPromises);
    },
    firstSettled: function(promises) {
        return new Promise((resolve, reject) => {
            var wrappedPromises = promises.map(
                p => Promise.resolve(p)
                            .then(val  => {
                                resolve(val)
                                return  { ok: true,   value: val }
                            }, err => ({ ok: false, reason: err })))

            Promise.all(wrappedPromises).then(reject)
        })
    }
}

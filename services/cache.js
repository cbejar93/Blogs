const mongoose = require("mongoose");
const redis = require("redis");
const util = require("util");

const redisURL = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisURL);
client.hget = util.promisify(client.hget);
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function(options = {}) {
    this.useCache = true;
    this.hashkey = JSON.stringify(options.key || "");
    return this;
}
mongoose.Query.prototype.exec = async function() {
    console.log("i am about to run a query");

    if (this.useCache === false){
        return exec.apply(this, arguments)
    }

    // console.log(this.getQuery());
    // console.log(this.mongooseCollection.name);
   const key=  JSON.stringify(Object.assign({},this.getQuery(),{collection: this.mongooseCollection.name}));
//    console.log(key);

// See if we have a value for key in redis: issue that
const cacheValue = await client.hget(this.hashkey, key);

if (cacheValue) {
    const doc = JSON.parse(cacheValue)
    return Array.isArray(doc) 
    ? doc.map(d=> new this.model(d)) 
    : new this.model(doc);
}

// Otherwise issue the query and store the result in redis

    const result = await exec.apply(this, arguments);
    // console.log(result);

    client.hset(this.hashkey, key, JSON.stringify(result));
    return result

}

module.exports = {
    clearHash(hashkey){
        client.del(JSON.stringify(hashkey));
    }
}
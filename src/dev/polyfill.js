if (!Array.prototype.filter){
    Array.prototype.filter = function(fun/*, thisArg*/) {
        if (this === void 0 || this === null) throw new TypeError();
        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun !== 'function') throw new TypeError();
        var res = [];
        var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
        for (var i = 0; i < len; i++) 
            i in t && fun.call(thisArg, t[i], i, t) && res.push(t[i]);
        return res;
    }
    Logger.Log("Created polyfill for Array.prototype.filter", "Avaritia DEBUG");
}
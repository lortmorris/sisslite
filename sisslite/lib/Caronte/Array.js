Array.prototype.inArray= function(i){
    var _this = this;
    for(var x=0; x<_this.length; x++){
        if(_this[x]==i) return x;
    }
    return -1;
}



Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};
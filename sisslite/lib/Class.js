
module.exports = function(body){

    var reserveWords  = ['extend', 'final'];

    if(Object.prototype.toString.call( body ) !== "[object Object]"){
        console.log('new Class require object');
        return null;
    }

    var f = function(){ };

    if('construct' in body && Object.prototype.toString.call( body.construct) === "[object Function]"){ f=body.construct; }

    var keys = Object.keys(body);

    for(var x=0; x<keys.length; x++){
        if(reserveWords.indexOf(keys[x])===-1) f.prototype[keys[x]] = body[keys[x]];
        else{ console.log('Reserved word ', keys[x]);}
    }

    f.prototype.final = function(){ Object.freeze(this); return this; };

    f.implement = function(objects){
        var union = function(obj){
            var type = Object.prototype.toString.call( obj );

            if( type === "[object Function]" || type === "[object Object]"){
                var keys = Object.keys(obj);
                for(var x=0; x<keys.length; x++){
                    if(keys[x]!="construct") f.prototype[keys[x]] = obj[keys[x]];
                }//end for
            }//end if
        };

        for(var x=0; x<arguments.length; x++)  {
            union(arguments[x]);
        }//end for


        if(typeof  objects.construct!="undefined"){
            f.prototype.construct();
        }//autorun object
        return this;
    };

    return f;

};




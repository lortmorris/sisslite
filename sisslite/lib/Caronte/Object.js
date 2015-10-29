/**
 @autor César Casas
 @version 0.0.2

 */

module.exports = {
    isArray: function(o){ return Object.prototype.toString.call( o ) == "[object Array]" ? true: false; }
    ,isObject: function(o){ return Object.prototype.toString.call( o ) == "[object Object]" ? true: false; }
    ,isFunction: function(o){ return Object.prototype.toString.call( o ) == "[object Function]" ? true: false; }
    ,isString: function(o){ return Object.prototype.toString.call( o ) == "[object String]" ? true: false; }

    ,findKey: function(obj, key){
        var found = false;
        var _findKey = function(obj, key){
            for(var o in obj){
                if(o == key) { found = obj[o]; }
                else if(SISSCore.Caronte.Object.isObject( obj[o]))  _findKey(obj[o], key);
            }//end for
            return found;
        };

        return _findKey(obj, key);
    }//end findKey



    ,union: function(target, source){
        for(var o in source){
            target[o] = source[o];
        }//end for
        return target;
    }//end UNION


    ,$transformToTable: function(obj){
        matrix = [];

        var _do2 = function(obj, stack){
            for (var property in obj) {
                if (SISSCore.Caronte.Object.isObject(obj[property])) {
                    _do2(obj[property], stack + property);
                } else {
                    stack = stack.replace("//", "/");
                    if(stack=='/') var segments = ['/'];
                    else{
                        var segments = stack.split('/');
                        if(segments[0]=="") segments = segments.slice(1);
                    }//end else

                    segments.push(property);
                    segments.push(obj[property]);
                    matrix.push(segments);
                }//end else

            }//end for
        };
        _do2(obj, '');
        return matrix;
    }//end method $near

    ,clone: function(obj){
        if(!SISSCore.Caronte.Object.isObject(obj)) return obj;

        var clone  = {};
        var _do  = function(obj, clone){
            for(var i in obj){
                if(SISSCore.Caronte.Object.isObject(obj[i])) {
                    clone[i] = {};
                    _do(obj[i], clone[i]);
                }//end if
                else{
                    clone[i] = obj[i];
                }//end else
            }//end for
        }//end _do

        _do(obj, clone);

        return clone;

    }
    /**
     * @author Cesar Casas
     * @description Balance a object input with m argument. After, run cb pass a object balanced.
     * @param input object
     * @param map object (balance)
     * @param cb callback (i balanced)
     */
    ,$balance: function(i, m, cb){

        var balance = function(sm, si){
            for(var k in sm){
                if(SISSCore.Caronte.Object.isObject( sm[k] ) ) {
                    if(typeof si[k] ==  "undefined") si[k] = {};
                    balance(sm[k], si[k]);
                }
                else{
                    if(typeof si[k] == "undefined") si[k] = sm[k];
                    else{

                    }//else !undefined
                }//else !object
            }//end for
        };//end balance

        balance(m, i);

        cb(i);
    }

};//end Object
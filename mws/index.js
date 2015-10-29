module.exports = new SISSCore.Class({
    'construct': function(){

    }

    ,'about': function(req, res, next){
        res.json({version: "1.0"});
    }
}).implement(require(__droot__+"/myapp/mws"));
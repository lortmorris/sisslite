module.exports = function(){
    return SISSCore.Caronte.Object.union({
        '/': {
            get: ['about']
        }
        ,'about': {
            get: ['about']
        }
    }, require(__droot__+"/myapp/routes")());
};
// const warpasync=function(fn)
// {
//     return function(req,res,next){
//         fn(req,res,next).catch(next);
//     }
// }
// module.exports=warpasync;
// ✅ CORRECTED version
const wrapAsync = function(fn) {
    return function(req, res, next) {
        // Use Promise.resolve to ensure we always have a promise
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

module.exports = wrapAsync;
module.exports = (allowedRoles) =>{
    return (req,res ,next) =>{
        const role = req.headers['x-role'];
        if(!role){
            return res.json(401).json({error:'Role header (x-role) required'})
        }

        if(!allowedRoles.includes(role)){
            return res.status(403).json({error:'Acess denied'})
        }

        next();
    }
}
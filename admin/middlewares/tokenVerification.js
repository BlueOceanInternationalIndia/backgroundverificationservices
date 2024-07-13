import jwt from 'jsonwebtoken';

const rTa_Validate = (req, res, next) => {
    // console.log('Validating Token');
    const token = req.body.token && req.body.token.split(' ')[1];
    
    //Validating Token Data
    if(token == null || token == 'null' || token == '') {
        console.log("No token in header, Invalid Request");
        req.valid = false;
        req.message = 'No Token In Header'
        next()
    }

    //Verifying The Token
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, tokenObj) => {
        if(err) {
            console.log('Token Verification Failed. Error:', err);
            req.valid = false;
            req.message = 'Invalid Token'
        } else {
            // console.log('TOKEN OBJ->', tokenObj);
            req.valid = true;
            req.token = token;
            req.user = tokenObj;
            req.message = 'Token Valid'
        }
    });
    next();
}

export default rTa_Validate
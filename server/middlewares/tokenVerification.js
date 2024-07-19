import 'dotenv/config';
import axios from 'axios'

const aTr_Validate = async (req, res, next) => {
    const session = { token: `Bearer ${req.body.token}` }
    const resp = await axios.post(`${process.env.AUTH_SERVER_URI}/candidate/tokens/access/valid`, session).then((resp) => resp.data.valid ).catch((err) => console.log('Auth Server Connection Failed. Error:', err.message));
    
    if(!resp) {
        req.valid = resp
        const {uid} = req.params;
        console.log(`Invalid Access Token By ${uid}`);
        return res.status(401).json({ message: 'Invalid Request' });
    }

    next();
}

export default aTr_Validate
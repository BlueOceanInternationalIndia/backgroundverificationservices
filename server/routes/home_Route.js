import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
    return res.status(200).send('Data Server of Blueocean International India')
})

export default router;
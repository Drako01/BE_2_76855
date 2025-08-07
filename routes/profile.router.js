import { Router } from "express";
import { requireLogin } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', requireLogin, (req, res) => {
    const { first_name, last_name, email, age } = req.session.user;
    res.status(200).json({ user: { first_name, last_name, email, age } })
})

export default router;
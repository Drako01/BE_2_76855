import { Router } from "express";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { requiereJwtCookie } from "../middleware/auth.middleware.js";
import { User } from '../config/models/user.model.js';


const router = Router();

/** Registro Local (hash con bycrypt) */
router.post("/register", async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    if (!first_name || !last_name || !email || !age || !password) {
        return res.status(400).json({ error: "Todos los datos son requeridos" });
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email ya registrado" });

    const hash = await bcrypt.hash(password, 10);
    await User.create({ first_name, last_name, email, age, password: hash });

    res.status(201).json({ message: "Usuario registrado" });
});

router.post('/jwt/login', async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password) return res.status(400).json({error: 'Faltan credenciales / Credenciales invalidas'});
    const user = await User.findOne({email});
    if(!user) return res.status(401).json({error: 'Credenciales Invalidas'});
    const ok = await bcrypt.compare(password, user.password);
    if(!ok) return res.status(401).json({error: 'Password Incorrecto'});

    const payload = { sub: String(user._id), email: user.email, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1h'});


    // Cookie httpOnly
    res.cookie('access_token', token, {
        httpOnly: true,
        sameSite: 'lax', // podemos cambiarlo a 'strict' en Produccion
        secure: false, // en produccion usamos https -> 'true'
        maxAge: 60 * 60 * 1000,
        path: '/'
    });

    res.json({message: 'Login exitoso (JWT en Cookie)'});
});

router.get('/jwt/me', requiereJwtCookie, async (req, res) => {
    const user = await User.findById(req.user._id).lean();
    if(!user) return res.status(404).json({error: 'Usuario no encontrado'});
    const {first_name, last_name, email, age, role} = user;
    res.json({first_name, last_name, email, age, role});
});

router.post('/jwt/logout', (req, res) => {
    res.clearCookie('access_token', {path: '/'});
    res.json({message: 'Logout Ok'})
});

export default router;
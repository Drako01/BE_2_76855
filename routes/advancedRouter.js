import CustomRouter from "./_customRouter.js";
import { requiereJwtCookie } from '../middleware/auth.middleware.js';
import { policies } from "../middleware/policies.middleware.js";
import { Student } from '../config/models/student.model.js';

const router = new CustomRouter({ mergeParams: true });

// Params loader (carga previa del :id)
router.params('id', async (req, res, next, id) => {
    try {
        const s = await Student.findById(id).lean();
        req.studentLoader = s || null;
    } catch (_) {
        req.studentLoader = null;
    }
    next();
});

// Ruta con middleware en cadena (orden claro): auth -> politica de roles -> handler
router.get('/students/:id', requiereJwtCookie, policies('admin', 'user'), (req,res) =>{
    if (!req.studentLoader) return res.status(404).json({error: "Estudiante no encontrado (pre-cargado)"})
    res.status(200).json({ loadedByParam: true, student: req.studentLoader});
})

// Enrutador Ping
router.group('/v1', (v1) => {
    v1.get('/ping', (req, res) => res.json({ok: true, version: 'v1'}));
})

// Subrouter anidado con mergeParams: /students/:id/courses/*
router.group('/students/:id', (sub) => {
    sub.get('/courses', requiereJwtCookie, (req, res) => {
        res.json({
            studentId: req.params.id,
            note: "Ejemplo de subrouter con mergeParams",
            courses: ['JS Avanzado', 'DB Basico']
        });
    });
});

// Router async con error capturado automaticamente por CustomRouter
router.get('/boom', async (req, res) => {
    throw new Error('Explosion controlada para demo de manejo de errores async');
});

export default router.router;

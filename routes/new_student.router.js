import { Router } from "express";
import { requiereJwtCookie, requireRole } from '../middleware/auth.middleware.js';
import { studentController as ctrl } from '../app/controllers/student.controller.js';

const router = Router();
router.use(requiereJwtCookie);

router.get('/', ctrl.list);
router.get('/:id', ctrl.get);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

export default router;
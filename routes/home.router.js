import { Router } from "express";
const router = Router();

router.get('/', (req, res) => {
    res.status(200).json({ message: "Hola a Todos desde el backend" })
})

export default router;
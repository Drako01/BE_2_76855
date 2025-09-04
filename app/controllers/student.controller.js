import mongoose from "mongoose";
import { StudentService } from '../services/student.service.js';
import { toCreateStudentDTO, toUpdateStudentDTO } from "../dtos/student.dto.js";

const svc = new StudentService();

export const studentController = {
    list: async (_req, res, next) => {
        try { res.json(await svc.list()) } catch (e) { next(e); }
    },
    get: async (req, res, next) => {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: "Id Invalido" })
            const doc = await svc.getById(id);
            return doc ? res.json(doc) : res.status(404).json({ error: "No se encontro" })
        } catch (e) { next(e); }
    },
    create: async (req, res, next) => {
        try {
            const dto = toCreateStudentDTO(req.body);
            const created = await svc.create(dto);
            res.status(201).json({ student: created });
        } catch (e) { next(e); }
    },
    update: async (req, res, next) => {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: "Id Invalido" })
            const dto = toUpdateStudentDTO(req.body);
            const out = await svc.update(id, dto);
            return out ? res.json(out) : res.status(404).json({ error: "No se encontro" })
        } catch (e) { next(e); }
    },
    remove: async (req, res, next) => {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: "Id Invalido" })
            const ok = await svc.delete(id);
            return ok ? res.status(204).end() : res.status(404).json({ error: "No se encontro" })
        } catch (e) { next(e); }
    }
}

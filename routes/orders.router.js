import { Router } from "express";
import { orderController } from "../app/controllers/orders.controller.js";

const router = Router();

// Vista SSR
router.get("/orders", (req, res) => orderController.listView(req, res));

// API REST
router.get("/api/orders", (req, res) => orderController.listJSON(req, res));
router.get("/api/orders/:id", (req, res) => orderController.getById(req, res));
router.post("/api/orders", (req, res) => orderController.create(req, res));
router.patch("/api/orders/:id", (req, res) => orderController.update(req, res));
router.delete("/api/orders/:id", (req, res) => orderController.remove(req, res));

// Semilla básica
router.post("/api/orders/seed", (req, res) => orderController.seed(req, res));

export default router;

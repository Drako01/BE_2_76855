import { orderService } from "../services/order.service.js";

class OrderController {
    // Vista SSR con Handlebars
    async listView(req, res) {
        try {
            const page = Number(req.query.page || 1);
            const limit = Number(req.query.limit || 10);
            const status = req.query.status;
            const data = await orderService.list({ page, limit, status });
            res.status(200).render("orders/index", {
                title: "Órdenes",
                orders: data.items,
                pagination: { page: data.page, pages: data.pages, total: data.total, limit: data.limit },
                currentStatus: status || "all",
            });
        } catch (err) {
            console.error("[OrderController.listView]", err);
            res.status(500).send("Error cargando las órdenes");
        }
    }

    // API JSON
    async listJSON(req, res) {
        try {
            const page = Number(req.query.page || 1);
            const limit = Number(req.query.limit || 10);
            const status = req.query.status;
            const data = await orderService.list({ page, limit, status });
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async getById(req, res) {
        try {
            const o = await orderService.get(req.params.id);
            if (!o) return res.status(404).json({ error: "Orden no encontrada" });
            res.status(200).json(o);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async create(req, res) {
        try {
            const o = await orderService.create(req.body);
            res.status(201).json(o);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async update(req, res) {
        try {
            const o = await orderService.update(req.params.id, req.body);
            if (!o) return res.status(404).json({ error: "Orden no encontrada" });
            res.status(200).json(o);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async remove(req, res) {
        try {
            const o = await orderService.remove(req.params.id);
            if (!o) return res.status(404).json({ error: "Orden no encontrada" });
            res.status(204).json();
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Semilla rápida (opcional)
    async seed(req, res) {
        try {
            const count = await orderService.dao.count();
            if (count > 0) return res.status(200).json({ message: "Ya hay órdenes, no se insertó semilla." });
            const sample = [
                {
                    code: "A-1001", buyerName: "Juan Pérez", buyerEmail: "juan@example.com",
                    items: [
                        { title: "Teclado", qty: 1, unitPrice: 15000 },
                        { title: "Mouse", qty: 2, unitPrice: 8000 },
                    ], status: "pending"
                },
                {
                    code: "A-1002", buyerName: "Ana García", buyerEmail: "ana@example.com",
                    items: [
                        { title: "Monitor 24", qty: 1, unitPrice: 120000 },
                    ], status: "paid"
                }
            ];
            const created = await Promise.all(sample.map(s => orderService.create(s)));
            res.status(201).json({ inserted: created.length });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

export const orderController = new OrderController();

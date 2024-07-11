import { Router } from "express";
import userController from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
const router = Router();

router.post("/login", async (req, res) => {
    try {
        const data = await userController.login(req.body);
        if (data && !data.error) {
            return res.json(data);
        }
        if (data && data.error) {
            return res.status(data.status).json({ error: data.error });
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: e });
    }
});
router.get("/user", isAuthenticated, async (req, res) => {
    try {
        const user = await userController.getUserByUsername(req.user.username);
        if (user) {
            return res.json(user);
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: e });
    }
})
router.post("/register", async (req, res) => {
    try {
        const data = await userController.register(req.body);
        if (data && !data.error) {
            return res.json(data);
        }
        if (data && data.error) {
            return res.status(data.status).json({ error: data.error });
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: e });
    }
});
router.get("/blocks", isAuthenticated,async (req, res) => {
    try {
        const blocks = await userController.getBlocks(req.user.username);
        if (blocks) {
            return res.json(blocks);
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: e });
    }
})

router.put("/blocks", isAuthenticated,async (req, res) => {
    try {

        const blocks = await userController.updateBlocks(req.user.username, req.body);
        if (blocks) {
            return res.json(blocks);
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: e });
    }
})

export default router
import { Router } from "express";
import { getPublicEnv } from "../config/env.config.js";

const router = Router();

router.get('/info', (req, res) => {
    res.json({
        pid: process.pid,
        node: process.version,
        platform: process.platform,
        cwd: process.cwd(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        argv: process.argv,
        env: getPublicEnv()
    });
});

router.get('/env', (req, res) => {
    res.json(getPublicEnv());
});

export default router;
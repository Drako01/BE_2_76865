import { Router } from "express";
import { requireJwtCookie } from "../middleware/auth.middleware.js";

const router = Router();

// router.use(requireJwtCookie);

router.get('/', (req, res) => {
    res.status(200).json({message: "Hola a todos desde BackEnd 2"})
})

export default router;
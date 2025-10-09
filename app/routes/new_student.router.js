import { Router } from "express";
import { requireJwtCookie } from "../middleware/auth.middleware.js";
import { policies } from '../middleware/policies.middleware.js';
import { studentController as ctrl } from '../controllers/student.controller.js';

const router = Router();

router.use(requireJwtCookie);

router.get('/', ctrl.list);
router.get('/:id', policies('admin', 'user'), ctrl.get);
router.post('/', policies('admin'), ctrl.create);
router.put('/:id', policies('admin'), ctrl.update);
router.delete('/:id', policies('admin'), ctrl.remove);

export default router;

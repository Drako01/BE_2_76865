import { Router } from "express";
import homeRouter from './home.router.js';
import studentRouter from './student.router.js';
import authRouter from './auth.router.js';


const router = Router({mergeParams: true});

router.use('/', homeRouter);
router.use('/auth', authRouter);
router.use('/student', studentRouter);

export default router;



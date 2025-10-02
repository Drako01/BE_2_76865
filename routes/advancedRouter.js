import CustomRouter from "./_customRouter.js";
import { requireJwtCookie } from '../middleware/auth.middlewar.js';
import { policies } from '../middleware/policies.middleware.js';
import { Student } from '../config/models/student.model.js';

const router = new CustomRouter({mergeParams: true});

// Params loader (carga previa de :id)
router.params('id', async (req, res, next, id) => {
    try{
        const s = await Student.findById(id).lean();
        req.studentLoader = s || null;
    }catch(_) {
        req.studentLoader = null;
    }
    next();
})

// Ruta con middleware en cadena (odern claro): auth -> politica de roles -> handler
router.get('/students/:id', requireJwtCookie, policies('admin', 'user'), (req, res) =>{
    if(!req.studentLoader) return res.status(404).json({error: "Estudiante no encontrado (pre-cargado)"});
    res.status(200).json({loadedByParams: true, student: req. studentLoader});
})

// Enrutador Ping
router.group('/v1', (v1) => {
    v1.get('/ping', (req,res) => res.json({ok: true, version: 'v1'}))
})

// Subrouter anidado con MergeParams: /students/:id/courses/*
router.group('/students/:id', (sub) => {
    sub.get('/courses', requireJwtCookie, (req, res) => {
        res.json({
            studentId: req.params.id,
            note: "Ejemplo de subrouter con Mergeparams",
            courses: ["JS Avanzado", "DB Basico"]
        });
    });
});

// Router async con error capturado automaticamente por customRouter
router.get('/boom', async (req,res) => {
    throw new Error("Explocion controlada para demo de manejo de errores async");
});

export default router.router;

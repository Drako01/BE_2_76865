import { Router } from "express";

export default class CustomRouter {
    constructor({mergeParams = true, base = ''} = {}){
        this.base = base;
        this.router = Router({mergeParams});

        this.params = this.router.param.bind(this.router);
    }

    _wrap(fn) {
        if (typeof fn != 'function') return fn;
        return function wrapped(req,res,next) {
            try{
                const r = fn(req, res, next);
                if(r && typeof r.then === 'function') r.catch(next);
            }catch(e){
                next(e)
            }
        }
    }

    use(...args) { this.router.use(...args);}

    get(path, ...handlers) { this.router.get(path, ...handlers.map(h => this._wrap(h)));}
    post(path, ...handlers) { this.router.post(path, ...handlers.map(h => this._wrap(h)));}
    put(path, ...handlers) { this.router.put(path, ...handlers.map(h => this._wrap(h)));}
    delete(path, ...handlers) { this.router.delete(path, ...handlers.map(h => this._wrap(h)));}

    // Helper para asegurar rutas con prefijo (subrouter)
    group(prefix, buildfn){
        const sub = new CustomRouter();
        buildfn(sub);
        this.router.use(prefix, sub.router);
    }
}
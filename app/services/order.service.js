import { OrderMongoDAO } from '../dao/order.mongo.dao.js';

export class OrderService {
    constructor(dao = new OrderMongoDAO() ) { this.dao = dao;}

    async list(params) { return await this.dao.listPaginated(params); }
    async get(id) { return await this.dao.getById(id); }
    async getByCode(code) { return await this.dao.getByCode(code); }
    async create(data) { return await this.dao.create(data);}
    async update(id, data) { return await this.dao.updateById(id, data); }
    async remove(id) { return await this.dao.deleteById(id); }
}

export const orderService = new OrderService();

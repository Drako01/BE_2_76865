import { BaseDAO } from "./base.dao.js";
import { Order } from '../models/order.model.js';

export class OrderMongoDAO extends BaseDAO {
    constructor() { super(Order) }

    async getByCode(code) {
        return await this.model.findOne({code}).lean();
    }

    async listPaginated({ page = 1, limit = 10, status } = {}) {
        const filter = {};
        if (status) filter.status = status;
        const skip = ( page - 1 ) * limit;
        const [items, total] = await Promise.all([
            this.model.find(filter).sort({ createrAt: -1 }).skip(skip).limit(limit).lean(),
            this.model.countDocuments(filter)
        ]);
        return { items, page, limit, total, pages: Math.ceil(total / limit) };
    }
}

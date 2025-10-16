export class BaseDAO {
    constructor(model) { this.model = model; }

    async create(data) { return await this.model.create(data); }
    async getById(id) { return await this.model.findById(id).lean(); }
    async getOne(filter = {}) { return await this.model.findOne(filter).lean(); }
    async getAll(filter = {}, options = {}) {
        const q = this.model.find(filter);
        if (options.sort) q.sort(options.sort);
        if (options.limit) q.limit(options.limit);
        if (options.skip) q.skip(options.skip);
        if (options.select) q.select(options.select);
        return await q.lean();
    }
    async updateById(id, data) {
        return await this.model.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
    }
    async deleteById(id) { return await this.model.findByIdAndDelete(id).lean(); }
    async count(filter = {}) { return await this.model.countDocuments(filter); }
}
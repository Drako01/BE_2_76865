import { Student } from '../models/student.model.js';

export class StudentService {
    async list() { return Student.find() }
    async getById(id) { return Student.findById(id) }
    async create(dto) { return Student.create(dto) }
    async update(id, dto) { return Student.findByIdAndUpdate(id, dto, {new: true}) }
    async delete(id) { return !!( await Student.findByIdAndDelete(id))}
}

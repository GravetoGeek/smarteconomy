import Profession from "../models/Profession";
import connection from "./connection";

export const profession_create = async (profession: Profession) => {
    const result = await connection('professions').insert(profession)
    return result
}

export const profession_read = async (id: number) => {
    const result = await connection('professions').where({ id })
    return result
}

export const profession_list = async () => {
    const result = await connection('professions').select()
    return result
}

export const profession_update = async (id: number, profession: Profession) => {
    const result = await connection('professions').where({ id }).update(profession)
    return result
}

export const profession_delete = async (id: number) => {
    const result = await connection('professions').where({ id }).del()
    return result
}

export const profession_byCbo = async (cbo: string) => {
    const result = await connection('professions').where({ cbo })
    return result
}

export const profession_byTitle = async (title: string) => {
    const result = await connection('professions').where({ title })
    return result
}

export const profession_byType = async (type: string) => {
    const result = await connection('professions').where({ type })
    return result
}

export const profession_search = async (title: string) => {
    const result = await connection('professions').where('title', 'like', `${title}%`)
    return result
}
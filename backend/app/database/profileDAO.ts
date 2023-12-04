import Profile from '../models/Profile'
import connection from './connection'

export const profileDAO_create = async (profile: Profile) => {
    const result = await connection('profiles').insert(profile)
    return result
}

export const profileDAO_read = async (id: number) => {
    const result = await connection('profiles').where({ id })
    return result
}
export const profileDAO_byUser = async (user_id: number) => {
    const result = await connection('profiles').where({ user_id })
    return result
}

export const profileDAO_list = async () => {
    const result = await connection('profiles').select()
    return result
}

export const profileDAO_update = async (id: number, profile: Profile) => {
    const result = await connection('profiles').where({ id }).update(profile)
    return result
}

export const profileDAO_delete = async (id: number) => {
    const result = await connection('profiles').where({ id }).del()
    return result
}

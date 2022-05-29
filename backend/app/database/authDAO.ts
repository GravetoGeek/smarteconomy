import connection from '../database/connection';

export const loginDAO = async(email:string) => {
    const user = await connection('users').where({email})
    return user
}

import connection from "./connection";

export const dashboard_mediaSalarial_intervaloIdade = async (idade_min:number, idade_max:number) => {
    const result = await connection('profiles')
    .avg('monthly_income as avg_monthly_income')
    .whereRaw(`timestampdiff(year,birthday,now()) between ${idade_min} and ${idade_max}`)
    return result
}

export const dashboard_mediasalarial_profissao = async (profissao:string) => {
    const result = await connection('profiles')
    .avg('monthly_income as avg_monthly_income')
    .where({profession:profissao})
    return result
}

export const dashboard_mediasalarial_genero = async (genero:string) => {
    const result = await connection('profiles')
    .avg('monthly_income as avg_monthly_income')
    .where('gender_id',genero)
    return result
}


export const dashboard_mediasalarial_idadeProfissao = async (idade_min:number, idade_max:number, profissao:string) => {
    const result = await connection('profiles')
    .avg('monthly_income as avg_monthly_income')
    .where({profession:profissao})
    .whereRaw(`timestampdiff(year,birthday,now()) between ${idade_min} and ${idade_max}`)
    return result
}

export const dashboard_mediasalarial_idadeGenero = async (idade_min:number, idade_max:number, genero:string) => {
    const result = await connection('profiles')
    .avg('monthly_income as avg_monthly_income')
    .where({gender_id:genero})
    .whereRaw(`timestampdiff(year,birthday,now()) between ${idade_min} and ${idade_max}`)
    return result
}

export const dashboard_mediasalarial_generoProfissao = async (genero:string, profissao:string) => {
    const result = await connection('profiles')
    .avg('monthly_income as avg_monthly_income')
    .where({profession:profissao})
    .where({gender_id:genero})
    return result
}

export const dashboard_mediasalarial_idadeGeneroProfissao = async (idade_min:number, idade_max:number, genero:string, profissao:string) => {
    const result = await connection('profiles')
    .avg('monthly_income as avg_monthly_income')
    .where({profession:profissao})
    .where({gender_id:genero})
    .whereRaw(`timestampdiff(year,birthday,now()) between ${idade_min} and ${idade_max}`)
    return result
}



export const dashboard_despesasPorCategorias = async (profileId:number,startDate:string,endDate:string) => {
    const result = await connection('transactions')
    .select('amount','categories.category')
    .sum('amount as amount')
    .join('categories','categories.id','transactions.category_id')
    .join('accounts','accounts.id','transactions.account_id')
    .where('profile_id',profileId)
    .modify((queryBuilder:any)=>{
        if (startDate && endDate) {
            queryBuilder.whereBetween('transactions.date',[startDate,endDate])
        }
    }) 
    .groupBy('category_id')
    .orderBy('amount','desc')
    return result

}


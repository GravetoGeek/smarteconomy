import {Request, Response} from 'express';
import * as dashboardDAO from "../database/dashboardDAO";
import * as transactionDAO from "../database/transactionDAO";
import Transaction from "../models/Transaction";

export const dashboard_mediasalarial_filter = async (req:Request, res:Response) => {
    try{
        let {idade_min,idade_max, genero, profissao} = req.body;
        let result:Object[]=[];

        if(idade_min === undefined && idade_max !== undefined) throw {statusCode: 400, message: 'Informe a idade mínima'};
        if(idade_min !== undefined && idade_max === undefined) throw {statusCode: 400, message: 'Informe a idade máxima'};
        if(idade_min == undefined && idade_max === undefined && genero === undefined && profissao === undefined) throw {statusCode: 400, message: `Informe pelo menos um filtro: 'genero', 'profissao', 'idade_min' e 'idade_max'`};
        if(idade_min !== undefined && idade_max !== undefined && idade_min > idade_max) throw {statusCode: 400, message: 'A idade mínima deve ser menor ou igual a idade máxima'};
        if(genero !== undefined && genero !== 1 && genero !== 2 && genero !== 3) throw {statusCode: 400, message: 'O gênero deve ser 1 para masculino, 2 para feminino ou 3 para genero fluído.'};


        if(idade_min !== undefined && idade_max !== undefined && genero === undefined && profissao === undefined){
            result = await dashboardDAO.dashboard_mediaSalarial_intervaloIdade(idade_min, idade_max);
        }

        if(idade_min === undefined && idade_max === undefined && genero !== undefined && profissao === undefined){
            result = await dashboardDAO.dashboard_mediasalarial_genero(genero);
        }

        if(idade_min === undefined && idade_max === undefined && genero === undefined && profissao !== undefined){
            result = await dashboardDAO.dashboard_mediasalarial_profissao(profissao);
        }

        if(idade_min !== undefined && idade_max !== undefined && genero !== undefined && profissao === undefined){
            result = await dashboardDAO.dashboard_mediasalarial_idadeGenero(idade_min, idade_max, genero);
        }

        if(idade_min !== undefined && idade_max !== undefined && genero === undefined && profissao !== undefined){
            result = await dashboardDAO.dashboard_mediasalarial_idadeProfissao(idade_min, idade_max, profissao);
        }

        if(idade_min === undefined && idade_max === undefined && genero !== undefined && profissao !== undefined){
            result = await dashboardDAO.dashboard_mediasalarial_generoProfissao(genero, profissao);
        }

        if(idade_min !== undefined && idade_max !== undefined && genero !== undefined && profissao !== undefined){
            result = await dashboardDAO.dashboard_mediasalarial_idadeGeneroProfissao(idade_min, idade_max, genero, profissao);
        }
        console.log(result[0]);
        return res.status(200).json(result[0])

    }
    catch(error:any){
        console.log(error);
        return res.status(error.statusCode || 500).json({message: error.message || 'Erro no servidor'});
    }
}

export const dashboard_despesasPorCategorias = async (req:Request, res:Response) => {
    try{
        let {profileId,startDate,endDate} = req.body;
        let result:Object[]=[];

        if(profileId === undefined) throw {statusCode: 400, message: 'Informe o profileId'};
        
        result = await dashboardDAO.dashboard_despesasPorCategorias(profileId, startDate, endDate);


        return res.status(200).json(result)
    }
    catch(error:any){
        return res.status(error.statusCode || 500).json({message: error.message || 'Erro no servidor'});
    }
}
        
// Path: backend\app\utils\sendEmail.ts
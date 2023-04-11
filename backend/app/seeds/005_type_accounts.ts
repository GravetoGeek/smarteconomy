import { Knex } from "knex";
import { faker } from "@faker-js/faker";
import Category from "../models/Category";
import Account from "../models/Account";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("account_types").del();
    const account_types = {
        1: {
            type: "Conta Corrente",
            description:
                "Uma conta bancária comum usada para transações diárias, como depósitos, saques, pagamentos de contas e transferências.",
        },
        2: {
            type: "Conta Poupança",
            description:
                "Uma conta destinada à economia e ao acúmulo de fundos, que geralmente rende juros com base no saldo depositado.",
        },
        3: {
            type: "Conta Salário",
            description:
                "Uma conta específica para o recebimento de salários, aposentadorias, pensões e outros proventos de trabalho.",
        },
        4: {
            type: "Conta Digital",
            description:
                "Uma conta bancária oferecida por instituições financeiras digitais que opera exclusivamente online, geralmente com taxas mais baixas ou isenção de taxas.",
        },
        5: {
            type: "Conta Universitária",
            description:
                "Uma conta corrente voltada para estudantes universitários, oferecendo benefícios e vantagens específicas, como taxas reduzidas e acesso a crédito estudantil.",
        },
        6: {
            type: "Conta Investimento",
            description:
                "Uma conta especializada para a compra e venda de ativos financeiros, como ações, títulos públicos e fundos de investimento.",
        },
        7: {
            type: "Conta Conjunta",
            description:
                "Uma conta bancária compartilhada por duas ou mais pessoas, permitindo que todos os titulares realizem transações e gerenciem os recursos em conjunto.",
        },
        8: {
            type: "Conta Empresarial",
            description:
                "Uma conta bancária específica para empresas e organizações, usada para gerenciar recursos financeiros, pagar funcionários e realizar transações relacionadas às atividades da empresa.",
        },
        9: {
            type: "Cartão de Crédito",
            description:
                "Um cartão de pagamento que permite ao titular comprar bens e serviços a crédito, com um limite predefinido e sujeito a juros se o saldo não for pago integralmente no vencimento.",
        },
        10: {
            type: "Cartão de Débito",
            description:
                "Um cartão de pagamento vinculado diretamente à conta bancária do titular, permitindo a realização de transações, como compras e saques, debitando os fundos diretamente da conta.",
        },
        11: {
            type: "Cartão de Refeição",
            description:
                "Um cartão pré-pago fornecido por empresas como benefício aos funcionários, destinado ao pagamento de refeições em restaurantes e estabelecimentos similares.",
        },
        12: {
            type: "Cartão de Alimentação",
            description:
                "Um cartão pré-pago fornecido por empresas como benefício aos funcionários, destinado ao pagamento de compras em supermercados e estabelecimentos similares.",
        },
        13: {
            type: "Cartão de Combustível",
            description:
                "Um cartão pré-pago fornecido por empresas como benefício aos funcionários, destinado ao pagamento de combustível em postos de gasolina.",
        },
        14: {
            type: "Cartão de Viagem",
            description:
                "Um cartão pré-pago ou recarregável projetado para ser usado em viagens, facilitando transações em moedas estrangeiras e oferecendo benefícios, como seguros e assistência em viagem.",
        },
        15: {
            type: "Cartão de Estudante",
            description:
                "Um cartão emitido a estudantes, que pode oferecer benefícios e descontos em serviços e produtos educacionais, culturais e de transporte.",
        },
        16: {
            type: "Cartão de Empréstimo",
            description:
                "Um cartão vinculado a uma linha de crédito ou empréstimo pessoal, permitindo ao titular acessar os fundos emprestados para uso conforme necessário.",
        },
    };

    const types: Object[] = [];

    for (const item of Object.values(account_types)) {
        types.push({
            type: item.type,
            description: item.description,
        });
    }

    // Inserts seed entries
    await knex("account_types").insert(types);
}

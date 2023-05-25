import { faker } from "@faker-js/faker";
import { Knex } from "knex";
import Category from "../models/Category";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("categories").del();
    const categories_name = [
        "Alimentação",
        "Transporte",
        "Saúde",
        "Educação",
        "Moradia",
        "Lazer",
        "Comunicação",
        "Vestuário",
        "Cuidados pessoais",
        "Impostos e taxas",
        "Serviços financeiros",
        "Animais de estimação",
        "Doações e caridade",
        "Viagens",
        "Manutenção de veículos",
        "Seguros",
        "Presentes",
        "Entretenimento",
        "Crianças",
        "Despesas bancárias",
        "Imprevistos",
        "Outras despesas",
        "Salário",
        "Vendas de produtos ou serviços",
        "Investimentos",
        "Aluguel de propriedades",
        "Pensão alimentícia",
        "Empréstimos recebidos",
        "Prêmios ou bonificações",
        "Bolsas de estudo",
        "Trabalho freelancer",
        "Vendas de imóveis",
        "Rendas de patentes",
        "Doações",
        "Rendas de ações",
        "Recebimentos judiciais",
        "Rendas de aluguéis",
        "Rendas de bens pessoais",
        "Recebimentos de seguro",
        "Ganhos em jogos e loterias",
        "Participação em pesquisas",
        "Rendas de royalties",
        "Outras rendas",
    ];

    const categories: Category[] = [];

    for (const category of categories_name) {
        categories.push({
            category: category,
            description: faker.lorem.sentence(),
        });
    }

    // Inserts seed entries
    await knex("categories").insert(categories);
}

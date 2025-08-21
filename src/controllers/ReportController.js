/**
 * Relatório Financeiro 
 * API para alimentar os gráficos
 */

import supabase from "../services/Supabase.js";

export const getSummary = async (req, res) => {
    try{
        // Resgatando as datas de início e fim da URL
        const { start_date, end_date } = req.query;
        // Validando para garantir que o período foi informado
        if(!start_date || !end_date){
            return res.status(400).json({
                error: 'Os parâmetros data de início e data de fim são obrigatórios.',
            });
        }
        // Chamando função do supabase
        const { data, error } = await supabase.rpc('get_financial_summary',{
            p_start_date: start_date,
            p_end_date: end_date,
        });

        if(error){
            // Se a função falha, é lançado o erro
            throw error;
        }

        // Retornando os dados do sumário
        res.status(200).json(data);
        
    }catch(error){        
        res.status(500).json({ error: error.message });        

    }
}
// Função para gerar um relatório Financeiro detalhado por categoria
export const getSummaryByCategory = async(req, res) => {
    try {
        const { start_date, end_date } = req.query;

    // Validando para garantir que o período foi informado
    if(!start_date || !end_date){
        return res.status(400).json({
            error: 'Os parâmetros data de início e data  de fim são obrigatórios.',
        });
    }

    // Chamando função do supabase
    const { data, error } = await supabase.rpc('get_summary_by_category',{
        p_start_date: start_date,
        p_end_date: end_date,
    });

    if(error){
        // Se a função falha, é lançado o erro
        throw error;
    }

    res.status(200).json(data);
        
    } catch (error) {
        res.status(500).json({ error: error.message });

    }
};

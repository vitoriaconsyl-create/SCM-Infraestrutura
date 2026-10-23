const atualizarOcorrenciaDto = (dados) => {

    return {
        descricao: dados.descricao,
        categoria: dados.categoria,
        status: dados.status,
        endereco: dados.endereco,
        bairro: dados.bairro,
        complemento: dados.complemento || null,
        latitude: dados.latitude || null,
        longitude: dados.longitude || null,
        imagem: dados.imagem || null,
        prioridade: dados.prioridade,
        equipe: dados.equipe || null
    };

};

module.exports = atualizarOcorrenciaDto;
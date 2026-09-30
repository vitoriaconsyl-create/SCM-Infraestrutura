const criarOcorrenciaResponseDto = (ocorrencia) => {
    return {
        id: ocorrencia.id,
        descricao: ocorrencia.descricao,
        categoria: ocorrencia.categoria,
        status: ocorrencia.status,
        endereco: ocorrencia.endereco,
        bairro: ocorrencia.bairro,
        complemento: ocorrencia.complemento,
        latitude: ocorrencia.latitude,
        longitude: ocorrencia.longitude,
        imagem: ocorrencia.imagem,
        prioridade: ocorrencia.prioridade,
        protocolo: ocorrencia.protocolo,
        usuario_id: ocorrencia.usuario_id,
        criado_em: ocorrencia.criado_em
    };
};

module.exports = criarOcorrenciaResponseDto;
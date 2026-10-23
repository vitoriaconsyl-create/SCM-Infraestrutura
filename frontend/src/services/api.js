
const API_URL = import.meta.env.VITE_API_URL;

export async function apiRequest(
    endpoint,
    options = {},
    token = null
) {
    const headers = {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const texto = await response.text();

    let dados = null;

    if (texto) {
        try {
            dados = JSON.parse(texto);
        } catch {
            dados = { erro: texto };
        }
    }

    if (!response.ok) {
        throw new Error(
            dados?.erro || dados?.mensagem || "Erro na comunicação com a API."
        );
    }

    return dados;
}

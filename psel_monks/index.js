const fs = require('fs');

// Lê os arquivos
function readFile(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Erro ao ler o arquivo ${filePath}:`, error);
        return [];
    }
}

// Corrige Caracteres
function replaceChar(obj) {
    try {
        const regex_a = /æ/gi;
        const regex_o = /Ø/gi;

        // Corrige os caracteres especiais
        let result = obj.replaceAll(regex_a, 'a').replaceAll(regex_o, 'o');
        return result;
    } catch (e) {
        return obj
    }
}

// Corrige valore de vendas
function corrigirVendas(dados) {
    dados.forEach(item => {
        if (typeof item.vendas === 'string') {
            // Converte os números que estão em string para valor numérico
            item.vendas = parseFloat(item.vendas);
            
            // Caso não seja válido, converte pra 0
            if (isNaN(item.vendas)) {
                item.vendas = 0;
            }
        }
    });
    return dados;
}

// Corrige os dados
function fixedData() {
    try {
        // Lê os arquivos JSON corrompidos
        const brokenData1 = readFile('broken_database/broken_database_1.json');
        const brokenData2 = readFile('broken_database/broken_database_2.json');

        // Corrige os caracteres especiais nos nomes e marcas
        const correctedData1 = brokenData1.map(item => {
            item.nome = replaceChar(item.nome);
            item.marca = replaceChar(item.marca);
            return item;
        });

        const correctedData2 = brokenData2.map(item => {
            item.nome = replaceChar(item.nome);
            item.marca = replaceChar(item.marca);
            return item;
        });

        // Corrige os valores de vendas para garantir que sejam números
        const finalData1 = corrigirVendas(correctedData1);
        const finalData2 = corrigirVendas(correctedData2);

        // Exporta os arquivos
        fs.writeFileSync('fixed_database/fixed_database_1.json', JSON.stringify(finalData1, null, 2));
        fs.writeFileSync('fixed_database/fixed_database_2.json', JSON.stringify(finalData2, null, 2));

        // Confirmação
        console.log("Arquivo fixed_database_1.json exportado com sucesso.");
        console.log("Arquivo fixed_database_2.json exportado com sucesso.");
    } catch (error) {
        console.error("Erro", error);
    }
}

fixedData();

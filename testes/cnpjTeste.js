var nock = require('nock'),

    fs = require('fs'),
    path = require('path'),

    consultaCnpj = require('../index').cnpj,
    urlReceita = 'http://www.receita.fazenda.gov.br',
    pathReceita = '/PessoaJuridica/CNPJ/cnpjreva/valida.asp';

function caminhoDaFixture(nome, arquivo) {
    return path.join(__dirname, 'fixtures', nome, arquivo);
}

// Se for necessário converter encodings
// cat ./testes/fixtures/azul/resultado.html | iconv -f UTF8 -t ISO-8859-1 ./testes/fixtures/azul/resultado.html

function executarCasoDeTeste(nome) {
    return function(test) {
        var caminhoExpectativa = caminhoDaFixture(nome, 'expectativa.json'),
            expectativa = require(caminhoExpectativa),

            caminhoResultado = caminhoDaFixture(nome, 'resultado.html'),
            resultado = fs.readFileSync(caminhoResultado).toString(),

            requests = nock(urlReceita).post(pathReceita).reply(200, resultado);

        consultaCnpj.obterDados('naoFazDiferenca', {
            sessionId: 'naoFazDiferenca',
            solucao: 'naoFazDiferenca'
        }, function(err, dados) {
            requests.done();
            test.ifError(err);

            test.deepEqual(dados.nome, expectativa.nome);
            test.deepEqual(dados.cnpj, expectativa.cnpj);
            test.deepEqual(dados.email, expectativa.email);
            test.deepEqual(dados.telefone, expectativa.telefone);
            test.deepEqual(dados.tipo, expectativa.tipo);
            test.deepEqual(dados.dataDeAbertura, expectativa.dataDeAbertura);
            test.deepEqual(dados.atividadesEconomicas, expectativa.atividadesEconomicas);
            test.deepEqual(dados.naturezaJuridica, expectativa.naturezaJuridica);
            test.deepEqual(dados.situacao, expectativa.situacao);
            test.deepEqual(dados.endereco, expectativa.endereco);
            test.deepEqual(dados.consulta, expectativa.consulta);

            test.done();
        });
    }
}

module.exports = {
    'Azul': executarCasoDeTeste('azul')
}
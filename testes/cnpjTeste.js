var nock = require('nock'),

    fs = require('fs'),
    path = require('path'),

    consultaCnpj = require('../index').cnpj,
    url = 'http://www.receita.fazenda.gov.br/PessoaJuridica/CNPJ/cnpjreva';

function executarCasoDeTeste(nome) {
    return function(test) {
        var caminhoExpectativa = path.join(__dirname, 'fixtures', nome, 'expectativa.json'),
            expectativa = require(caminhoExpectativa),

            caminhoResultado = path.join(__dirname, 'fixtures', nome, 'resultado.html'),
            resultado = fs.readFileSync(caminhoResultado).toString();

        nock(url).get('/valida.asp').reply(200, resultado);

        consultaCnpj.obterDados('naoFazDiferenca', {
            sessionId: 'naoFazDiferenca',
            solucao: 'naoFazDiferenca'
        }, function(err, dados) {
            test.isError(err);
            test.deepEqual(dados, expectativa);
            test.done();
        });
    }
}

module.exports = {
    'Azul': executarCasoDeTeste('azul')
}
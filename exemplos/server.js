var express = require('express'),
    bodyParser = require('body-parser'),

    fs = require('fs'),

    app = express(),
    consultas = require('../index');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', function(req, res, next) {
    consultas.cnpj.obterCaptcha(function(err, captcha) {
        if(err) {
            return next(err);
        }

        var index = fs.readFileSync(__dirname + '/index.html').toString();
        index = index.replace(':captchaBase64', captcha.captchaEmBase64);
        index = index.replace(':sessionId', captcha.sessionId);

        res.end(index);
    });
});

app.get('/consulta', function(req, res, next) {
    var cnpj = req.query.documento,
        captcha = req.query.captcha;

    consultas.cnpj.obterDados(cnpj, captcha, function(err, dadosDaEmpresa) {
        if(err) {
            return next(err);
        }

        res.json(dadosDaEmpresa, null, 4);
    });
});

app.listen(8000);

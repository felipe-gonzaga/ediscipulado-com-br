console.log('Script de servidor iniciado...');

const express = require('express');
const path = require('path');
const port = process.env.PORT || 3000;
const app = express();

app.use(express.static(path.join(__dirname, 'dist', 'ediscipulado-ui'
)));

app.get('/*', function (req, res) {
   res.sendFile(path.join(__dirname, 'dist', 'ediscipulado-ui', 'index.html'))
});

console.log(`App em: ${__dirname}//dist//ediscipulado-ui`);

app.listen(port);

/*
var express = require('express');
var app = express();

app.use(express.static(__dirname));

app.get('*', function(req, res){
  res.redirect('/index.html');
});

var port = 3000;
app.listen(port);
console.log('Umbler - Express server started on port %s', port);
*/

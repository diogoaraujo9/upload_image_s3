//Carregando os modulos 
var express = require('express');
var AWS = require('aws-sdk');
var multer  = require('multer')
var multerS3 = require('multer-s3');
var app = express();

//Instanciando a classe S3
var s3Config = new AWS.S3({
    accessKeyId : "AKIAIMAWFFAQDGJMA4KA",
    secretAccessKey : "uAmDx/u9nFlXLAl3+lEs475BVmSmDTfmlBspr2ii"
});

//Nome do meu bucket que criei no console.aws.amazon
var awsBucket = "example-aws";

//Definindo as configurações do multer
var multerConfig = multer({
    //Define onde salvar a imagem
    //Com o multerS3 conseguimos definir as configurações para salvar direto no S3
    storage: multerS3({
      // Configurações do S3
      s3 : s3Config, 
      // O bucket usado para armazenar o arquivo
      bucket : awsBucket,  
      //O contentType AUTO_CONTENT_TYPE encontraá automaticamente o tipo de conteúdo do arquivo 
      // O valor default é application/octet-stream 
      contentType : multerS3.AUTO_CONTENT_TYPE,
      //Controle de acesso para o arquivo	
      acl : 'public-read',
      //Define o nome do arquivo
      key: function (req, file, cb) {
        var fileName = `${Date.now().toString()}-${file.originalname}`;

        cb(null, fileName)
      }
    }),
    //Função que irá validar o tipo da imagem, caso não seja um tipo valido retorna erro
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
          "image/jpeg",
          "image/pjpeg",
          "image/png",
          "image/gif"
        ];
        
        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error("Invalid file type."));
        }
    }
})

//Rotas
app.post('/upload', multer(multerConfig).single('file'), (req, res) => {

    var imageInfo = {
        path : req.file.location,
        key : req.file.key
    };

    res.json(imageInfo);

});


//Porta que meu projeto irá rodar
app.listen(3000);

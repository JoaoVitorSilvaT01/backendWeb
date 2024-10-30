const express = require("express");//req    uisito toda a biblioteca aqui
const { Client } = require("pg");//aqui não é requisitada toda a pg, somente a parte client
const cors = require("cors");
const bodyparser = require("body-parser");
const config = require("./config");
const app = express();
app.use(express.json());//saída da api será json
app.use(cors());//isso é referencia cruzada, para permitir acessos locais
app.use(bodyparser.json());

var conString = config.urlConnection;
var client = new Client(conString);
client.connect((err) => {
  if (err) {
    return console.error("Não foi possível conectar ao banco.", err);
  }
  client.query("SELECT NOW()", (err, result) => {
    if (err) {
      return console.error("Erro ao executar a query.", err);
    }
    console.log(result.rows[0]);
  });
});


app.get("/usuarios", (req, res) => {
  try {
  client.query("SELECT * FROM Usuarios", 
  (err, result) => {
  if (err) {
  return console.error("Erro ao executar a qryde SELECT", err);
  }
  res.send(result.rows);
  console.log("Rota: get usuarios");
  });
  } catch (error) {
  console.log(error);
  }
  });


  app.get("/usuarios/:id", (req, res) => {
    try {
      console.log("Rota: usuarios/" + req.params.id);
      client.query(
        "SELECT * FROM Usuarios WHERE id = $1",
        [req.params.id],
        (err, result) => {
          if (err) {
            return console.error("Erro ao executar a qry de SELECT id", err);
          }
          res.send(result.rows);
          //console.log(result);
        }
      );
    } catch (error) {
      console.log(error);
    }
  });

app.get("/", (req, res) => {
  console.log("Response ok.");
  res.send("Ok – Servidor disponível.");
});
app.listen(config.port, () =>
  console.log("Servidor funcionando na porta " + config.port)
);


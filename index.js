const express = require("express");
const bodyParser = require("body-parser");
const {
  default: makeWASocket,
  DisconnectReason,
  BufferJSON,
  MessageRetryMap,
  useMultiFileAuthState,
  msgRetryCounterMap,
} = require("@whiskeysockets/baileys");
const log = (pino = require("pino"));
const { session } = { session: "session_auth_info" };
const { Boom } = require("@hapi/boom");
const handleMessage = require("./models/messages"); // Importa a função do módulo

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const port = process.env.PORT || 3000;
const fs = require('fs');

let sock;
let qrDinamic;

async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState("session_auth_info");

  sock = makeWASocket({
    printQRInTerminal: true,
    auth: state,
    logger: log({ level: "silent" }),
  });

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;
    qrDinamic = qr;

    const handleDisconnect = (reason) => {
      switch (reason) {
        case DisconnectReason.badSession:
          console.log(`Arquivo de sessão inválido, exclua ${session} e verifique novamente`);
          sock.logout();
          break;
        case DisconnectReason.connectionClosed:
        case DisconnectReason.connectionLost:
        case DisconnectReason.restartRequired:
        case DisconnectReason.timedOut:
          console.log("Conexão efetuada, reconectando....");
          connectToWhatsApp();
          break;
        case DisconnectReason.connectionReplaced:
        case DisconnectReason.loggedOut:
          console.log(`Dispositivo desligado, encerrando ${session} e gerando um novo QR.`);
          sock.logout();
          break;
        default:
          sock.end(`Motivo da desconexao: ${reason}|${lastDisconnect.error}`);
      }
    };

    if (connection === "close") {
      const reason = new Boom(lastDisconnect.error).output.statusCode;
      handleDisconnect(reason);
    } else if (connection === "open") {
      console.log("Whatsapp conectado!");
      return;
    }
  });


  sock.ev.on("messages.upsert", async ({ messages }) => {
    for (const message of messages) {
      const { key, pushName, message: { conversation }, messageTimestamp } = message;
      const { remoteJid } = key;
      const id = remoteJid.replace(/@s.whatsapp.net$/, ''); // Remover "@s.whatsapp.net" do JID
      const horaBrasil = new Date(messageTimestamp * 1000).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });

      // Exibir os dados do usuário que enviou a mensagem e os dados da mensagem no terminal
      console.log("Dados do usuário:");
      console.log("Nome:", pushName);
      console.log("JID:", remoteJid);

      console.log("\nDados da mensagem:");
      console.log("Texto:", conversation);
      console.log("Hora (Brasil):", horaBrasil);
      console.log("----------------------------------");
    }
  });

  sock.ev.on("creds.update", saveCreds);
}

const isConnected = () => {
  return sock?.user ? true : false;
};

io.on("connection", async (socket) => {
  soket = socket;
  if (isConnected()) {
    updateQR("connected");
  } else if (qrDinamic) {
    updateQR("qr");
  }
});

async function enviarMensagem(texto, jid) {
  if (!isConnected()) {
    throw new Error("Não conectado ao WhatsApp.");
  }

  // Criar o objeto de mensagem no formato esperado pela função sendMessage
  const message = {
    text: texto // Definindo o texto da mensagem
  };

  try {
    // Enviar a mensagem
    await sock.sendMessage(jid, message);
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    throw error;
  }
}

// Adicionando bodyParser para tratar JSON nas requisições POST
app.use(bodyParser.json());

app.post("/enviar-mensagem", async (req, res) => {
  try {
    // Extrair os valores do corpo da requisição, incluindo o número de destino
    const { info, status, horario, preventivo, numeroDestino, Bandeira } = req.body;

    // Montar a mensagem utilizando o template com os valores específicos
    const mensagem = `💳  Cartao: ${info}\n 💳  Bandeira: ${Bandeira}💎  Status: ${status} ✅\n⏰ Horario: ${horario}\n❌  Preventivo: ${preventivo}\n`;

    // Enviar a mensagem para o número de destino especificado
    await enviarMensagem(mensagem, `${numeroDestino}@s.whatsapp.net`);

    return res.status(200).json({ message: "Mensagem enviada com sucesso." });
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    return res.status(500).json({ error: "Ocorreu um erro ao enviar a mensagem." });
  }
});

app.post("/log", async (req, res) => {
  try {
    // Extrair os valores do corpo da requisição, incluindo o número de destino
    const { info, retorno, dixavado, horario } = req.body;

    // Montar a mensagem utilizando o template com os valores específicos e a hora atual
    const mensagem = `💳  Cartao: ${info}\n⏰ Horario: ${horario}\n\n❌ Retorno: ${retorno}\n`;

    // Enviar a mensagem para o número de destino especificado
    await enviarMensagem(mensagem, `${dixavado}@s.whatsapp.net`);

    return res.status(200).json({ message: "Mensagem enviada com sucesso." });
  } catch (error) {
    console.error("Erro ao enviar o LOG:", error);
    return res.status(500).json({ error: "Ocorreu um erro ao enviar a mensagem." });
  }
});

app.get("/", async (req, res) => {
  res.send("Ola")
});
connectToWhatsApp().catch((err) => console.log("uneErro inesperado: " + err)); // catch any errors
server.listen(port, () => {
  console.log("Servidor rodando na porta: " + port);
});

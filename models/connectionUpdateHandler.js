const { Boom } = require("@hapi/boom");
const {
    default: makeWASocket,
    DisconnectReason,
    useMultiFileAuthState,
  } = require("@whiskeysockets/baileys");

async function handleConnectionUpdate({ update, sock, session }) {
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
}

module.exports = handleConnectionUpdate;

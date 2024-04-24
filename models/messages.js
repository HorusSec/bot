const fs = require('fs');
const emoji = require('node-emoji');

async function handleMessage({ messages, type, sock }) {
    try {
        if (type === "notify") {
            if (!messages[0]?.key.fromMe) {
                // Verifica se a mensagem é uma reply message
                const isReply = messages[0]?.message?.extendedTextMessage !== undefined;
                
                const comandos = JSON.parse(fs.readFileSync('config/cmd.json', 'utf8'));
                
                if (captureMessage in comandos) {
                    const comandoData = comandos[captureMessage];
                    const templateFile = `./config/${comandoData.comando}.json`;
                    const imageUrl = comandoData.rota_imagem;
                    
                    if (fs.existsSync(templateFile)) {
                        const data = JSON.parse(fs.readFileSync(templateFile, 'utf8'));
                        
                        // Envie a imagem
                        const infoMessage = {
                            image: {
                                url: imageUrl
                            },
                        };
                        await sock.sendMessage(messages[0].key.remoteJid, infoMessage);
                        
                        // Envie o template
                        await sock.sendMessage(
                            messages[0].key.remoteJid,
                            {
                                text: data.text,
                                sections: data.sections,
                                buttonText: data.buttonText,
                                footer: data.description,
                                title: data.title,
                                viewOnce: true
                            }
                        );
                        
                        const key = {
                            remoteJid: messages[0].key.remoteJid,
                            id: messages[0].key.id,
                            participant: messages[0].key.participant,
                        };
                        
                        await sock.readMessages([key]);
                    } else {
                        console.log(`Template para o comando '${comandoData.comando}' não encontrado.`);
                    }
                } else if (emoji.which(captureMessage)) {
                    const reactionMessage = {
                        react: {
                            text: captureMessage,
                            key: messages[0].key,
                        },
                    };
                    await sock.sendMessage(messages[0].key.remoteJid, reactionMessage);
                    
                    const key = {
                        remoteJid: messages[0].key.remoteJid,
                        id: messages[0].key.id,
                        participant: messages[0].key.participant,
                    };
                    await sock.readMessages([key]);
                } else {
                    console.log(`Comando não reconhecido.`);
                }
            }
        }
    } catch (error) {
        console.log("error ", error);
    }
}

module.exports = handleMessage;

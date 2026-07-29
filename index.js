const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');
const P = require('pino');
const config = require('./config');
const QRCode = require('qrcode-terminal');

async function handleCommand(sock, msg) {
  try {
    const message = msg.message?.conversation || 
                    msg.message?.extendedTextMessage?.text || 
                    '';
    if (!message.startsWith(config.prefix)) return;
    const args = message.slice(config.prefix.length).trim().split(' ');
    const commandName = args[0].toLowerCase();
    const sender = msg.key.remoteJid;
    const commandPath = path.join(__dirname, 'commands', `${commandName}.js`);
    if (fs.existsSync(commandPath)) {
      const command = require(commandPath);
      await command.execute(sock, msg, args, args.slice(1), config);
    } else {
      await sock.sendMessage(sender, { text: '❌ Command nahi mili. .menu dekhein.' });
    }
  } catch (error) {
    console.log('Error:', error);
  }
}

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('./session');
  const sock = makeWASocket({
    auth: state,
    logger: P({ level: 'silent' }),
    browser: ['LEGEND MD BOT', 'Chrome', '1.0.0'],
  });
  sock.ev.on('creds.update', saveCreds);
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr) {
      console.log('📱 Scan this QR code:');
      QRCode.generate(qr, { small: true });
    }
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) startBot();
    } else if (connection === 'open') {
      console.log('✅ LEGEND MD BOT is online!');
      console.log('👑 Owner:', config.ownerName);
    }
  });
  sock.ev.on('messages.upsert', async (m) => {
    const msg = m.messages[0];
    // ✅ FIX: Self-number (You) par bhi command kaam karegi
    if (msg.message) {
      await handleCommand(sock, msg);
    }
  });
}
startBot();

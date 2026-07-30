const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');
const P = require('pino');
const config = require('./config');
const QRCode = require('qrcode-terminal');
const readline = require('readline'); // Pairing code ke liye

async function handleCommand(sock, msg) {
  try {
    let message = '';
    if (msg.message?.conversation) message = msg.message.conversation;
    else if (msg.message?.extendedTextMessage?.text) message = msg.message.extendedTextMessage.text;
    else if (msg.message?.imageMessage?.caption) message = msg.message.imageMessage.caption;
    else return;

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
    console.log('Command Error:', error);
  }
}

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('./session');
  
  const sock = makeWASocket({
    auth: state,
    logger: P({ level: 'silent' }),
    browser: ['LEGEND MD BOT', 'Chrome', '1.0.0'],
    printQRInTerminal: false, // QR band, pairing code use karenge
  });
  
  sock.ev.on('creds.update', saveCreds);
  
  // ---- PAIRING CODE LOGIC ----
  if (!sock.authState.creds.registered) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const phoneNumber = await new Promise((resolve) => {
      rl.question('📱 Apna WhatsApp number daalein (country code ke saath, + nahi, example: 923039507788): ', resolve);
    });
    rl.close();
    
    try {
      const code = await sock.requestPairingCode(phoneNumber.trim());
      console.log(`✅ Aapka Pairing Code: ${code}`);
      console.log('📲 WhatsApp mein "लिंक डिवाइस विद फोन नंबर" par jaake yeh code enter karein.');
    } catch (err) {
      console.log('❌ Pairing code generate nahi ho paaya. Retry karein.');
      console.log(err);
      process.exit(1);
    }
  }
  
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;
    // Agar QR fallback ke taur par chahiye toh (extra safety)
    if (qr && !sock.authState.creds.registered) {
      console.log('📱 QR Code bhi generate ho gaya (agar pairing fail ho toh scan karein):');
      QRCode.generate(qr, { small: true });
    }
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('Connection closed. Reconnecting:', shouldReconnect);
      if (shouldReconnect) startBot();
    } else if (connection === 'open') {
      console.log('✅ LEGEND MD BOT is online!');
      console.log(`👑 Owner: ${config.ownerName}`);
      console.log(`📱 Number: ${config.ownerNumber}`);
      console.log(`🤖 Bot: ${config.botName}`);
    }
  });
  
  sock.ev.on('messages.upsert', async (m) => {
    const msg = m.messages[0];
    // ✅ Self-number (You) aur sab ke liye kaam karega
    if (msg.message) {
      await handleCommand(sock, msg);
    }
  });
}

startBot();

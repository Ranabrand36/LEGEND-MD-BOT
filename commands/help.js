module.exports = {
  execute: async (sock, msg, args, rest, config) => {
    const help = `
📖 *Guide - ${config.botName}*

1. Har command se pehle *.* (dot) lagayein
2. .sticker ke liye image reply karein
3. Bot ko 24/7 chalane ke liye hosting chahiye

🔰 *Basic Commands:*
.ping → Check alive
.menu → Show all commands
.status → Bot info
.sticker → Make sticker from image
.owner → Owner details
.help → Yeh guide

📌 *Koi issue?* Owner se rabta karein.
    `;
    const sender = msg.key.remoteJid;
    await sock.sendMessage(sender, { text: help });
  }
};

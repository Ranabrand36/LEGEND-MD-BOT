module.exports = {
  execute: async (sock, msg, args, rest, config) => {
    const menu = `
🤖 *${config.botName}* - Menu

┌─── Commands ───
│
├─ .ping → Check bot alive
├─ .menu → Yeh menu
├─ .status → Bot info
├─ .sticker → Image se sticker
├─ .owner → Owner details
└─ .help → Guide

👑 Owner: ${config.ownerName}
📱 Number: ${config.ownerNumber}
    `;
    const sender = msg.key.remoteJid;
    await sock.sendMessage(sender, { text: menu });
  }
};

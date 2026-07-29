module.exports = {
  execute: async (sock, msg, args, rest, config) => {
    const sender = msg.key.remoteJid;
    const ownerInfo = `
👑 *Owner Details*

Name: ${config.ownerName}
Number: ${config.ownerNumber}
Bot: ${config.botName}

💬 Koi masla ho toh owner se rabta karein.
    `;
    await sock.sendMessage(sender, { text: ownerInfo });
  }
};

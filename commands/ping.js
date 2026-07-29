module.exports = {
  execute: async (sock, msg, args, rest, config) => {
    const sender = msg.key.remoteJid;
    await sock.sendMessage(sender, { text: '🏓 Pong! Bot alive hai!' });
  }
};

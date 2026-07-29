module.exports = {
  execute: async (sock, msg, args, rest, config) => {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    
    const status = `
📊 *Bot Status*

🤖 Name: ${config.botName}
👑 Owner: ${config.ownerName}
⏱️ Uptime: ${hours}h ${minutes}m ${seconds}s
📱 Mode: Multi-Device
✅ Status: Online
    `;
    const sender = msg.key.remoteJid;
    await sock.sendMessage(sender, { text: status });
  }
};

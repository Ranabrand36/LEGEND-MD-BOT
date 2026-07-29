module.exports = {
  execute: async (sock, msg, args, rest, config) => {
    const sender = msg.key.remoteJid;
    
    // Check if image hai
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const imageMsg = quoted?.imageMessage || msg.message?.imageMessage;
    
    if (!imageMsg) {
      await sock.sendMessage(sender, { 
        text: '❌ Koi image reply karein ya image ke saath .sticker likhein.' 
      });
      return;
    }
    
    try {
      // Image download karein
      const media = await sock.downloadMediaMessage(msg.message?.extendedTextMessage?.contextInfo?.quotedMessage || msg);
      
      // Sticker banaein (simple version)
      await sock.sendMessage(sender, { 
        sticker: media,
        mimetype: 'image/webp'
      });
      
    } catch (error) {
      await sock.sendMessage(sender, { 
        text: '❌ Sticker banane mein error aayi. Koshish karein.' 
      });
    }
  }
};

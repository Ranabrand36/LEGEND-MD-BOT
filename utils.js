function getChannelFooter(config) {
  // Agar config mein values nahi bhi hon toh yeh fallback kaam karega
  const name = config?.channelName || 'Legend Hassan';
  const link = config?.channelLink || 'https://whatsapp.com/channel/0029Vb7VcqlBlHpdhAL7f80S';
  
  return `\n\n📢 *${name}*\n┗━〖 ${link} 〗`;
}

module.exports = { getChannelFooter };

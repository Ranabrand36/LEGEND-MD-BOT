function getChannelFooter(config) {
  // Agar config mein values na bhi hon toh yeh fallback kaam karega
  const name = (config && config.channelName) ? config.channelName : 'Legend Hassan';
  const link = (config && config.channelLink) ? config.channelLink : 'https://whatsapp.com/channel/0029Vb7VcqlBlHpdhAL7f80S';
  
  return `\n\n📢 *${name}*\n┗━〖 ${link} 〗`;
}

module.exports = { getChannelFooter };

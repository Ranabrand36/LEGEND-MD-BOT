cat > config.js << "EOF"
require('dotenv').config();

module.exports = {
  botName: process.env.BOT_NAME || 'LEGEND MD BOT',
  ownerName: process.env.OWNER_NAME || 'Legend Hassan',
  ownerNumber: process.env.OWNER_NUMBER || '923039507788',
  channelName: 'Legend Hassan',
  channelLink: 'https://whatsapp.com/channel/0029Vb7VcqlBlHpdhAL7f80S',
  channelId: '120363407511472969@newsletter',
  prefix: '.',
};
EOF

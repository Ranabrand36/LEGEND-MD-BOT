cat > utils.js << "EOF"
function getChannelFooter(config) {
  return `\n\n📢 *${config.channelName}*\n┗━〖 ${config.channelLink} 〗`;
}

module.exports = { getChannelFooter };
EOF

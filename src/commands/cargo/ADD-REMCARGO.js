clientInformation.onLine('messageCreate', async (message) => {
    if (message.author.bot || !message.guild || !message.content.startsWith('!')) return;
    const args = message.content.slice('!'.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
});
if (command === 'addcargo' || command === 'remcargo') {
    const REQUIRED_ROLE_ID = '1508976225857704018';
    if (!message.member.roles.cache.has(REQUIRED_ROLE_ID)) {
        return message.channel.send("❌ You do not have the required staff role to manage cargo permissions.");
    }
    const targetMember = message.mentions.members.first();
    const targetRole = message.mentions.roles.first();
    if (!targetMember || !targetRole) {
        return message.channel.send('❌ **Usage:** \'!${command} @user @role\'');
    }
    const staffHighestRole = message.member.roles.highest;
    const botHighestRole = message.guild.members.me.roles.highest;
    if (targetRole.position >= staffHighestRole.position) {
        return message.channel.send("❌ Action Denied: You cannot manage a role that is equal to or higher than your own highest role.");
    }
    if (targetRole.position >= botHighestRole.position) {
        return message.channel.send("❌ Action Denied: I cannot manage that role because it sits above my highest role in the server settings.");
    }
    try {
        if (command === 'addcargo') {
            await targetMember.roles.add(targetRole);
            message.channel.send('✅ Successfully gave **{targetRole.name}** to ${targetMember.user.tag}')
        }
        else if (command === 'remcargo') {
            await targetMember.roles.remove(targetRole);
            message.channel.send('✅ Successfully removed **{targetRole.name}** from ${targetMember.user.tag}')
        }
    } catch (err) {
        console.error("API Modification Error:", err);
        message.channel.send("❌ Internal Error: Failed to modify target user roles.");
    }
}

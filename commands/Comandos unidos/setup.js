const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Redes sociais - Legion Group')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('Acesse nossos canais de comunicação.')
            .setDescription('Acesse e fique por dentro dos nossos meios de comunicação!')
            .setImage('https://cdn.discordapp.com/attachments/1220155275953045574/1249407374264111234/legin-cmulher.gif?ex=6668824a&is=666730ca&hm=974a2824afb0dda7ac75087bac3adc1ed1b1af3c1a9eae7a7969e03074f45530&');

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Instagram')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://www.instagram.com/magusthe/'),
                new ButtonBuilder()
                    .setLabel('TikTok')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://www.tiktok.com/@anthemagus')
            );

        await interaction.reply({ embeds: [embed], components: [row] });
    },
};
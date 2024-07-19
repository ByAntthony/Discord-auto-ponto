const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('anuncio')
        .setDescription('Anunciar festa!')
        .addStringOption(option => option.setName('mensagem').setDescription('O texto do anúncio').setRequired(true)),
    async execute(interaction) {
        // Verificar se o usuário tem o cargo específico
        if (!interaction.member.roles.cache.has(config.adminRoleId)) {
            return interaction.reply({ content: 'Você não tem permissão para usar este comando.', ephemeral: true });
        }

        const mensagem = interaction.options.getString('mensagem');
        const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setDescription(`**${mensagem}**`)
            .setImage('https://cdn.discordapp.com/attachments/1220155275953045574/1249407374264111234/legin-cmulher.gif?ex=6668824a&is=666730ca&hm=974a2824afb0dda7ac75087bac3adc1ed1b1af3c1a9eae7a7969e03074f45530&');

        await interaction.reply({ embeds: [embed] });
    },
};
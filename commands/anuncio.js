const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('anuncio')
        .setDescription('Anunciar algo!')
        .addStringOption(option => 
            option.setName('titulo')
                .setDescription('O título do anúncio')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('mensagem')
                .setDescription('O texto do anúncio')
                .setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.roles.cache.has(config.adminRoleId)) {
            return interaction.reply({ content: 'Você não tem permissão para usar este comando.', ephemeral: true });
        }

        const titulo = interaction.options.getString('titulo');
        const mensagem = interaction.options.getString('mensagem');

        const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle(titulo)
            .setDescription(`${mensagem}\n\n@everyone`)
            .setImage('https://cdn.discordapp.com/attachments/1220155275953045574/1249407374264111234/legin-cmulher.gif?ex=6668824a&is=666730ca&hm=974a2824afb0dda7ac75087bac3adc1ed1b1af3c1a9eae7a7969e03074f45530&'); // Gif que vai na embed do comando, coloca um da tua escolha ai meu jovem..

        await interaction.reply({ embeds: [embed] });
    },
};

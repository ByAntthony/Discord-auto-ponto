const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const config = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription('Configura os cargos e canais para contagem de horas')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addRoleOption(option => option.setName('cargo').setDescription('O cargo a ser configurado').setRequired(true))
        .addChannelOption(option => option.setName('canal').setDescription('O canal a ser configurado').setRequired(true)),
    async execute(interaction) {
        const cargo = interaction.options.getRole('cargo');
        const canal = interaction.options.getChannel('canal');

        config.cargos.push(cargo.id);
        config.canais.push(canal.id);

        fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));

        await interaction.reply({
            content: `Configuração salva: Cargo ${cargo.name}, Canal ${canal.name}`,
            ephemeral: true
        });
    },
};

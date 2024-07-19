const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../config.json');
const moment = require('moment');

const voiceTimeFile = path.join(__dirname, '../data/voiceTime.json');
const voiceTime = require(voiceTimeFile);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resetaruser')
        .setDescription('Reseta as horas de um usuário específico')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption(option => option.setName('usuario').setDescription('O usuário a ser resetado').setRequired(true)),
    async execute(interaction, client) {
        const usuario = interaction.options.getUser('usuario');

        // Capturar horas antes do reset
        const horasAntes = voiceTime[usuario.id] ? voiceTime[usuario.id].totalTime : 0;

        // Criar a mensagem de log em embed usando EmbedBuilder
        const logChannel = interaction.guild.channels.cache.get(config.logChannelId);
        if (logChannel) {
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('```HORAS USUÁRIO```')
                .addFields(
                    { name: 'Quem resetou', value: `<@${interaction.user.id}>` },
                    { name: 'Usuário resetado', value: `<@${usuario.id}>` },
                    { name: 'Horas antes do reset', value: `${horasAntes} minutos` },
                    { name: 'Horas após o reset', value: '0 minutos' },
                    { name: 'Data / hora', value: moment().format('```DD/MM/YYYY HH:mm:ss```') }
                )
                .setTimestamp();

            logChannel.send({ embeds: [embed] });
        }

        // Resetar as horas do usuário
        delete voiceTime[usuario.id];
        fs.writeFileSync(voiceTimeFile, JSON.stringify(voiceTime, null, 2));

        // Responder ao usuário que executou o comando
        await interaction.reply({ content: `Horas resetadas para o usuário ${usuario.tag}.`, ephemeral: true });
    },
};

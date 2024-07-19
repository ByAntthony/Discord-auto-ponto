const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

const voiceTimeFile = path.join(__dirname, '../data/voiceTime.json');
const config = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resetar')
        .setDescription('Reseta as horas de todos')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
     
        fs.writeFileSync(voiceTimeFile, '{}');

      
        const logChannel = interaction.guild.channels.cache.get(config.logChannelId);
        if (logChannel) {
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('```HORAS GERAL```')
                .addFields(
                    { name: 'Quem resetou', value: `<@${interaction.user.id}>` },
                    { name: 'Resultado', value: '```Todos os usuários foram resetados```' },
                    { name: 'Data / hora', value: moment().format('```DD/MM/YYYY HH:mm:ss```') }
                )
                .setTimestamp();

            logChannel.send({ embeds: [embed] });
        }

        
        await interaction.reply({ content: 'Horas resetadas para todos os usuários.', ephemeral: true });
    },
};

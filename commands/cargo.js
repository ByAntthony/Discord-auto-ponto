const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const config = require('../config.json');
const moment = require('moment');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cargo')
        .setDescription('Atribui um cargo a um usuário')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption(option => option.setName('usuario').setDescription('O usuário a quem atribuir o cargo').setRequired(true))
        .addRoleOption(option => option.setName('cargo').setDescription('O cargo a atribuir').setRequired(true)),
    async execute(interaction) {
        const usuario = interaction.options.getUser('usuario');
        const cargo = interaction.options.getRole('cargo');
        const member = await interaction.guild.members.fetch(usuario.id);

        await member.roles.add(cargo);
        const logChannel = interaction.guild.channels.cache.get(config.logChannelId);
        if (logChannel) {
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Log de Atribuição de Cargo')
                .addFields(
                    { name: 'Quem aplicou', value: `<@${interaction.user.id}>`, inline: true },
                    { name: 'Quem recebeu', value: `<@${usuario.id}>`, inline: true },
                    { name: 'Cargo aplicado', value: `${cargo.name}`, inline: true },
                    { name: 'Data / hora', value: moment().format('DD/MM/YYYY HH:mm:ss'), inline: true },
                )
                .setTimestamp();

            logChannel.send({ embeds: [embed] });
        }
        
        await interaction.reply({ content: `Cargo ${cargo.name} atribuído a ${usuario.tag}.`, ephemeral: true });
    },
};

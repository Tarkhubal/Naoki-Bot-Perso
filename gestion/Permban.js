const Discord = require("discord.js");
const db = require("quick.db");
const owner = new db.table("Owner")
const alerte = new db.table("AlertePerm")
const cl = new db.table("Color")
const config = require("../config")
const emote = require('../emotes.json')

module.exports = {
    name: 'pban',
    usage: 'pban',
    category: "owner",
    description: `Permet de désactiver toutes les permissions ban du serveur.`,
    async execute(client, message, args) {

        if (owner.get(`owners.${message.author.id}`) || message.member.roles.cache.has(db.fetch(`permgp_${message.guild.id}`)) || config.app.owners.includes(message.author.id) || config.app.funny.includes(message.author.id) === true) {

            let color = cl.fetch(`color_${message.guild.id}`)
            if (color == null) color = config.app.color

            const roles = message.guild.roles.cache.filter(role => role.permissions.any(["BAN_MEMBERS"]));
            roles.forEach(role => role.setPermissions(role.permissions.remove(["BAN_MEMBERS"])).catch(() => { }))

            const permEmbed = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription('**Je désactive les permissions __BAN__ à tous les rôles.**')

            message.channel.send({ embeds: [permEmbed] })

            const channellogs = alerte.get(`${message.guild.id}.alerteperm`)
            let roleping = db.get(`role_${message.guild.id}`)
            if (roleping === null) roleping = "@everyone"

            const embed = new Discord.MessageEmbed()
                .setColor(color)
                .setTitle(`${message.author.tag} a désactivé toutes les __permissions ban__ du serveur`)
                .setDescription(`${emote.administration.loading} Merci de patienter avant de réactiver les permissions le temps que le problème soit réglé\nExécuteur : <@${message.author.id}>`)
                .setTimestamp()
                .setFooter({ text: `📚` })
            client.channels.cache.get(channellogs).send({ content: `${roleping}`, embeds: [embed] }).catch(() => false)

        }
    }
}
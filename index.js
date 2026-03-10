const {
Client,
GatewayIntentBits,
ActionRowBuilder,
ButtonBuilder,
ButtonStyle,
EmbedBuilder,
Events,
ChannelType,
PermissionFlagsBits,
StringSelectMenuBuilder
} = require("discord.js");

const client = new Client({
intents: [GatewayIntentBits.Guilds]
});

const TOKEN = "MTQ4MDU4MjgwNDUzMzQxMTkxMA.Gn7RXv.Uh7XgvvbqO_-B7LakuqToG-WUzt9Gd0h9virJY";
const CATEGORY_ID = "1480582044412280945";
const SUPPORT_ROLE_ID = "1480645127281316051";

client.once(Events.ClientReady, () => {
console.log("Ticket Bot Ready!");
});

client.on(Events.InteractionCreate, async interaction => {

if (interaction.isChatInputCommand()) {

if (interaction.commandName === "ticket") {

const embed = new EmbedBuilder()
.setTitle("🎫 Ticket System")
.setDescription("اضغط الزر لفتح تيكيت")
.setColor("Blue")
.setImage("https://lh3.googleusercontent.com/gg-dl/AOI_d_9QDCfRqxoAny42gnnwlAS5zfbhb4Jj6Zx6mw9aERX4fAtuwKgC0fgtPy37TOUosDcZwxpH6LBrc-j45WzDMC41IB4iMMDzxg8Qg1QXXoAfVQcFkoLSBbS7OZNawjapyWTjCGub7m9P5mhLp9esYLkkM1hS1W-0r-C-H4j3zTRt7X5hig=s1024-rj")
.setThumbnail("https://lh3.googleusercontent.com/gg-dl/AOI_d_-mlEAXApj8M5cLGzM4fgZEq8Ytd7dLIL4padhERb4pzPPKEefC7TaKvQKaB_HbCdI8NEjpn75cKnqgf9mQNfAdM-3pkU4Am2QMWgKOjAKV6JCbSwip7NMqOOGLP3skYEs9mmCRf6pDnXqaBE4GjM6KJi_McvpEMCrkYatiaqcYcvSz=s1024-rj")
.setFooter({ text: "Support System" });

const button = new ButtonBuilder()
.setCustomId("open_ticket")
.setLabel("Open Ticket")
.setStyle(ButtonStyle.Primary);

const row = new ActionRowBuilder().addComponents(button);

await interaction.reply({
embeds:[embed],
components:[row]
});

}

}

if (interaction.isButton()) {

if (interaction.customId === "open_ticket") {

const menu = new StringSelectMenuBuilder()
.setCustomId("ticket_type")
.setPlaceholder("اختار نوع التيكيت")
.addOptions([
{
label:"Verify",
value:"verify"
},
{
label:"Suggestion",
value:"suggestion"
},
{
label:"Staff apply",
value:"staff apply"
},
{
label:"Report",
value:"report"
}
]);

const row = new ActionRowBuilder().addComponents(menu);

await interaction.reply({
content:"اختار نوع التيكيت",
components:[row],
ephemeral:true
});

}

if (interaction.customId === "close_ticket") {

await interaction.channel.delete();

}

if (interaction.customId === "claim_ticket") {

interaction.reply({
content:`👮 تم استلام التيكيت بواسطة ${interaction.user}`
});

}

}

if (interaction.isStringSelectMenu()) {

const existing = interaction.guild.channels.cache.find(c =>
c.name === `ticket-${interaction.user.id}`
);

if (existing) {

return interaction.reply({
content:"❌ لديك تيكيت مفتوح بالفعل",
ephemeral:true
});

}

const type = interaction.values[0];

const channel = await interaction.guild.channels.create({

name:`ticket-${interaction.user.username}`,
type:ChannelType.GuildText,
parent:CATEGORY_ID,

permissionOverwrites:[

{
id:interaction.guild.id,
deny:[PermissionFlagsBits.ViewChannel]
},

{
id:interaction.user.id,
allow:[
PermissionFlagsBits.ViewChannel,
PermissionFlagsBits.SendMessages
]
},

{
id:SUPPORT_ROLE_ID,
allow:[
PermissionFlagsBits.ViewChannel,
PermissionFlagsBits.SendMessages
]
}

]

});

const close = new ButtonBuilder()
.setCustomId("close_ticket")
.setLabel("Close Ticket")
.setStyle(ButtonStyle.Danger);

const claim = new ButtonBuilder()
.setCustomId("claim_ticket")
.setLabel("Claim Ticket")
.setStyle(ButtonStyle.Success);

const row = new ActionRowBuilder().addComponents(close,claim);

channel.send({
content:`🎫 ${interaction.user} فتح تيكيت\nالنوع: **${type}**`,
components:[row]
});

interaction.reply({
content:`✅ تم فتح التيكيت ${channel}`,
ephemeral:true
});

}

});

client.login(TOKEN);
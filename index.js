// Require the necessary discord.js classes
const fs = require("node:fs");
const { Client, Collection, Intents } = require("discord.js");
const { token } = require("./config.json");
const { MessageActionRow, MessageSelectMenu } = require("discord.js");

// DOTENV DIDNT WORK FOR SOME STRANGE REASON. USED CONFIG.JSON INSTEAD.

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// client.commands Allows us to access commands in other files. then i can loop over command file (with the filter engaged so it leaves non .js files out of process. This will dynamically set the client.commands Collection)
client.commands = new Collection();
const commandFiles = fs
	.readdirSync("./commands")
	.filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}
// When the client is ready, run this code (only once)
client.once("ready", () => {
	console.log("Ready!");
});

// Listener and Logic for Commands (commands are registered at deploy-commands.js. commands have been transferred to commands folder. Any time new command has been inputted to deploy-commands.js, node deploy-commands.js must be run to regstier command.

// event listeners have been transferred to events folder but this folder system isnt working:

// THIS IS SUPPOSED TO BE REPLACED BY EVENT HANDLER BELOW THIS. CANT GET THAT TO WORK. THIS WILL HAVE TO WORK FOR NOW.

client.on("interactionCreate", async (interaction) => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === "ping") {
		await interaction.reply("Pong!");
	} else if (commandName === "server") {
		await interaction.reply(
			`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`
		);
	} else if (commandName === "user") {
		await interaction.reply(
			`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`
		);
	} else if (commandName === "multiselectdemo") {
		const row = new MessageActionRow().addComponents(
			new MessageSelectMenu()
				.setCustomId("select")
				.setPlaceholder("Tester Select Menu")
				.setMinValues(2)
				.setMaxValues(3)
				.addOptions([
					{
						label: "Select me",
						description: "This is a description",
						value: "first_option",
					},
					{
						label: "You can select me too",
						description: "This is also a description",
						value: "second_option",
					},
					{
						label: "I am also an option",
						description: "This is a description as well",
						value: "third_option",
					},
				])
		);
		await interaction.reply({
			content: "MultiTester Completed!",
			components: [row],
		});
	} else if (commandName === "singleselectdemo") {
		const row = new MessageActionRow().addComponents(
			new MessageSelectMenu()
				.setCustomId("select")
				.setPlaceholder("Nothing selected")
				.addOptions([
					{
						label: "Select me",
						description: "This is a description",
						value: "first_option",
					},
					{
						label: "You can select me too",
						description: "This is also a description",
						value: "second_option",
					},
				])
		);

		await interaction.reply({
			content: "SingleTester Completed!",
			components: [row],
		});
	}
});

// I CANT GET THIS EVENT HANDLER LOOPER TO WORK - COPIED PASTED FROM DOCUMENTATION YET STILL DOESNT TRIGGER. THE ABOVE GIANT BLOCK OF CODE IS WORKING BUT UGLY AND I HATE IT.

// const eventFiles = fs
// 	.readdirSync("./events")
// 	.filter((file) => file.endsWith(".js"));

// for (const file of eventFiles) {
// 	const event = require(`./events/${file}`);
// 	if (event.once) {
// 		client.once(event.name, (...args) => event.execute(...args));
// 	} else {
// 		client.on(event.name, (...args) => event.execute(...args));
// 	}
// }

// Login to Discord with your client's token
client.login(token);

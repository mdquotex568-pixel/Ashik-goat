const fs = require("fs-extra");
const path = require("path");

const banPath = path.join(__dirname, "banlist.json");

if (!fs.existsSync(banPath)) {
	fs.writeFileSync(banPath, JSON.stringify({}, null, 2));
}

function getBanList() {
	return JSON.parse(fs.readFileSync(banPath));
}

function saveBanList(data) {
	fs.writeFileSync(banPath, JSON.stringify(data, null, 2));
}

module.exports = {
	config: {
		name: "ban",
		version: "1.0",
		author: "ashik",
		role: 2,
		category: "admin",
		description: "Ban system"
	},

	onStart: async function ({ api, event, args, message }) {

		const type = args[0];

		let mentions = Object.keys(event.mentions || {});
		let data = getBanList();

		// BAN USER
		if (type === "add" || type === "ban") {

			if (!mentions.length)
				return message.reply("❌ Mention someone to ban");

			const uid = mentions[0];

			data[uid] = {
				name: event.mentions[uid],
				time: Date.now()
			};

			saveBanList(data);

			return message.reply(`🚫 User banned successfully`);
		}

		// UNBAN USER
		if (type === "remove" || type === "unban") {

			if (!mentions.length)
				return message.reply("❌ Mention someone to unban");

			const uid = mentions[0];

			delete data[uid];

			saveBanList(data);

			return message.reply(`✅ User unbanned successfully`);
		}

		// BANLIST
		if (type === "list" || !type) {

			let msg = "🚫 BAN LIST 🚫\n\n";

			const keys = Object.keys(data);

			if (!keys.length)
				return message.reply("✅ No banned users");

			for (let i = 0; i < keys.length; i++) {
				msg += `${i + 1}. ${keys[i]}\n`;
			}

			return message.reply(msg);
		}
	}
};

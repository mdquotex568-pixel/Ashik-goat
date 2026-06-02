module.exports = {
config: {
name: "uid",
version: "1.0",
author: "ashik",
countDown: 5,
role: 0,
shortDescription: "Get Facebook UID",
longDescription: "Get your or another user's Facebook UID",
category: "info"
},

onStart: async function ({ event, message }) {
	try {
		let uid = event.senderID;

		// Reply target
		if (event.messageReply) {
			uid = event.messageReply.senderID;
		}

		// Mention target
		else if (
			event.mentions &&
			Object.keys(event.mentions).length > 0
		) {
			uid = Object.keys(event.mentions)[0];
		}

		return message.reply(
			`╭─❍\n🆔 UID: ${uid}\n╰───────────⧕`
		);

	} catch (err) {
		console.log(err);
		return message.reply("❌ Failed to get UID");
	}
}

};

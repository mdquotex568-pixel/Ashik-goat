module.exports = {
	config: {
		name: "fork",
		version: "1.0",
		author: "ashik",
		countDown: 5,
		role: 0,
		shortDescription: "Bot source code",
		longDescription: "Show bot fork link",
		category: "info"
	},

	onStart: async function ({ message }) {
		const msg = `
╔══════════════════╗
      🌸 𝘼𝙎𝙃𝙄𝙆 𝘽𝙊𝙏 🌸
╚══════════════════╝

👑 Owner: Ashik

✨ Welcome To My Goat Bot Repository

📌 Features:
➤ Fast Response
➤ Auto Download System
➤ Modern Commands
➤ Easy To Deploy

🔗 Fork Link:
https://github.com/mdquotex568-pixel/Ashik-goat.git

Setup video
https://youtu.be/zp61jH98vSQ?si=vbYqOqGOUQye9Qhu

Telegram channel must join
https://t.me/ashikgod


Massanger group:https://m.me/j/AbZIF6GWRSBTHmQt/?send_source=gc%3Acopy_invite_link_c
━━━━━━━━━━━━━━━
💖 Thanks For Using My Bot
🚀 Fork & Enjoy
━━━━━━━━━━━━━━━
`;

		return message.reply(msg);
	}
};

const fs = require("fs-extra");
const path = require("path");
const fetch = require("node-fetch");
const { createCanvas, loadImage } = require("canvas");

async function loadUserDP(uid) {
	try {
		const url = `https://graph.facebook.com/${uid}/picture?height=1500&width=1500`;
		const buffer = await fetch(url).then(res => res.arrayBuffer());
		return await loadImage(Buffer.from(buffer));
	}
	catch {
		return null;
	}
}

module.exports = {
	config: {
		name: "fakechat",
		aliases: ["fchat"],
		version: "1.0",
		author: "ashik",
		countDown: 5,
		role: 0,
		shortDescription: "Create fake messenger chat",
		category: "fun",
		guide: {
			en: "{pn} @user - message1 - message2"
		}
	},

	onStart: async function ({ api, event, args, message }) {

		const mentions = Object.keys(event.mentions || {});

		if (!mentions.length)
			return message.reply(
				"Example:\n/fakechat @user - Hello - Hi"
			);

		const uid = mentions[0];

		const input = args.join(" ").split("-").map(x => x.trim());

		if (input.length < 2)
			return message.reply(
				"Example:\n/fakechat @user - Hello - Hi"
			);

		const msg1 = input[1] || "Hello";
		const msg2 = input[2] || "";

		let userName = "User";

		try {
			const info = await api.getUserInfo(uid);
			userName = info[uid]?.name || "User";
		}
		catch {}

		const canvas = createCanvas(1080, 1350);
		const ctx = canvas.getContext("2d");

		ctx.fillStyle = "#18191A";
		ctx.fillRect(0, 0, 1080, 1350);

		const avatar = await loadUserDP(uid);

		if (avatar) {
			ctx.save();
			ctx.beginPath();
			ctx.arc(110, 140, 70, 0, Math.PI * 2);
			ctx.clip();
			ctx.drawImage(avatar, 40, 70, 140, 140);
			ctx.restore();
		}

		ctx.fillStyle = "#ffffff";
		ctx.font = "bold 45px Sans";
		ctx.fillText(userName, 220, 130);

		ctx.fillStyle = "#b0b3b8";
		ctx.font = "30px Sans";
		ctx.fillText("Active now", 220, 180);

		// Left bubble
		ctx.fillStyle = "#3A3B3C";
		ctx.roundRect(50, 280, 700, 120, 30);
		ctx.fill();

		ctx.fillStyle = "#fff";
		ctx.font = "40px Sans";
		ctx.fillText(msg1, 80, 355);

		// Right bubble
		if (msg2) {
			ctx.fillStyle = "#0084FF";
			ctx.roundRect(330, 470, 700, 120, 30);
			ctx.fill();

			ctx.fillStyle = "#fff";
			ctx.fillText(msg2, 360, 545);
		}

		const cacheDir = path.join(__dirname, "cache");

		if (!fs.existsSync(cacheDir))
			fs.mkdirSync(cacheDir);

		const imgPath = path.join(
			cacheDir,
			`fakechat_${Date.now()}.png`
		);

		fs.writeFileSync(imgPath, canvas.toBuffer());

		await message.reply({
			attachment: fs.createReadStream(imgPath)
		});

		setTimeout(() => {
			if (fs.existsSync(imgPath))
				fs.unlinkSync(imgPath);
		}, 5000);
	}
};

async function _0x290401(_0x570bf7, _0xb100c2) {
  if (_0x570bf7) {
    global.responseUptimeCurrent = responseUptimeError;

    if (
      _0x570bf7.error == "Not logged in" ||
      _0x570bf7.error == "Not logged in." ||
      _0x570bf7.error == "Connection refused: Server unavailable"
    ) {
      log.err("NOT LOGGED IN", getText("login", "notLoggedIn"), _0x570bf7);
      global.statusAccountBot = "can't login";

      if (global.GoatBot.config.autoRestartWhenListenMqttError) {
        process.exit(2);
      }
      return;
    }

    await handlerWhenListenHasError({
      api: global.GoatBot.fcaApi,
      error: _0x570bf7
    });

    return;
  }

  global.responseUptimeCurrent = responseUptimeSuccess;
  global.statusAccountBot = "good";

  const sender = _0xb100c2?.senderID;
  const thread = _0xb100c2?.threadID;

  // 🔥 FIX: bot ignore problem stop
  if (!sender || !_0xb100c2) return;
  if (_0xb100c2.type && _0xb100c2.type !== "message") return;

  // admin bypass
  const isAdmin = global.GoatBot.config.adminBot.includes(sender);

  // whitelist check (safe version)
  const wlUser = global.GoatBot.config.whiteListMode?.enable
    ? global.GoatBot.config.whiteListMode.whiteListIds.includes(sender)
    : true;

  const wlThread = global.GoatBot.config.whiteListModeThread?.enable
    ? global.GoatBot.config.whiteListModeThread.whiteListThreadIds.includes(thread)
    : true;

  if (!isAdmin && (!wlUser || !wlThread)) return;

  // duplicate message safe
  if (_0xb100c2.messageID && storage5Message.includes(_0xb100c2.messageID)) return;
  if (_0xb100c2.messageID) {
    storage5Message.push(_0xb100c2.messageID);
    if (storage5Message.length > 5) storage5Message.shift();
  }

  // banned user safe check
  if (_0xe3d6c8?.[sender] || _0xe3d6c8?.[_0xb100c2.userID]) {
    const prefix = getPrefix(thread);
    if (_0xb100c2.body?.startsWith(prefix)) {
      return global.GoatBot.fcaApi.sendMessage(
        getText("login", "userBanned"),
        thread
      );
    }
    return;
  }

  const handler = require("../handler/handlerAction.js")(
    global.GoatBot.fcaApi,
    global.db.threadModel,
    global.db.userModel,
    global.db.dashBoardModel,
    global.db.globalModel,
    global.db.usersData,
    global.db.threadsData,
    global.db.dashBoardData,
    global.db.globalData
  );

  handler(_0xb100c2);
}

module.exports = {
  config: { name: "ping", role: 0 },
  onStart: async ({ api, event }) => {
    api.sendMessage("OK WORKING", event.threadID);
  }
};

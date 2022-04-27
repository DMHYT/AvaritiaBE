ConfigureMultiplayer({
    name: "Avaritia",
    version: "0.9.0",
    description: "The Minecraft mod to end all mods",
    isClientOnly: false
});


ModAPI.addAPICallback("KernelExtension", function(api) {
    if(typeof api.getKEXVersionCode === "function" && api.getKEXVersionCode() >= 200) {
        Launch({ KEX: api });
    } else Logger.Log("Failed to launch Avaritia. You must have at least 2.0 version of Kernel Extension!", "AVARITIA");
});
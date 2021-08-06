ConfigureMultiplayer({
    name: "Avaritia BE",
    version: "1.0",
    description: "The Minecraft mod to end all mods",
    isClientOnly: false
});
var _loaded_mods = {
    Thaumcraft: false,
    TConstruct: false,
    HydCraft: false,
    ThermalExpansion: false,
    TSteelworks: false,
    IC2: false,
    ThaumicTinkerer: false,
    technom: false,
    magicalcrops: false,
    AgriCraft: false,
    MineFactoryReloaded: false,
    BigReactors: false,
    EE3: false,
    ProjectE: false,
    Botania: false,
    ExtraUtilities: false,
    appliedenergistics2: false,
    ImmersiveEngineering: false,
    Mekanism: false,
    Torcherino: false,
    DraconicEvolution: false
};
ModAPI.addAPICallback("TConAPI", function(api) {
    _loaded_mods.TConstruct = true;
});
ModAPI.addAPICallback("ICore", function(api) {
    _loaded_mods.IC2 = true;
});
ModAPI.addAPICallback("BotaniaAPI", function(api) {
    _loaded_mods.Botania = true;
});
Launch({ __loaded_mods: _loaded_mods });
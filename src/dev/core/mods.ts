const __loaded_mods = {
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

ModAPI.addAPICallback("TConAPI", () => __loaded_mods.TConstruct = true);
ModAPI.addAPICallback("ICore", () => __loaded_mods.IC2 = true);
ModAPI.addAPICallback("BotaniaAPI", () => __loaded_mods.Botania = true);
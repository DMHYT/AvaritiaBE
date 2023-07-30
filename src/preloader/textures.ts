(() => {
    const hex2rgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return [ parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16) ] as [number, number, number];
    }
    const gen = (id: string, rgb1: [number, number, number], rgb2: [number, number, number]) => {
        TextureWorker.createTextureWithOverlaysModDir({
            bitmap: { width: 16, height: 96 },
            overlays: [
                { path: "resources/res/texture_source/", name: "singularity_back", color: rgb2 },
                { path: "resources/res/texture_source/", name: "singularity_front", color: rgb1 }
            ],
            result: { path: "resources/res/animated_items/", name: id }
        });
    }
    const colors = (() => {
        const result = FileUtil.readJSON(`${__dir__}/resources/res/singularities.json`);
        const modsDir = (() => {
            const preferencesPath = `${__packdir__}innercore/preferences.json`;
            if(new File(preferencesPath).exists()) {
                const innerCoreDir = FileUtil.readJSON(preferencesPath).pack_selected ?? `${__packdir__}innercore`;
                return `${innerCoreDir}/mods/`;
            }
            return `${__packdir__}innercore/mods/`;
        })();
        FileUtil.getListOfDirs(modsDir).forEach(mod => {
            const modPath = mod.getAbsolutePath();
            if(modPath !== __dir__ && new File(mod, "build.config").exists()) {
                FileUtil.readJSON(`${modPath}/build.config`)?.resources?.forEach(res => {
                    if(res.resourceType === "resource") {
                        const singularitiesPath = `${modPath}/${res.path}/singularities.json`;
                        if(new File(singularitiesPath).exists()) {
                            const singularitiesJSON = FileUtil.readJSON(singularitiesPath);
                            for(let key in singularitiesJSON)
                                if(
                                    Array.isArray(singularitiesJSON[key]) &&
                                    singularitiesJSON[key].length === 2 &&
                                    typeof singularitiesJSON[key][0] === "string" &&
                                    typeof singularitiesJSON[key][1] === "string" &&
                                    /^#[a-f\d]{6}$/i.test(singularitiesJSON[key][0]) &&
                                    /^#[a-f\d]{6}$/i.test(singularitiesJSON[key][1])
                                ) {
                                    result[key] = singularitiesJSON[key];
                                }
                        }
                    }
                })
            }
        });
        return result;
    })();
    Object.keys(colors).forEach(key => {
        const arr = colors[key];
        gen(`singularity_${key}`, hex2rgb(arr[0]), hex2rgb(arr[1]));
    });
})();
FileUtil.getListOfFiles(`${__dir__}/resources/res/animated_items/`, "png").forEach(file => {
    const fileName = new JavaString(file.getName()).replaceFirst("[.][^.]+$", "");
    IAHelper.convertTexture("resources/res/animated_items/", fileName, "resources/res/items-opaque/", fileName);
});
(() => {
    const hex2rgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return [ parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16) ] as [number, number, number];
    }
    const gen = (id: string, rgb1: [number, number, number], rgb2: [number, number, number]) => {
        TextureWorker.createTextureWithOverlaysModDir({
            bitmap: { width: 16, height: 96 },
            overlays: [
                { path: "assets/texture_source/", name: "singularity_back", color: rgb2 },
                { path: "assets/texture_source/", name: "singularity_front", color: rgb1 }
            ],
            result: { path: "assets/animated_items/", name: id }
        });
    }
    const obj = FileUtil.readJSON(`${__dir__}/assets/singularities.json`);
    const keys = Object.keys(obj);
    for(let i in keys){
        const key = keys[i], arr = obj[key];
        gen(`singularity_${key}`, hex2rgb(arr[0]), hex2rgb(arr[1]));
    }
})();

(() => {
    let files = FileUtil.getListOfFiles(`${__dir__}/assets/animated_items/`, "png");
    for(let i in files){
        let fileName = new java.lang.String(files[i].getName()).replaceFirst("[.][^.]+$", "");
        IAHelper.convertTexture("assets/animated_items/", fileName, "assets/items-opaque/", fileName);
    }
})();
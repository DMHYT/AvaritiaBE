(() => {
    let files = FileTools.GetListOfFiles(`${__dir__}/assets/animated_items/`, "");
    for(let i in files){
        let fileName = new java.lang.String(files[i].getName()).replaceFirst("[.][^.]+$", "");
        IAHelper.convertTexture("assets/animated_items/", fileName, "assets/items-opaque/", fileName);
    }
})();
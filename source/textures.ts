(() => {
    let files = FileTools.GetListOfFiles(`${__dir__}/assets/animated_items/`, "");
    for(let i in files){
        let fileName = files[i].getName().replace(/[.][^.]+$/g, "");
        IAHelper.convertTexture("assets/animated_items/", fileName, "assets/items-opaque/", fileName);
    }
})();
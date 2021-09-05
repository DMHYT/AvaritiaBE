(() => {
    const all_translation_keys: {[translation_key: string]: {[language: string]: string}} = {};
    const readFile = (name: string) => 
        FileTools.ReadText(`${__dir__}/assets/lang/${name}.lang`)
            .split("\n")
            .filter(element => element.length > 0 && !element.startsWith("#"))
            .forEach(line => {
                const kv = line.split("=");
                all_translation_keys[kv[0]] ??= {};
                all_translation_keys[kv[0]][name] = kv[1];
            });
    FileTools.GetListOfFiles(`${__dir__}/assets/lang`, "lang")
        .forEach(file => readFile(new JavaString(file.getName()).replaceFirst("[.][^.]+$", "")));
    for (let key in all_translation_keys) {
        all_translation_keys[key][Translation.getLanguage()] ??= all_translation_keys[key].en;
        Translation.addTranslation(key, all_translation_keys[key]);
    }
})();
// This should be embedded into InnerCore
(() => {
    const obj = {en: "Inventory", ar: "جَرْدٌ", pt: "Inventário", zh: "存货", hr: "Inventar", cs: "Inventář", da: "Opgørelse", nl: "Inventaris", es: "Inventario", fi: "Inventaario", fr: "Inventaire", de: "Inventar", el: "κατάλογος απογραφέντων αντικειμένων", it: "Inventario", ja: "目録", ko: "품목 일람", nb: "Liste", pl: "Inwentarz", ro: "Inventar", ru: "Инвентарь", sv: "inventarieförteckning", th: "รายการสิ่งของ", tr: "Envanter", uk: "Iнвентар", vi: "bản kiểm kê"};
    obj[Translation.getLanguage()] ??= obj.en;
    Translation.addTranslation("avaritia.inventory", obj);
})();
Translation.addTranslation("avaritia.rv.compressor.amount", {en: "Input Amount: %d", ru: "Требуемое количество: %d", de: "Eingabebetrag: %d", es: "Cantidad de entrada: %d", pt: "Quantidade de entrada: %d", sv: "Ingångsbelopp: %d", zh: "投入金额: %d"});
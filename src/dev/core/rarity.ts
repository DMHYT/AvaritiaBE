namespace Rarity {

    function makeRarity(id: number, rarity: string): void {
        let _func = Item.nameOverrideFunctions[id];
        Item.registerNameOverrideFunction(id, (item, name, name2) => {
            if(_func) name = (_func(item, name, name2) ?? name) as string;
            return `${rarity}${name}`;
        });
    }

    export function uncommon(id: number) { makeRarity(id, EColor.GREEN) }
    export function rare(id: number) { makeRarity(id, EColor.AQUA) }
    export function epic(id: number) { makeRarity(id, EColor.LIGHT_PURPLE) }
    export function cosmic(id: number) { makeRarity(id, EColor.RED) }
    
}
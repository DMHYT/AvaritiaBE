declare type Windows = UI.Window | UI.StandardWindow | UI.StandartWindow | UI.TabbedWindow;
declare type Dict<T = any> = {
    [key: string]: T;
} | {};
declare namespace RecipeTE {
    const AIR_ITEM: RecipeItem;
}
declare namespace RecipeTE {
    type RecipeItem = {
        id: number;
        count?: number;
        data?: number;
    };
    type IngredientsList = {
        [char_mask: string]: RecipeItem;
    };
    interface CraftFunction {
        (container: ItemContainer, workbench: Workbench, TE: WorkbenchTileEntity): void;
    }
    interface Recipe<Data = any> {
        result: RecipeItem;
        mask: string[] | string;
        ingredients: IngredientsList;
        craft: CraftFunction;
        data: Data;
    }
    function defaultCraftFunction<Data>(container: ItemContainer, workbench: Workbench, TE: WorkbenchTileEntity): void;
}
declare namespace RecipeTE {
    interface WorkbenchInfo {
        columns: number;
        rows?: number;
    }
}
declare namespace RecipeTE {
    class Workbench<RecipeData = any> {
        readonly cols: number;
        readonly rows: number;
        readonly countSlot: number;
        protected _recipes: Recipe<RecipeData>[];
        readonly defaultRecipeData: RecipeData;
        constructor(info: WorkbenchInfo, defaultRecipeData?: RecipeData);
        constructor(cols: number, defaultRecipeData?: RecipeData);
        private getDataForRecipe;
        protected getObjRecipe(result: RecipeItem, ingredients: RecipeItem[], data?: RecipeData, craftFunction?: CraftFunction): Recipe;
        protected getObjShapeRecipe(result: RecipeItem, mask: string[] | string, ingredients: IngredientsList, data: RecipeData, craftFunction?: CraftFunction): Recipe;
        addRecipe(result: RecipeItem, ingredients: RecipeItem[], data?: RecipeData, craftFunction?: CraftFunction): this;
        addShapeRecipe(result: RecipeItem, mask: string[] | string, ingredients: IngredientsList, data?: RecipeData, craftFunction?: CraftFunction): this;
        getRecipe(inputs: ItemInstance[]): Recipe;
    }
}
declare namespace RecipeTE {
    interface TimerWorkbenсhInfo extends WorkbenchInfo {
        timer: number;
    }
}
declare namespace RecipeTE {
    interface RecipeDataTimer {
        multiply: number;
    }
    class TimerWorkbench<T extends RecipeDataTimer> extends Workbench<T> {
        readonly timer: number;
        constructor(info: TimerWorkbenсhInfo, defaultRecipeData: T);
    }
}
declare namespace RecipeTE {
    type WorkbenchTileEntityData = {
        enabled?: boolean;
        [key: string]: any;
    };
    export abstract class WorkbenchTileEntity<Data = any> implements TileEntity.TileEntityPrototype {
        protected workbench: Workbench<Data>;
        protected currentRecipe: Recipe<Data>;
        protected container: ItemContainer;
        readonly useNetworkItemContainer: true;
        defaultValues: WorkbenchTileEntityData;
        protected data: WorkbenchTileEntityData;
        constructor(workbench: Workbench, state?: boolean);
        setWorkbench(workbench: Workbench): void;
        protected takeResult(container: ItemContainer, name: string, id: number, amount: number, data: number, extra: ItemExtraData, playerUid: number): number;
        private GlobalAddPolicy;
        private GlobalGetPolicy;
        private setTransferPolicy;
        readonly addGlobalAddTransferPolicy: any;
        readonly addGlobalGetTransferPolicy: any;
        protected getItems(slotName: string, item: ItemInstance): ItemInstance[];
        protected getItems(): ItemInstance[];
        protected validRecipe(slotName: string, item: ItemInstance): void;
        protected validRecipe(): void;
        init(): void;
        abstract getScreenName(): string;
        abstract getScreenByName(): Windows;
        abstract getInputSlots(): string | string[];
        abstract getOutputSlot(): string;
        hasInputSlot(name: string): boolean;
        setEnabled(state: boolean): void;
        enable(): void;
        disable(): void;
        isEnabled(): boolean;
    }
    export {};
}
declare namespace RecipeTE {
    abstract class TimerWorkbenchTileEntity<T extends RecipeDataTimer = RecipeDataTimer> extends WorkbenchTileEntity<T> {
        protected workbench: TimerWorkbench<T>;
        protected ticks: number;
        abstract getScale(): string;
        setEnabled(state: boolean): void;
        protected takeResult(container: ItemContainer, name: string, id: number, amount: number, data: number, extra: ItemExtraData, playerUid: number): number;
        protected validRecipe(slotName: string, item: ItemInstance): void;
        protected validRecipe(): void;
        tick(): void;
    }
}

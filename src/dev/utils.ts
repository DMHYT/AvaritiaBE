class Quat {
    public x: number;
    public y: number;
    public z: number;
    public s: number;
    constructor(x?: number, y?: number, z?: number, s?: 0){
        this.x = x ?? 0, this.y = y ?? 0, this.z = z ?? 0, this.s = s ?? 0;
    }
    public setAroundAxis(ax: number, ay: number, az: number, angle: number): Quat {
        angle *= 0.5;
        const sin = Math.sin(angle);
        this.s = Math.cos(angle), this.x = ax * sin, this.y = ay * sin, this.z = az * sin;
        return this;
    }
    public rotate(vec: Vector3): void {
        const d = -this.x * vec.x - this.y * vec.y - this.z * vec.z;
        const d1 = this.s * vec.x + this.y * vec.z - this.z * vec.y;
        const d2 = this.s * vec.y - this.x * vec.z + this.z * vec.x;
        const d3 = this.s * vec.z + this.x * vec.y - this.y * vec.x;
        vec.x = d1 * this.s - d * this.x - d2 * this.z + d3 * this.y;
        vec.y = d2 * this.s - d * this.y + d1 * this.z - d3 * this.x;
        vec.z = d3 * this.s - d * this.z - d1 * this.y + d2 * this.x;
    }
}
class Vector3 {
    public x: number;
    public y: number;
    public z: number;
    constructor(d?: number, d1?: number, d2?: number){
        this.x = d ?? 0, this.y = d1 ?? 0, this.z = d2 ?? 0;
    }
    public add(dx: number, dy: number, dz: number): Vector3 {
        this.x += dx, this.y += dy, this.z += dz;
        return this;
    }
    public subtract(dx: number, dy: number, dz: number): Vector3 {
        this.x -= dx, this.y -= dy, this.z -= dz;
        return this;
    }
    public multiply(fx: number, fy: number, fz: number): Vector3 {
        this.x *= fx, this.y *= fy, this.z *= fz;
        return this;
    }
    public multiplyXYZ(f: number): Vector3 { return this.multiply(f, f, f) }
    public mag(): number {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
    }
    public normalize(): Vector3 {
        const d = this.mag();
        if(d != 0) this.multiplyXYZ(1 / d);
        return this;
    }
    public floor(): Vector3 {
        this.x = Math.floor(this.x),
        this.y = Math.floor(this.y),
        this.z = Math.floor(this.z);
        return this;
    }
    public rotate(angle: number, axis: Vector3): Vector3 {
        const norm = axis.copy().normalize();
        new Quat().setAroundAxis(norm.x, norm.y, norm.z, angle).rotate(this);
        return this;
    }
    public copy(): Vector3 { return new Vector3(this.x, this.y, this.z) }
    static fromEntity(ent: number): Vector3 {
        const pos = Entity.getPosition(ent);
        return new Vector3(pos.x, pos.y, pos.z);
    }
}
type AABB = [number, number, number, number, number, number];
class Cuboid6 {
    public min: Vector3;
    public max: Vector3;
    constructor(){
        this.min = new Vector3(), this.max = new Vector3();
    }
    public add(vec: Vector3): Cuboid6 {
        this.min.add(vec.x, vec.y, vec.z);
        this.max.add(vec.x, vec.y, vec.z);
        return this;
    }
    public expand(dx: number, dy: number, dz: number): Cuboid6 {
        this.min.subtract(dx, dy, dz);
        this.max.add(dx, dy, dz);
        return this;
    }
    public expandXYZ(d: number): Cuboid6 { return this.expand(d, d, d) }
    public aabb(): AABB {
        return [this.min.x, this.min.y, this.min.z, this.max.x, this.max.y, this.max.z];
    }
}

interface RedstoneSignalParams { power: number, signal: number, onLoad: boolean }

class TileEntityImplementation<T> implements TileEntity, TileEntity.TileEntityPrototype {

    public readonly useNetworkItemContainer = true;
    public readonly x: number;
    public readonly y: number;
    public readonly z: number;
    public readonly dimension: number;
    public readonly blockID: number;
    public readonly data: T;
    public readonly container: ItemContainer;
    public readonly liquidStorage: LiquidRegistry.Storage;
    public readonly isLoaded: boolean;
    public readonly remove: boolean;
    public selfDestroy(): void {}
    public sendPacket(name: string, data: any): void {}
    public readonly blockSource: BlockSource;
    public readonly networkData: SyncedNetworkData;
    public readonly networkEntity: NetworkEntity;
    public sendResponse(packetName: string, data: any): void {}
    public created(): void {}
    public events: {[packetName: string]: (data: any, extra: any) => void};
    public containerEvents: {[eventName: string]: (container: ItemContainer, window: Nullable<IWindow>, windowContent: Nullable<UI.WindowContent>, eventData: any) => void};
    public init(): void {}
    public tick(): void {}
    public click(id: number, count: number, data: number, coords: Callback.ItemUseCoordinates, player: number, extra: Nullable<ItemExtraData>): boolean | void {}
    public destroyBlock(coords: Callback.ItemUseCoordinates, player: number): void {}
    public redstone(params: RedstoneSignalParams): void {}
    public projectileHit(coords: Callback.ItemUseCoordinates, target: Callback.ProjectileHitTarget): void {}
    public destroy(): boolean | void {}
    /** @deprecated */
    public getGuiScreen(): IWindow { return }
    public getScreenName(player: number, coords: Vector): string { return }
    public getScreenByName(screenName?: string): IWindow { return }
    public requireMoreLiquid(liquid: string, amount: number): void {}
    constructor(public readonly defaultValues: T) {}
    
}
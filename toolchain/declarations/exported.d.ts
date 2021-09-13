declare interface AvaritiaNative {
    moveActorRelative(entity: number, x: number, y: number, z: number, a: number): void;
    isActorInWater(entity: number): boolean;
}

declare function WRAP_NATIVE(module: "AvaritiaNative"): AvaritiaNative;

declare namespace Callback {
    interface PlayerJumpFunction {
        (player: number): void;
    }
    function addCallback(callbackName: "PlayerJump", func: PlayerJumpFunction): void;
}

declare class NativeArrow {
    public getPointer(): number;
    public constructor(arrowEntity: number);
    public setDamage(damage: number): void;
    public setIsCritical(crit: boolean): void;
    public setKnockbackStrength(strength: number): void;
    public setFire(flameLevel: number): void;
    public shoot(x: number, y: number, z: number, pitch: number, yaw: number, ax: number, ay: number, az: number): void;
    public getDamage(): number;
}

declare function WRAP_JAVA(clazz: "ua.vsdum.avaritia.NativeArrow"): typeof NativeArrow;
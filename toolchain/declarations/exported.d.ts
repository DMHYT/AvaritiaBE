/// <reference path="android.d.ts" />

declare namespace Callback {
    interface PlayerJumpFunction {
        (player: number): void;
    }
    function addCallback(callbackName: "PlayerJump", func: PlayerJumpFunction): void;
}

declare class ____NativeArrow {
    public getPointer(): number;
    public constructor(arrowEntity: number);
    public setDamage(damage: number): void;
    public setIsCritical(crit: boolean): void;
    public setKnockbackStrength(strength: number): void;
    public setFire(flameLevel: number): void;
    public shoot(x: number, y: number, z: number, pitch: number, yaw: number, ax: number, ay: number, az: number): void;
    public getDamage(): number;
}
declare function WRAP_JAVA(clazz: "ua.vsdum.avaritia.NativeArrow"): typeof ____NativeArrow;

declare interface AvaritiaMainClass {
    nativeMoveActorRelative(entity: number, f1: number, f2: number, f3: number, f4: number): void;
    nativeIsActorInWater(entity: number): boolean;
    nativeRemoveHarmfulEffectsFrom(entity: number): void;
    boot(something: java.util.HashMap<any, any>): void;
    onPlayerJump(uid: number): void;
}
declare function WRAP_JAVA(clazz: "ua.vsdum.avaritia.Avaritia"): AvaritiaMainClass;
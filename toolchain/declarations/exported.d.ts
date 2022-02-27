/// <reference path="core-engine.d.ts" />

declare namespace Callback {
    interface PlayerJumpFunction {
        (player: number): void;
    }
    interface PlayerGameModeChangedFunction {
        (mode: number): void;
    }
    function addCallback(callbackName: "PlayerJump", func: PlayerJumpFunction): void;
    function addCallback(callbackName: "PlayerGameModeChanged", func: PlayerGameModeChangedFunction): void;
}

declare class ____NativeArrow {
    constructor(arrowEntity: number);
    setPower(power: number): void;
    setIsCritical(crit: boolean): void;
    setKnockbackStrength(strength: number): void;
    setFire(flameLevel: number): void;
    setIsCreative(creative: boolean): void;
    setOwner(owner: number): void;
    getOwner(): number;
    shoot(yaw: number, pitch: number, power: number, inaccuracy: number, shooter: number): void;
}
declare function WRAP_JAVA(clazz: "vsdum.avaritia.NativeArrow"): typeof ____NativeArrow;

declare interface AvaritiaMainClass {
    nativeSetUndestroyableItem(id: number): void;
    nativeRemoveHarmfulEffectsFrom(entity: number): void;
    nativeSetFullAirSupply(entity: number): void;
    nativeIsPlayerInWater(): boolean;
    nativeIsPlayerFlying(): boolean;
    nativeIsPlayerOnGround(): boolean;
    nativeIsPlayerSneaking(): boolean;
    moveActorRelative(strafe: number, up: number, forward: number, friction: number): void;
    nativeGetPlayerMoveForward(): number;
    nativeIsPlayerUsingItem(): boolean;
}
declare function WRAP_JAVA(clazz: "vsdum.avaritia.Avaritia"): AvaritiaMainClass;
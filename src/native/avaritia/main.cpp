#include <vector>
#include <string.h>
#include <hook.h>
#include <logger.h>
#include <symbol.h>
#include <innercore_callbacks.h>
#include <nativejs.h>
#include <jni.h>
#include <horizon/item.h>
#include <stl/vector>
#include <innercore/idconversion.h>
#include <innercore/vtable.h>
#include "recovered.hpp"


class AvaritiaModule : public Module {
	public:
	static jclass ava_class;
	static std::vector<int> undestroyable;
	AvaritiaModule(): Module("avaritia") {}
	virtual void initialize() {
		Callbacks::addCallback("postModItemsInit", CALLBACK([], (), {
			for (int static_id : undestroyable) {
				int dynamic_id = IdConversion::staticToDynamic(static_id, IdConversion::Scope::ITEM);
				Item* item = ItemRegistry::getItemById(dynamic_id);
				VTABLE_FIND_OFFSET(Item_setExplodable, _ZTV4Item, _ZN4Item13setExplodableEb);
				VTABLE_CALL<void>(Item_setExplodable, item, false);
				VTABLE_FIND_OFFSET(Item_setFireResistant, _ZTV4Item, _ZN4Item16setFireResistantEb);
				VTABLE_CALL<void>(Item_setFireResistant, item, true);
				VTABLE_FIND_OFFSET(Item_setShouldDespawn, _ZTV4Item, _ZN4Item16setShouldDespawnEb);
				VTABLE_CALL<void>(Item_setShouldDespawn, item, false);
			}
			undestroyable.clear();
		})); 
		DLHandleManager::initializeHandle("libminecraftpe.so", "mcpe");
		HookManager::addCallback(SYMBOL("mcpe", "_ZN6Player14jumpFromGroundEv"), LAMBDA((Player* player), {
			if(ava_class != nullptr) {
				JavaCallbacks::invokeCallback(ava_class, "onPlayerJump", "(J)V", (jlong) (player->getUniqueID()->id));
			}
		}, ), HookManager::CALL | HookManager::LISTENER);
		HookManager::addCallback(SYMBOL("mcpe", "_ZNK5Actor12isFireImmuneEv"), LAMBDA((HookManager::CallbackController* controller, Actor* actor), {
			VTABLE_FIND_OFFSET(Actor_getArmor, _ZTV5Actor, _ZNK5Actor8getArmorE9ArmorSlot);
			ItemStack* stack = VTABLE_CALL<ItemStack*>(Actor_getArmor, actor, ArmorSlot::leggings);
			if(stack != nullptr) {
				Item* item = stack->getItem();
				if(item != nullptr) {
					if(strcmp(item->nameId.c_str(), "item_infinity_leggings") == 0) {
						controller->replace();
						return true;
					}
				}
			}
		}, ), HookManager::CALL | HookManager::LISTENER | HookManager::CONTROLLER | HookManager::RESULT);
	}
};
jclass AvaritiaModule::ava_class = nullptr;
std::vector<int> AvaritiaModule::undestroyable;


MAIN {
	Module* main_module = new AvaritiaModule();
}


extern "C" {

	JNIEXPORT void JNICALL Java_vsdum_avaritia_Avaritia_initJNI
	(JNIEnv* env, jclass clazz) {
		AvaritiaModule::ava_class = (jclass) env->NewGlobalRef(clazz);
	}
	JNIEXPORT void JNICALL Java_vsdum_avaritia_Avaritia_nativeSetUndestroyableItem
	(JNIEnv*, jclass, jint id) {
		AvaritiaModule::undestroyable.push_back(id);
	}
	JNIEXPORT void JNICALL Java_vsdum_avaritia_Avaritia_nativeRemoveHarmfulEffectsFrom
	(JNIEnv*, jclass, jlong entity) {
		Actor* actor = Actor::wrap(entity);
		if(actor != nullptr) {
			std::__ndk1::vector<MobEffectInstance>& effects = actor->getAllEffects();
			for(MobEffectInstance& ieffect : effects) {
				int id = ieffect.getId();
				MobEffect* effect = MobEffect::getById(id);
				if(effect != nullptr && effect->isHarmful()) {
					actor->removeEffect(id);
				}
			}
		}
	}
	JNIEXPORT void JNICALL Java_vsdum_avaritia_Avaritia_nativeSetFullAirSupply
	(JNIEnv*, jclass, jlong entity) {
		Actor* actor = Actor::wrap(entity);
		if(actor != nullptr) {
			BreathableComponent* breathable = actor->tryGetComponent<BreathableComponent>();
			if(breathable != nullptr) {
				breathable->setAirSupply(breathable->getMaxAirSupply());
			}
		}
	}
	JNIEXPORT jboolean JNICALL Java_vsdum_avaritia_Avaritia_nativeIsPlayerInWater
	(JNIEnv*, jclass) {
		return GlobalContext::getLocalPlayer()->isInWater();
	}
	JNIEXPORT jboolean JNICALL Java_vsdum_avaritia_Avaritia_nativeIsPlayerFlying
	(JNIEnv*, jclass) {
		return GlobalContext::getLocalPlayer()->isFlying();
	}
	JNIEXPORT jboolean JNICALL Java_vsdum_avaritia_Avaritia_nativeIsPlayerOnGround
	(JNIEnv*, jclass) {
		return GlobalContext::getLocalPlayer()->onGround;
	}
	JNIEXPORT jboolean JNICALL Java_vsdum_avaritia_Avaritia_nativeIsPlayerSneaking
	(JNIEnv*, jclass) {
		return GlobalContext::getLocalPlayer()->isSneaking();
	}
	JNIEXPORT jfloat JNICALL Java_vsdum_avaritia_Avaritia_nativeGetPlayerMoveForward
	(JNIEnv*, jclass) {
		return GlobalContext::getLocalPlayer()->getMoveInputHandler().movingForward;
	}
	
	JNIEXPORT jlong JNICALL Java_vsdum_avaritia_NativeArrow_nativeGetForEntity
	(JNIEnv*, jclass, jlong entity) {
		Actor* actor = Actor::wrap(entity);
		if(actor != nullptr) {
			Arrow* arrow = dynamic_cast<Arrow*>(actor);
			if(arrow != nullptr) {
				return (jlong) arrow;
			}
		}
		return 0;
	}
	JNIEXPORT void JNICALL Java_vsdum_avaritia_NativeArrow_nativeSetDamage
	(JNIEnv*, jclass, jlong ptr, jfloat damage) {
		Arrow* arrow = (Arrow*) ptr;
		arrow->setBaseDamage(damage);
	}
	JNIEXPORT void JNICALL Java_vsdum_avaritia_NativeArrow_nativeSetIsCritical
	(JNIEnv*, jclass, jlong ptr, jboolean critical) {
		Arrow* arrow = (Arrow*) ptr;
		arrow->setCritical(critical);
	}
	JNIEXPORT void JNICALL Java_vsdum_avaritia_NativeArrow_nativeSetKnockbackStrength
	(JNIEnv*, jclass, jlong ptr, jint strength) {
		Arrow* arrow = (Arrow*) ptr;
		arrow->setEnchantPunch(strength);
	}
	JNIEXPORT void JNICALL Java_vsdum_avaritia_NativeArrow_nativeSetFire
	(JNIEnv*, jclass, jlong ptr, jint flame) {
		Arrow* arrow = (Arrow*) ptr;
		arrow->setEnchantFlame(flame);
	}
	JNIEXPORT void JNICALL Java_vsdum_avaritia_NativeArrow_nativeShoot
	(JNIEnv*, jclass, jlong ptr, jfloat x, jfloat y, jfloat z, jfloat pitch, jfloat yaw, jfloat ax, jfloat ay, jfloat az) {
		Arrow* arrow = (Arrow*) ptr;
		Vec3 pos(BlockPos(x, y, z));
		Vec3 acceleration(BlockPos(ax, ay, az));
		arrow->shoot(pos, pitch, yaw, acceleration);
	}
	JNIEXPORT jfloat JNICALL Java_vsdum_avaritia_NativeArrow_nativeGetDamage
	(JNIEnv*, jclass, jlong ptr) {
		Arrow* arrow = (Arrow*) ptr;
		return arrow->getBaseDamage();
	}
	
}
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
		HookManager::addCallback(SYMBOL("mcpe", "_ZN11LocalPlayer17setPlayerGameTypeE8GameType"), LAMBDA((LocalPlayer* player, GameType mode), {
			if(ava_class != nullptr) {
				JavaCallbacks::invokeCallback(ava_class, "onPlayerGameModeChanged", "(I)V", (jint) mode);
			}
		}, ), HookManager::RETURN | HookManager::LISTENER);
		HookManager::addCallback(SYMBOL("mcpe", "_ZN5Actor13setStatusFlagE10ActorFlagsb"), LAMBDA((HookManager::CallbackController* controller, ActorFlags flag, bool b), {
			if(flag == 21 && !b) {
				VTABLE_FIND_OFFSET(Actor_getArmor, _ZTV5Actor, _ZNK5Actor8getArmorE9ArmorSlot);
				ItemStack* stack = VTABLE_CALL<ItemStack*>(Actor_getArmor, GlobalContext::getLocalPlayer(), ArmorSlot::chestplate);
				if(stack != nullptr) {
					Item* item = stack->getItem();
					if(item != nullptr) {
						if(strcmp(item->nameId.c_str(), "item_infinity_chestplate") == 0) {
							Logger::debug("AVARITIA", "HERE TO REPLACE!");
						}
					}
				}
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
		HookManager::addCallback(SYMBOL("mcpe", "_ZN5Actor4hurtERK17ActorDamageSourceibb"), LAMBDA((HookManager::CallbackController* controller, Actor* actor, ActorDamageSource const& damageSource, int damage, bool b1, bool b2), {
			if(preventDamageByChestplate(controller, actor)) {
				return 0;
			}
		}, ), HookManager::CALL | HookManager::LISTENER | HookManager::CONTROLLER);
		HookManager::addCallback(SYMBOL("mcpe", "_ZN3Mob11hurtEffectsERK17ActorDamageSourceibb"), LAMBDA((HookManager::CallbackController* controller, Mob* mob, ActorDamageSource const& damageSource, int damage, bool b1, bool b2), {
			if(preventDamageByChestplate(controller, mob)) {
				return 0;
			}
		}, ), HookManager::CALL | HookManager::LISTENER | HookManager::CONTROLLER);
		HookManager::addCallback(SYMBOL("mcpe", "_ZN3Mob4killEv"), LAMBDA((HookManager::CallbackController* controller, Mob* actor), {
			VTABLE_FIND_OFFSET(Actor_getArmor, _ZTV5Actor, _ZNK5Actor8getArmorE9ArmorSlot);
			ItemStack* helmet = VTABLE_CALL<ItemStack*>(Actor_getArmor, actor, ArmorSlot::helmet);
			ItemStack* chestplate = VTABLE_CALL<ItemStack*>(Actor_getArmor, actor, ArmorSlot::chestplate);
			ItemStack* leggings = VTABLE_CALL<ItemStack*>(Actor_getArmor, actor, ArmorSlot::leggings);
			ItemStack* boots = VTABLE_CALL<ItemStack*>(Actor_getArmor, actor, ArmorSlot::boots);
			if(helmet != nullptr && chestplate != nullptr && leggings != nullptr && boots != nullptr) {
				Item* helmetItem = helmet->getItem();
				Item* chestplateItem = chestplate->getItem();
				Item* leggingsItem = leggings->getItem();
				Item* bootsItem = boots->getItem();
				if(helmetItem != nullptr && chestplateItem != nullptr && leggingsItem != nullptr && bootsItem != nullptr) {
					if(strcmp(helmetItem->nameId.c_str(), "item_infinity_helmet") == 0 &&
					strcmp(chestplateItem->nameId.c_str(), "item_infinity_chestplate") == 0 &&
					strcmp(leggingsItem->nameId.c_str(), "item_infinity_leggings") == 0 &&
					strcmp(bootsItem->nameId.c_str(), "item_infinity_boots") == 0) {
						controller->prevent();
						actor->heal(actor->getMaxHealth());
						return 0;
					}
				}
			}
		}, ), HookManager::CALL | HookManager::LISTENER | HookManager::CONTROLLER);
		HookManager::addCallback(SYMBOL("mcpe", "_ZN13ItemStackBase12hurtAndBreakEiP5Actor"), LAMBDA((HookManager::CallbackController* controller, ItemStackBase* stack, int value, Actor* actor), {
			Item* item = stack->getItem();
			if(item != nullptr) {
				const char* nameId = item->nameId.c_str();
				if(
				strcmp(nameId, "item_infinity_helmet") == 0 ||
				strcmp(nameId, "item_infinity_chestplate") == 0 ||
				strcmp(nameId, "item_infinity_leggings") == 0 ||
				strcmp(nameId, "item_infinity_boots") == 0
				) {
					controller->prevent();
					return 0;
				}
			}
		}, ), HookManager::CALL | HookManager::LISTENER | HookManager::CONTROLLER);
		HookManager::addCallback(SYMBOL("mcpe", "_ZN6Player14setCarriedItemERK9ItemStack"), LAMBDA((Player* actor, ItemStack const& stack), {
			Item* item = stack.getItem();
			if(item != nullptr) {
				const char* nameId = item->nameId.c_str();
				if(
				strcmp(nameId, "item_infinity_sword") == 0 ||
				strcmp(nameId, "item_infinity_axe") == 0 ||
				strcmp(nameId, "item_infinity_pickaxe") == 0 ||
				strcmp(nameId, "item_infinity_hammer") == 0 ||
				strcmp(nameId, "item_infinity_shovel") == 0 ||
				strcmp(nameId, "item_infinity_destroyer") == 0 ||
				strcmp(nameId, "item_infinity_hoe") == 0
				) {
					((ItemStack&) stack).setDamageValue(0);
				}
			}
		}, ), HookManager::CALL | HookManager::LISTENER);
	}
	static bool preventDamageByChestplate(HookManager::CallbackController* controller, Actor* actor) {
		VTABLE_FIND_OFFSET(Actor_getArmor, _ZTV5Actor, _ZNK5Actor8getArmorE9ArmorSlot);
		ItemStack* stack = VTABLE_CALL<ItemStack*>(Actor_getArmor, actor, ArmorSlot::chestplate);
		if(stack != nullptr) {
			Item* item = stack->getItem();
			if(item != nullptr) {
				if(strcmp(item->nameId.c_str(), "item_infinity_chestplate") == 0) {
					controller->prevent();
					return true;
				}
			}
		}
		return false;
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
	JNIEXPORT jboolean JNICALL Java_vsdum_avaritia_Avaritia_nativeIsPlayerUsingItem
	(JNIEnv*, jclass) {
		return GlobalContext::getLocalPlayer()->isUsingItem();
	}
	
	JNIEXPORT jboolean JNICALL Java_vsdum_avaritia_NativeArrow_nativeIsArrowEntity
	(JNIEnv*, jclass, jlong entity) {
		Arrow* arrow = (Arrow*) Actor::wrap(entity);
		if(arrow != nullptr) {
			ProjectileComponent* proj = arrow->tryGetComponent<ProjectileComponent>();
			if(proj != nullptr) {
				return true;
			}
		}
		return false;
	}
	JNIEXPORT void JNICALL Java_vsdum_avaritia_NativeArrow_nativeSetPower
	(JNIEnv*, jclass, jlong entity, jint power) {
		Arrow* arrow = (Arrow*) Actor::wrap(entity);
		if(arrow != nullptr) {
			ProjectileComponent* proj = arrow->tryGetComponent<ProjectileComponent>();
			if(proj != nullptr) {
				arrow->setEnchantPower(power);
			}
		}
	}
	JNIEXPORT void JNICALL Java_vsdum_avaritia_NativeArrow_nativeSetIsCritical
	(JNIEnv*, jclass, jlong entity, jboolean critical) {
		Arrow* arrow = (Arrow*) Actor::wrap(entity);
		if(arrow != nullptr) {
			ProjectileComponent* proj = arrow->tryGetComponent<ProjectileComponent>();
			if(proj != nullptr) {
				arrow->setCritical(critical);
			}
		}
	}
	JNIEXPORT void JNICALL Java_vsdum_avaritia_NativeArrow_nativeSetKnockbackStrength
	(JNIEnv*, jclass, jlong entity, jint strength) {
		Arrow* arrow = (Arrow*) Actor::wrap(entity);
		if(arrow != nullptr) {
			ProjectileComponent* proj = arrow->tryGetComponent<ProjectileComponent>();
			if(proj != nullptr) {
				arrow->setEnchantPunch(strength);
			}
		}
	}
	JNIEXPORT void JNICALL Java_vsdum_avaritia_NativeArrow_nativeSetFire
	(JNIEnv*, jclass, jlong entity, jint flame) {
		Arrow* arrow = (Arrow*) Actor::wrap(entity);
		if(arrow != nullptr) {
			ProjectileComponent* proj = arrow->tryGetComponent<ProjectileComponent>();
			if(proj != nullptr) {
				arrow->setEnchantFlame(flame);
			}
		}
	}
	JNIEXPORT void JNICALL Java_vsdum_avaritia_NativeArrow_nativeSetIsCreative
	(JNIEnv*, jclass, jlong entity, jboolean creative) {
		Arrow* arrow = (Arrow*) Actor::wrap(entity);
		if(arrow != nullptr) {
			ProjectileComponent* proj = arrow->tryGetComponent<ProjectileComponent>();
			if(proj != nullptr) {
				arrow->setIsCreative(creative);
			}
		}
	}
	JNIEXPORT void JNICALL Java_vsdum_avaritia_NativeArrow_nativeSetOwner
	(JNIEnv*, jclass, jlong entity, jlong owner) {
		Arrow* arrow = (Arrow*) Actor::wrap(entity);
		Actor* shooter = Actor::wrap(owner);
		if(arrow != nullptr && shooter != nullptr) {
			ProjectileComponent* proj = arrow->tryGetComponent<ProjectileComponent>();
			if(proj != nullptr) {
				ActorUniqueID* id = shooter->getUniqueID();
				arrow->setIsPlayerOwned(true);
				arrow->setOwner(*id);
			}
		}
	}
	JNIEXPORT jlong JNICALL Java_vsdum_avaritia_NativeArrow_nativeGetOwner
	(JNIEnv*, jclass, jlong entity) {
		Arrow* arrow = (Arrow*) Actor::wrap(entity);
		if(arrow != nullptr) {
			Actor* owner = arrow->getOwner();
			if(owner != nullptr) {
				return owner->getUniqueID()->id;
			}
		}
		return 0;
	}
	JNIEXPORT void JNICALL Java_vsdum_avaritia_NativeArrow_nativeShoot
	(JNIEnv*, jclass, jlong entity, jfloat pitch, jfloat yaw, jfloat power, jfloat inaccuracy, jlong player) {
		Arrow* arrow = (Arrow*) Actor::wrap(entity);
		if(arrow != nullptr) {
			Actor* shooter = Actor::wrap(player);
			if(shooter != nullptr) {
				ProjectileComponent* proj = arrow->tryGetComponent<ProjectileComponent>();
				if(proj != nullptr) {
					Vec3 facing(0.0, 0.0, 0.0);
					facing.directionFromRotation(pitch, yaw);
					facing.y = -facing.y;
					Vec3 someAnotherVec(0.0, 0.0, 0.0);
					proj->shoot(*arrow, facing, power, inaccuracy, someAnotherVec, shooter);
				}
			}
		}
	}
	
}
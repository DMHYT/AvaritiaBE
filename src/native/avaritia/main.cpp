#include <regex>
#include <string.h>
#include <mod.h>
#include <hook.h>
#include <logger.h>
#include <symbol.h>
#include <jni.h>
#include <horizon/item.h>
#include <innercore_callbacks.h>
#include <innercore/idconversion.h>
#include <innercore/vtable.h>
#include "recovered.hpp"


class AvaritiaModule : public Module {
	public:
	static void _swordInfinityDamage(Item* _this, ItemStackBase const& stack, Level& level, std::__ndk1::string& text, bool someBool) {
		STATIC_SYMBOL(Item_appendFormattedHovertext, "_ZNK4Item24appendFormattedHovertextERK13ItemStackBaseR5LevelRNSt6__ndk112basic_stringIcNS5_11char_traitsIcEENS5_9allocatorIcEEEEb", (Item*, ItemStackBase const&, Level&, std::__ndk1::string&, bool));
		Item_appendFormattedHovertext(_this, stack, level, text, someBool);
		text.append("\n\n§9+§cI§6n§ef§ai§bn§1i§dt§cy §9");
		text.append(I18n::get("attribute.name.generic.attackDamage"));
		text.append("§r");
	}
	AvaritiaModule(): Module("avaritia") {}
	virtual void initialize() {
		Callbacks::addCallback("postModItemsInit", CALLBACK([], (), {
			Item* sword = ItemRegistry::getItemByName("item_infinity_sword");
			if(sword != nullptr) {
				void** vtable = *(void***) sword;
				vtable[
					getVtableOffset("_ZTV10WeaponItem", "_ZNK10WeaponItem24appendFormattedHovertextERK13ItemStackBaseR5LevelRNSt6__ndk112basic_stringIcNS5_11char_traitsIcEENS5_9allocatorIcEEEEb")
				] = ADDRESS(_swordInfinityDamage);
			}
		}));
		DLHandleManager::initializeHandle("libminecraftpe.so", "mcpe");
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
				strcmp(nameId, "item_infinity_boots") == 0 ||
				strcmp(nameId, "item_infinity_sword") == 0 ||
				strcmp(nameId, "item_infinity_axe") == 0 ||
				strcmp(nameId, "item_infinity_pickaxe") == 0 ||
				strcmp(nameId, "item_infinity_hammer") == 0 ||
				strcmp(nameId, "item_infinity_shovel") == 0 ||
				strcmp(nameId, "item_infinity_destroyer") == 0 ||
				strcmp(nameId, "item_infinity_hoe") == 0
				) {
					controller->prevent();
					return 0;
				}
			}
		}, ), HookManager::CALL | HookManager::LISTENER | HookManager::CONTROLLER | HookManager::RESULT);
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


MAIN {
	Module* main_module = new AvaritiaModule();
}


extern "C" {
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
#include <stl/vector>
#include <stl/string>

#ifndef AVARITIA_RECOVERED_HPP
#define AVARITIA_RECOVERED_HPP


class HashedString {
    public:
    char filler[20];
    const char* c_str() const;
};

class Item {
    public:
    char filler1[90];
    int16_t id;
    char filler2[12];
    HashedString nameId;
};

class I18n {
    public:
    static std::__ndk1::string get(std::__ndk1::string const&);
};

class MobEffect {
    public:
    bool isHarmful() const;
    static MobEffect* getById(int);
};

class MobEffectInstance {
    public:
    int getId() const;
};

class ActorUniqueID {
    public:
    long long id;
};

class MoveInputHandler {
    public:
    char filler1[4]; // 4 bytes
    float movingLeft; // 8 bytes
    float movingForward; // 12 bytes
};


class Vec2 { public: float x, y; };
class Vec3 {
    public:
    float x, y, z;
    Vec3(float, float, float);
    void directionFromRotation(float pitch, float yaw);
    void directionFromRotation(Vec2 const&);
    Vec3& operator-(Vec3 const&) const;
};

class ItemStackBase {
    public:
    Item* getItem() const;
    void setDamageValue(short);
};

class ItemStack : public ItemStackBase {
    public:
};

enum ArmorSlot {
    helmet, chestplate, leggings, boots
};

class SynchedActorData {public:};
enum ActorFlags: int {};

class Level;
class BlockSource;
class Actor {
    public:
    char filler1[372];
    bool onGround;
    ActorUniqueID* getUniqueID() const;
    virtual bool isInWater() const;
    virtual bool isOnFire() const;
    virtual void setOnFire(int) const;
    virtual void heal(int);
    virtual ItemStack* getCarriedItem() const;
    std::__ndk1::vector<MobEffectInstance>& getAllEffects() const;
    void removeEffect(int);
    bool isSneaking() const;
    int getMaxHealth() const;
    Actor* getOwner() const;
    void setOwner(ActorUniqueID);
    Level* getLevel() const;
    BlockSource* getRegion() const;
    Vec2& getRotation() const;
    template<typename COMPONENT>
    COMPONENT* tryGetComponent();
    static Actor* wrap(long long);
};

class BreathableComponent {
    public:
    short getMaxAirSupply() const;
    void setAirSupply(short);
};
class ProjectileComponent {
    public:
    void shoot(Actor&, Vec3 const&, float, float, Vec3 const&, Actor*);
};

class Mob : public Actor {
    public:
    virtual void setOnFire(int) const;
};

enum GameType {
    survival, creative, adventure, spectator
};

class Player : public Mob {
    public:
    virtual ItemStack* getCarriedItem() const;
    virtual bool isLocalPlayer() const;
    bool isUsingItem() const;
};

class LocalPlayer : public Player {
    public:
    virtual bool isLocalPlayer() const;
    MoveInputHandler& getMoveInputHandler();
    bool isFlying() const;
};

class ActorDamageSource;

class AbstractArrow {
    public:
    virtual void shoot(Vec3 const&, float, float, Vec3 const&);
    void setIsPlayerOwned(bool);
    void setIsCreative(bool);
    float getBaseDamage();
};

class Arrow : public Actor, public AbstractArrow {
    public:
    virtual void shoot(Vec3 const& facing, float power, float inaccuracy, Vec3 const& someAnotherVec);
    void setEnchantPower(int);
    void setEnchantFlame(int);
    void setCritical(bool);
    void setEnchantPunch(int);
};

enum ActorType : int {};
class ActorDefinitionIdentifier {
    public:
    ActorDefinitionIdentifier(ActorType);
    ActorDefinitionIdentifier(std::__ndk1::string, std::__ndk1::string, std::__ndk1::string);
    std::__ndk1::string const& getIdentifier() const;
    std::__ndk1::string const& getFullName() const;
};

class Spawner {
    public:
    Actor* spawnProjectile(BlockSource&, ActorDefinitionIdentifier const&, Actor*, Vec3 const&, Vec3 const&);
};

class Level {
    public:
    Spawner* getSpawner() const;
    bool isClientSide() const;
};

class ServerLevel : public Level {
    public:
};

namespace GlobalContext {
    Level* getLevel();
    ServerLevel* getServerLevel();
    LocalPlayer* getLocalPlayer();
}

#define STATIC_SYMBOL(VAR_NAME, SYMBOL_NAME, PARAM_TYPES) \
    static void* (*VAR_NAME) PARAM_TYPES = nullptr; \
    if(VAR_NAME == nullptr) { \
        VAR_NAME = (void* (*) PARAM_TYPES) SYMBOL("mcpe", SYMBOL_NAME); \
        Logger::debug("InnerCore-StaticSymbols", "initialized static symbol %s with pointer %p", SYMBOL_NAME, VAR_NAME); \
    }


#endif //AVARITIA_RECOVERED_HPP
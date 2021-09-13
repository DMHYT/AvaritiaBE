#ifndef AVARITIA_RECOVERED_HPP
#define AVARITIA_RECOVERED_HPP


class ActorUniqueID {
    public:
    long long id;
    ActorUniqueID(long long id): id(id) {}
    operator long long() const {
        return this->id;
    }
};
class Actor {
    public:
    virtual ~Actor();
    ActorUniqueID* getUniqueID() const;
    void moveRelative(float, float, float, float);
    bool isInWater() const;
};
class Mob : public Actor {
    public:
};
class Player : public Mob {
    public:
};
class BlockPos {
    public:
    BlockPos(float, float, float);
    BlockPos(double, double, double);
};
class Vec3 {
    public:
    Vec3(BlockPos const&);
};
class AbstractArrow {
    public:
    virtual void shoot(Vec3 const&, float, float, Vec3 const&);
    void setBaseDamage(float);
    void setIsCreative(bool);
    void setIsPlayerOwned(bool);
    float getBaseDamage();
};
class Arrow : public Actor, public AbstractArrow {
    public:
    virtual void shoot(Vec3 const&, float, float, Vec3 const&);
    void setEnchantFlame(int);
    void setCritical(bool);
    void setEnchantPunch(int);
};
class Level {
    public:
    Actor* fetchEntity(ActorUniqueID, bool) const;
};
namespace GlobalContext {
    Level* getLevel();
}


#endif //AVARITIA_RECOVERED_HPP
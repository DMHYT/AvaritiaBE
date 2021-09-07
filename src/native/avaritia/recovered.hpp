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
class Level {
    public:
    Actor* fetchEntity(ActorUniqueID, bool) const;
};
namespace GlobalContext {
    Level* getLevel();
}


#endif //AVARITIA_RECOVERED_HPP
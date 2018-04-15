var roleUpgrader = {

  /** @param {Creep} creep **/
  run: function(creep) {

    var recharging = creep.memory.recharging;

    if (!recharging && creep.carry.energy == 0)
      creep.memory.recharging=true;
    if (recharging && creep.carry.energy == creep.carryCapacity)
      creep.memory.recharging=false;
    
    if(creep.memory.recharging) {
      console.log('Recharging');
      var sources = creep.room.find(FIND_SOURCES);
      var target = creep.pos.findClosestByRange(sources);
      if(creep.harvest(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
      }
    }
    else {
      if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller);
      }
    }
  }
};

module.exports = roleUpgrader;

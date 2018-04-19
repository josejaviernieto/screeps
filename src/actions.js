var actions = {
  ACTION_CHARGE : 0,
  ACTION_BUILD : 1,
  ACTION_UPGRADE : 2,
  ACTION_DISCHARGE : 3,
  // In this action the creep take energy from a nearby source
  charge: function (creep) {
    var target;
    if (creep.memory.target==null) {
      var sources = creep.room.find(FIND_SOURCES);
      target = creep.pos.findClosestByRange(sources);
      creep.memory.target=target.id;
    } else {
      target = Game.getObjectById(creep.memory.target);
    }
    if(creep.harvest(target) == ERR_NOT_IN_RANGE) {
      creep.moveTo(target);
    }
    return (creep.carry.energy == creep.carryCapacity)
  },


  // In this action the creep put energy on a structure.
  discharge: function(creep){
    var target;
    if (creep.memory.target==null) {
    var targets = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN  || structure.structureType == STRUCTURE_TOWER ) &&
	       structure.energy < structure.energyCapacity;
      }
    })
      if(targets.length>0) {
	target=targets[0];
	creep.memory.target= target.id;
      } else return true;
    } else target= Game.getObjectById(creep.memory.target);
    if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      creep.moveTo(target);
    }
    return (creep.carry.energy == 0);
  },

  
  // In this action the creep build a construction site;
  build: function(creep){
    var target
    if (creep.memory.target == null) {
      var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
      if(targets.length) {
	target=targets[0];
	creep.memory.target= target.id;
      }
    } else target = Game.getObjectById(creep.memory.target);
    if(creep.build(target) == ERR_NOT_IN_RANGE) {
      creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
    }
    return (creep.carry.energy == 0);
  },

	
  // In this action the creep will upgrade the controller;
  upgrade: function(creep){
    if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
      creep.moveTo(creep.room.controller);
    }
    return (creep.carry.energy == 0);
  }
}

module.exports= actions;

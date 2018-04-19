const ACTION_CHARGE = 'charge';
var actions = {
  
  charge: function (creep) {
    console.log('charging');
    var sources = creep.room.find(FIND_SOURCES);
    var target = creep.pos.findClosestByRange(sources);
    if(creep.harvest(target) == ERR_NOT_IN_RANGE) {
      creep.moveTo(target);
    }
    return (creep.carry.energy == creep.carryCapacity)
  },

  discharge: function(creep){
    var targets = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN  || structure.structureType == STRUCTURE_TOWER ) &&
	       structure.energy < structure.energyCapacity;
      }
    })
    
    if(targets.length>0) {
      if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[0]);
      }
    }
    return (creep.carry.energy == 0);
  },

  build: function(creep){
    var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
    if(targets.length) {
      if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
      }
    }
    return (creep.carry.energy == 0);
  },
  upgrade: function(creep){
    if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
      creep.moveTo(creep.room.controller);
    }
    return (creep.carry.energy == 0);
  }
}

module.exports= actions;

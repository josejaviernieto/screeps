var actions = {
  ACTION_CHARGE: 0,
  ACTION_BUILD: 1,
  ACTION_UPGRADE: 2,
  ACTION_DISCHARGE: 3,
  ACTION_HARVEST: 4,
  ACTION_MOVE: 5,
  // In this action the creep take energy from a nearby source
  charge: function (creep) {
    console.log(creep.name+' charging');
    var target;
    if (creep.memory.target==null || creep.memory.target== undefined) {
      var containers = creep.room.find(FIND_STRUCTURES,{filter: (i)=> i.structureType == STRUCTURE_CONTAINER &&
								    i.store[RESOURCE_ENERGY] > 0
      });
      var sources;
      var links= creep.room.find(FIND_MY_STRUCTURES, { filter: (structure) => {return structure.structureType== STRUCTURE_LINK }});
      if (!containers){
	this.harvest(creep);
      } else if(!creep.room.storage){
	sources = containers;
      } else if(!links) {
	sources = creep.room.storage;
      }
      target = creep.pos.findClosestByRange(sources);
      if (target != null){
	creep.memory.target=target.id;
      }
    } else {
      target = Game.getObjectById(creep.memory.target);
    }
    switch (creep.withdraw(target,RESOURCE_ENERGY)){
      case ERR_NOT_IN_RANGE:
	creep.moveTo(target);
	break;
      case ERR_NOT_ENOUGH_RESOURCES:
	creep.memory.target=null;
      case ERR_INVALID_TARGET:
	actions.harvest(creep);
    }
  return (creep.carry.energy == creep.carryCapacity)
  },
  
  harvest: function (creep) {
    console.log(creep.name+' harvesting');
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
    return (creep.carry.energy == creep.carryCapacity && creep.carryCapacity>0)
  },


  // In this action the creep put energy on a structure.
  discharge: function(creep){
    console.log(creep.name+' discharging');    
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
    switch (creep.transfer(target, RESOURCE_ENERGY)) {
      case ERR_NOT_IN_RANGE:
	creep.moveTo(target);
	break;
      case ERR_FULL:
	creep.memory.target=null;
	break;
    }
    return (creep.carry.energy == 0);
  },

  
  // In this action the creep build a construction site;
  build: function(creep){
    console.log(creep.name+' Building');
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
    console.log(creep.name+' upgrading');
    if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
      creep.moveTo(creep.room.controller);
    }
    return (creep.carry.energy == 0);
  },
  move:function(creep){
    console.log(creep.name+' moving');
    if (creep.memory.target != null){
    target =Game.getObjectById(creep.memory.target);
    creep.moveTo(target);
      return (creep.pos.x == target.pos.x)&& (creep.pos.y == target.pos.y);}
    else return true;
  }
}

module.exports= actions;

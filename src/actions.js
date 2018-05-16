var actions = {
  ACTION_CHARGE: 0,
  ACTION_BUILD: 1,
  ACTION_UPGRADE: 2,
  ACTION_DISCHARGE: 3,
  ACTION_HARVEST: 4,
  ACTION_MOVE: 5,
  ACTION_REPAIR: 6,
  ACTION_PICKUP: 7,
  ACTION_RENEW:8,
  // In this action the creep take energy from a nearby source
  charge: function (creep) {
//    console.log(creep.name+' charging');
    var target;
    if (creep.memory.target==null || creep.memory.target== undefined) {
      var containers = creep.room.find(FIND_STRUCTURES,{filter: (i)=> i.structureType == STRUCTURE_CONTAINER &&
								    i.store[RESOURCE_ENERGY] > 0
      });
      var links= creep.room.find(FIND_MY_STRUCTURES, { filter: (structure) => {return structure.structureType== STRUCTURE_LINK }});
      if (creep.room.storage != undefined && creep.room.storage.store[RESOURCE_ENERGY]>0) {
//	console.log('Hay Storage');
	creep.memory.target= creep.room.storage.id;
	target = creep.room.storage;
      }
      
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
	break;
      case OK:
	creep.memory.target=null;
	break;
    }
    return (creep.carry.energy == creep.carryCapacity)
  },
  
  harvest: function (creep,target = null) {
    //  console.log(creep.name+' harvesting');
    if (target==null){
//      console.log('target no asignado');
      if (creep.memory.target==null) {
	var sources = creep.room.find(FIND_SOURCES);
	target = (creep.pos.findClosestByRange(sources)).id;
	creep.memory.target=target;
      } else {
	target=creep.memory.target
      }
    } else {
      console.log('Asignando Target:'+ target);
      creep.memory.target=target;
    }
    target = Game.getObjectById(creep.memory.target);
    switch(creep.harvest(target)){
      case ERR_NOT_IN_RANGE:
	creep.moveTo(target);
	break;
      case ERR_INVALID_TARGET:
	creep.memory.target=null;
	break;
      case ERR_NO_BODYPART:
	creep.memory.target=null;
	console.log("ERROR LOGICO: Action: HARVEST, Creep: "+creep.name);
    }
    return (creep.carry.energy == creep.carryCapacity && creep.carryCapacity>0)
  },


  // In this action the creep put energy on a structure.
  discharge: function(creep, target = null){
    //    console.log(creep.name+' discharging');    
    if (target==null) {
      if (creep.memory.target==null){
	var targets = creep.room.find(FIND_STRUCTURES, {
	  filter: (structure) => {
            return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN  || (structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity*0.5 )) &&
		   structure.energy < structure.energyCapacity;
	  }
	})
	if(targets.length>0) {
	  target=creep.pos.findClosestByPath(targets);
	  creep.memory.target= target.id;
	} else return true;
      } else {
	 target = creep.memory.target;
      }
    } else {
      creep.memory.target=target;
    }
      target= Game.getObjectById(target);

    switch (creep.transfer(target, RESOURCE_ENERGY)) {
      case OK:
	creep.memory.target=null;
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
//  console.log(creep.name+' Building');
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
    return (creep.carry.energy == 0 || target==undefined );
  },

  
  // In this action the creep will upgrade the controller;
  upgrade: function(creep){
    //    console.log(creep.name+' upgrading');
    if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
      creep.moveTo(creep.room.controller);
    }
    return (creep.carry.energy == 0);
  },
  move:function(creep,target=null){
    //    console.log(creep.name+' moving');
    if (target==null){
      if (creep.memory.target == null){
	return true;
      } else {
	target= creep.memory.target;
      }
    }
//    console.log('Creep:' + creep.name +'Moving to ' + target);
    target = Game.getObjectById(target);
    creep.moveTo(target);
    return (creep.pos.x == target.pos.x)&& (creep.pos.y == target.pos.y);
  },
  
  repair:function(creep){
    if (creep.memory.target !=null){
      target = Game.getObjectById(creep.memory.target);
    } else {
      //      target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
      //	filter: (structure) => (structure.hits < structure.hitsMax) 
      //      });
      targets = creep.room.find(FIND_STRUCTURES, {
	filter: (structure) => (structure.hits < structure.hitsMax)
      });
      targets= targets.sort((a,b) =>a.hits-b.hits);
      target= targets[0];
      
	creep.memory.target=target.id;
    }
    switch (creep.repair(target)){
      case ERR_NOT_IN_RANGE:
	creep.moveTo(target);
    }
    return (creep.carry.energy==0 || target.hits==target.hitsMax);
  },

  pickup:function (creep,target=null){
    if (target==null) {
      if (creep.memory.target==null){
	target = (creep.pos.findClosestByRange(FIND_DROPPED_ENERGY)).id;
	memory.target=target;
      } else {
	target = creep.memory.target;
      }
    } else memory.target= target;
    target=Game.getObjectById(target);
    switch (creep.pickup(target)){
      case OK:
        target=null;
	creep.memory.target=null;
	break;
      case ERR_NOT_IN_RANGE:
	creep.moveTo(target);
	break;
      default:
	target=null;
	creep.memory.target=null;
	console.log('ERROR NO RECONOCIDO');
    }
    return (target==null);
  },
  rejuvenate:function (creep,target=null){
    if (creep.memory.target==null) {
      spawn= creep.pos.findClosestByPath(FIND_MY_SPAWNS);
      creep.memory.target=spawn.id;
    } else {
      spawn=Game.getObjectById(creep.memory.target);
    }
    actionResult= spawn.renewCreep(creep);
    switch (actionResult){
      case ERR_NOT_IN_RANGE:
	creep.moveTo(spawn);
    }
    return creep.ticksToLive == CREEP_LIFE_TIME;
  }
}

module.exports= actions;

var actions = require('actions') ;

var roleColector = {actions,
		     /** run: Execute the action of the creep **/
  /** @param {Creep} creep **/

  run: function(creep) {
    if (creep.memory.actionFinished || creep.memory.target==null){
      creep.memory.target = null;
      switch (creep.memory.action) {
	case undefined:
	case actions.ACTION_DISCHARGE :
	  target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
	  if (target) {
	    creep.memory.action=actions.ACTION_PICKUP;
	    creep.memory.target= target.id;
	  } else {
	    var containers = creep.room.find(FIND_STRUCTURES,{filter: (i) => i.structureType == STRUCTURE_CONTAINER});
	    targets= containers.sort(function cmp(a,b){return _.sum(a.store)<_.sum(b.store)});
	    if (targets.length>0) creep.memory.target= targets[0].id;
	    creep.memory.action=actions.ACTION_CHARGE;
	  }
	  break;
	case actions.ACTION_CHARGE :
	case actions.ACTION_PICKUP :
	  
	  creep.memory.target=creep.room.storage.id;
	  creep.memory.action=actions.ACTION_DISCHARGE;
	  break;
      }
    }
    switch (creep.memory.action) {
      case actions.ACTION_DISCHARGE :
	creep.memory.actionFinished=actions.discharge(creep);
	break;
      case undefined :
	creep.memory.actionFinished=true;
	break;
      case actions.ACTION_CHARGE :
	creep.memory.actionFinished=actions.charge(creep);
	break;
      case actions.ACTION_PICKUP :
	creep.memory.actionFinished=actions.pickup(creep);
	break;
    }
  }
};

module.exports = roleColector;

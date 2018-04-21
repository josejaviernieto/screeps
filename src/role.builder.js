var actions= require('actions');

var roleBuilder = {actions,
		   /** @param {Creep} creep **/
  run: function(creep) {
    if (creep.memory.actionFinished){
      creep.memory.target = null;
      switch (creep.memory.action) {
	case undefined :
	case actions.ACTION_BUILD :
	  creep.memory.action=actions.ACTION_CHARGE;
	  break;
	case actions.ACTION_REPAIR:
	  if (creep.carry.energy==0) creep.memory.action=actions.ACTION_CHARGE;
	  break;
	case actions.ACTION_CHARGE :
	  var target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
	  if (target) {
	    creep.memory.target=target.id;
	    creep.memory.action=actions.ACTION_BUILD;
	  } else {
	    creep.memory.action=actions.ACTION_REPAIR;
	  };
	  break;
      }
    }
    switch (creep.memory.action) {
      case actions.ACTION_REPAIR:
	creep.memory.actionFinished=actions.repair(creep);
	break;
      case actions.ACTION_BUILD :
	creep.memory.actionFinished=actions.build(creep);
	break;
      case undefined :
      case actions.ACTION_CHARGE :
	creep.memory.actionFinished=actions.charge(creep);
	break;
    }
  }
};

module.exports = roleBuilder;


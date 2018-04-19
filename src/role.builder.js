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

	case actions.ACTION_CHARGE :
	  creep.memory.action=actions.ACTION_BUILD;
	  break;
      }
    }
    switch (creep.memory.action) {
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


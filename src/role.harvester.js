var actions = require('actions') ;

var roleHarvester = {actions,
  /** run: Execute the action of the creep **/
  /** @param {Creep} creep **/

  run: function(creep) {
    if (creep.memory.actionFinished){
      creep.memory.target = null;
      switch (creep.memory.action) {
	case undefined:
	case actions.ACTION_DISCHARGE :
	  creep.memory.action=actions.ACTION_CHARGE;
	  break;
	case actions.ACTION_CHARGE :
	  creep.memory.action=actions.ACTION_DISCHARGE;
	  break;
      }
    }
    switch (creep.memory.action) {
      case actions.ACTION_DISCHARGE :
	creep.memory.actionFinished=actions.discharge(creep);
	break;
      case undefined :
      case actions.ACTION_CHARGE :
	creep.memory.actionFinished=actions.charge(creep);
	break;
    }
  }
};

module.exports = roleHarvester;

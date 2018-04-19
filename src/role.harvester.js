var actions = require('actions') ;
const ACTION_CHARGE=0;
const ACTION_DISCHARGE=3;
var roleHarvester = {actions,
  /** run: Execute the action of the creep **/
  /** @param {Creep} creep **/

  run: function(creep) {
    if (creep.memory.actionFinished){
      creep.memory.target = null;
      switch (creep.memory.action) {
	case undefined:
	case ACTION_DISCHARGE :
	  creep.memory.action=ACTION_CHARGE;
	  break;
	case ACTION_CHARGE :
	  creep.memory.action=ACTION_DISCHARGE;
	  break;
      }
    }
    switch (creep.memory.action) {
      case ACTION_DISCHARGE :
	creep.memory.actionFinished=actions.discharge(creep);
	break;
      case undefined :
      case ACTION_CHARGE :
	creep.memory.actionFinished=actions.charge(creep);
	break;
    }
  }
};

module.exports = roleHarvester;

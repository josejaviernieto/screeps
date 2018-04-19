var actions= require('actions');
const ACTION_CHARGE=0;
const ACTION_BUILD=1;

var roleBuilder = {actions,
		   /** @param {Creep} creep **/
  run: function(creep) {
    if (creep.memory.actionFinished){
      creep.memory.target = null;
      switch (creep.memory.action) {
	case undefined :
	case ACTION_BUILD :
	  creep.memory.action=ACTION_CHARGE;
	  break;

	case ACTION_CHARGE :
	  creep.memory.action=ACTION_BUILD;
	  break;
      }
    }
    switch (creep.memory.action) {
      case ACTION_BUILD :
	creep.memory.actionFinished=actions.build(creep);
	break;
      case undefined :
      case ACTION_CHARGE :
	creep.memory.actionFinished=actions.charge(creep);
	break;
    }
  }
};

module.exports = roleBuilder;


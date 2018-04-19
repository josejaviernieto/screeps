var actions= require('actions');


var roleUpgrader = {

  /** @param {Creep} creep **/
  run: function(creep) {
    
    if (creep.memory.actionFinished){
      creep.memory.target = null;
      switch (creep.memory.action) {
	case undefined:
	case actions.ACTION_UPGRADE :
	  creep.memory.action=actions.ACTION_CHARGE;
	  break;
	  
	case actions.ACTION_CHARGE :
	  creep.memory.action=actions.ACTION_UPGRADE;
	  break;
      }
    }
    switch (creep.memory.action) {
      case actions.ACTION_UPGRADE :
	creep.memory.actionFinished=actions.upgrade(creep);
	break;
      case undefined :
      case actions.ACTION_CHARGE :
	creep.memory.actionFinished=actions.charge(creep);
	break;
    }
  }
};

module.exports = roleUpgrader;

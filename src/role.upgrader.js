var actions= require('actions');
const ACTION_CHARGE=0;
const ACTION_UPGRADE=2;
var roleUpgrader = {

  /** @param {Creep} creep **/
  run: function(creep) {
    
    if (creep.memory.actionFinished){
      creep.memory.target = null;
      switch (creep.memory.action) {
	case undefined:
	case ACTION_UPGRADE :
	  creep.memory.action=ACTION_CHARGE;
	  break;
	  
	case ACTION_CHARGE :
	  creep.memory.action=ACTION_UPGRADE;
	  break;
      }
    }
    switch (creep.memory.action) {
      case ACTION_UPGRADE :
	creep.memory.actionFinished=actions.upgrade(creep);
	break;
      case undefined :
      case ACTION_CHARGE :
	creep.memory.actionFinished=actions.charge(creep);
	break;
    }
  }
};

module.exports = roleUpgrader;

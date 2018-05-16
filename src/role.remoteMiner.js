var actions = require('actions') ;

var roleRemoteMiner = {actions,
		     /** run: Execute the action of the creep **/
  /** @param {Creep} creep **/

  initialize: function(creep, source, storage){
    creep.memory.source=source;
    creep.memory.storage=storage;
  },
  
  run: function(creep) {
    if (creep.memory.source == undefined){
      this.initialize(creep,'59bbc5822052a716c3ce996d', creep.room.storage.id);
    }
    if (creep.memory.actionFinished){
      switch (creep.memory.action) {
      case undefined:
      case actions.ACTION_DISCHARGE :
	creep.memory.action=actions.ACTION_HARVEST;
	break;
      default:
      case actions.ACTION_HARVEST :
	creep.memory.action=actions.ACTION_DISCHARGE;
	break;
      }
    }
    switch (creep.memory.action) {
    case actions.ACTION_DISCHARGE :
      console.log('Creep:'+ creep.name + 'Discharging');
      creep.memory.actionFinished=actions.discharge(creep,creep.memory.storage);
      break;
    case undefined :
    case actions.ACTION_HARVEST :
      console.log('Creep:' + creep.name +'harvesting');
      if(Game.getObjectById(creep.memory.source)==null){
	console.log('Creep:' + creep.name +'Moving');
	creep.moveTo(Game.flags['Source1']);
	creep.memory.actionFinished = null;
      } else {
	console.log(creep.name + '=>' +creep.memory.source);
	creep.memory.actionFinished=actions.harvest(creep,creep.memory.source);
      }
	break;
    }
  }
};

module.exports = roleRemoteMiner;

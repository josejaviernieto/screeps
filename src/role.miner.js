var actions= require('actions');


var roleMiner = {actions,
		 /* Texto de ejemplo */
  findContainer: function(creep){
    var containers = creep.room.find(FIND_STRUCTURES,{filter: (i) => i.structureType == STRUCTURE_CONTAINER && i.pos.lookFor(LOOK_CREEPS).length==0});
    var target= creep.pos.findClosestByPath(containers);
    return target;
  },
  run: function(creep){
    
    if (creep.memory.target== null){

      var tmp= this.findContainer(creep)
      if (tmp!=null)
	creep.memory.target= tmp.id;
    }
    if (creep.memory.actionFinished && creep.memory.action==actions.ACTION_MOVE) {
      creep.memory.target= null;
      creep.memory.action=actions.ACTION_HARVEST;
    }
    switch (creep.memory.action){
      case actions.ACTION_HARVEST:
	//	console.log('harvesting:'+creep.memory.target+'=>'+actions.move(creep));
	creep.memory.actionFinished = actions.harvest(creep);
	break;
      case undefined:
	//	console.log('Nothing:'+creep.memory.target+'=>'+actions.move(creep));
	var tmp= this.findContainer(creep)
	if (tmp!=null) {
	  creep.memory.target= tmp.id;
	  creep.memory.action=actions.ACTION_MOVE;
	}
      case actions.ACTION_MOVE:
//	console.log('Moving:'+creep.memory.target+'=>'+actions.move(creep));
	creep.memory.actionFinished = actions.move(creep);
	break;
    }
  }
};

module.exports = roleMiner;

function costOfBody(body){
  var cost = 0;
  for (var part in body)
    {
      cost+= BODYPART_COST[body[part]];
    }
  return cost;
}

var generation = {
  BODY_GENERAL:0,
  BODY_MINER: 1,
  BODY_CARRIER: 2,
  BODY_GROW : { 
    0 :[WORK,MOVE],
    1: [WORK],
    2: [CARRY,CARRY,MOVE],
  },
  BODY_BASE:{
    0: [WORK,CARRY,MOVE],
    1: [WORK,MOVE],
    2: [CARRY,CARRY,MOVE],
  },

  body : function (tipe, energy) {
    
    var body=generation.BODY_BASE[tipe];
    var fact = (energy-costOfBody(body))/costOfBody(this.BODY_GROW[tipe]);

    for (i=1; i<fact; i++){
      body=body.concat(this.BODY_GROW[tipe]);
    }
//    console.log(costOfBody(body));
    return body;
  },

  spawn : function (rol, spawn){
    var newName = rol.toString() + Game.time;
    var tipe = generation.BODY_GENERAL;
    switch (rol){
      case 'miner':
	tipe=generation.BODY_MINER;
	break;
      case 'colector':
	tipe=generation.BODY_CARRIER;
    }

    spawn.spawnCreep(generation.body(tipe, spawn.room.energyAvailable), newName, 
		     {memory: {role: rol}});
  }
  
};

module.exports = generation;

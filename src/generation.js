function costOfBody(body){
  var cost = 0;
  for (var part in body)
    {
      cost+= BODYPART_COST[body[part]];
    }
  return cost;
}

var generation = {
  BODY_GENERAL :0,
  BODY_GROW : { 
    0 : [WORK,MOVE]
  },

  body : function (tipe, energy) {
    
    var body=[WORK,CARRY,MOVE]
    var fact = (energy-costOfBody(body))/costOfBody(this.BODY_GROW[tipe]);

    for (i=1; i<fact; i++){
      body=body.concat(this.BODY_GROW[tipe]);
    }
    console.log(costOfBody(body));
    return body;
  },

  spawn : function (rol, spawn){
    var newName = rol.toString() + Game.time;
    spawn.spawnCreep(generation.body(generation.BODY_GENERAL, spawn.room.energyAvailable), newName, 
		     {memory: {role: rol}});
  }
  
};

module.exports = generation;

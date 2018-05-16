
var buildSpawnZone = {

  buildzone: function(pos){

    var obj=Game.rooms[pos.roomName].lookForAtArea(LOOK_STRUCTURES, pos.y-6, pos.x-6 , pos.y+6, pos.x+6, true);
    
   // Game.rooms[pos.roomName].visual.rect(pos.x-6,pos.y-6, 13, 13);
  }


}

module.exports = buildSpawnZone;

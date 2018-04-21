function getPos(pos,x,y){
 return Game.rooms[pos.roomName].getPositionAt(pos.x+x,pos.y+y);
}

var buildRoad = {

  buildPerimeter: function(pos){
    var positions=[getPos(pos,-1,0),getPos(pos,0,-1),getPos(pos,1,0),getPos(pos,0,1)]
    console.log(positions);
    for (var i=0;i<positions.length;i++ ){
      console.log(Game.rooms[pos.roomName].createConstructionSite(positions[i],STRUCTURE_ROAD));
    }
  },

  buildPath: function(ini,fin){
    var path= PathFinder.search(ini,{pos:fin,range:1},{
      plainCost:1, swampCost:1});
    var positions= path.path;
      for (var i=0;i<positions.length;i++ ){
	console.log(Game.rooms[ini.roomName].createConstructionSite(positions[i],STRUCTURE_ROAD));
      }

  }
}

module.exports = buildRoad;

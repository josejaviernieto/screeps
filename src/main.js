var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleMiner = require('role.miner');
var roleColector = require('role.colector');
var roleRemoteMiner = require('role.remoteMiner');
var generation = require('generation');
var buildSpawnZone= require('build.spawnzone');
var buildRoad= require('build.road');
var roleRemoteBuilder = require('role.remotebuilder')

module.exports.loop = function () {

  var tower = Game.getObjectById('5ad7db1657bd341b810fa69b');
  if(tower) {
    var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if(closestHostile) {
      tower.attack(closestHostile);
    } else {
    var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (structure) => (structure.hits < structure.hitsMax && structure.hits<10000) 
    });
    if(closestDamagedStructure) {
      tower.repair(closestDamagedStructure);
    }
    }
  }

  
  for (var spawnName in Game.spawns) {
  var spawn = Game.spawns[spawnName];    
  buildSpawnZone.buildzone(spawn.pos);
  //  buildRoad.buildPerimeter(spawn.pos);
  //buildRoad.buildPath(spawn.room.storage.pos,Game.getObjectById('5ad8070d7ba7ef405947decc').pos);
  for(var name in Memory.creeps) {
    if(!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log('Clearing non-existing creep memory:', name);
    }
  }
  var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
  
  if ((spawn.room.energyAvailable==spawn.room.energyCapacityAvailable) || harvesters.length<=1 ){
    var remoteMiners = _.filter(Game.creeps, (creep) => creep.memory.role == 'remoteMiner');  
    if(remoteMiners.length < 1) {
      // generation.spawn('remoteMiner', spawn);
    }
    
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');  
    if(upgraders.length < 2) {
      generation.spawn('upgrader', spawn);
    }
  
    var colectors = _.filter(Game.creeps, (creep) => creep.memory.role == 'colector');
    if(colectors.length < 3) {
      generation.spawn('colector', spawn);
    } 
    if(harvesters.length < 2) {
    generation.spawn('harvester', spawn);
    }
    var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
    if(miners.length < 2) {
      generation.spawn('miner', spawn);
    }
  var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    if(builders.length < 1) {
    generation.spawn('builder', spawn);
  }
  var remoteBuilders = _.filter(Game.creeps, (creep) => creep.memory.role == 'remoteBuilder');
    if(remoteBuilders.length < 1) {
    generation.spawn('remoteBuilder', spawn);
  }
  }
  }
  for(var name in Game.creeps) {
    var creep = Game.creeps[name];
    switch (creep.memory.role) {
      case 'harvester':
	roleHarvester.run(creep);
	break;
      case 'upgrader':
	roleUpgrader.run(creep);
	break;
      case 'builder':
	roleBuilder.run(creep);
	break;
      case 'miner':
	roleMiner.run(creep);
	break;
      case 'colector':
	roleColector.run(creep);
	break;
      case 'remoteMiner':
	roleRemoteMiner.run(creep);
	break;
	case 'remoteBuilder':
	    roleRemoteBuilder.run(creep);
    }
    
  }
}

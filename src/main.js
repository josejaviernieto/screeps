var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleMiner = require('role.miner');
var generation = require('generation');
var buildSpawnZone= require('build.spawnzone');

module.exports.loop = function () {

  var tower = Game.getObjectById('5ad7db1657bd341b810fa69b');
  if(tower) {
    var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (structure) => (structure.hits < structure.hitsMax) && (structure.hits <80000)
    });
    if(closestDamagedStructure) {
      tower.repair(closestDamagedStructure);
    }
    var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if(closestHostile) {
      tower.attack(closestHostile);
    }
  }

  var spawn = Game.spawns['Homeworld'];
  buildSpawnZone.buildzone(spawn.pos);
  for(var name in Memory.creeps) {
    if(!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log('Clearing non-existing creep memory:', name);
    }
  }
  var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
  if(miners.length < 1) {
    generation.spawn('miner', spawn);
  }
  var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');  
  if(upgraders.length < 2) {
    generation.spawn('upgrader', spawn);
  }
  var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
  if(builders.length < 1) {
    generation.spawn('builder', spawn);
  }
  var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
  if(harvesters.length < 2) {
    generation.spawn('harvester', spawn);
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
    }
  }
}

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleMiner = require('role.miner');
var generation = require('generation');


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

  for(var name in Memory.creeps) {
    if(!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log('Clearing non-existing creep memory:', name);
    }
  }
  var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
  if(miners.length < 1) {
    generation.spawn('miner', Game.spawns['Homeworld']);
  }

  var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
  if(harvesters.length < 2) {
    generation.spawn('harvester', Game.spawns['Homeworld']);
  }
  var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
  if(builders.length < 1) {
    generation.spawn('builder', Game.spawns['Homeworld']);
  }
  var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');  
  if(upgraders.length < 2) {
    generation.spawn('upgrader', Game.spawns['Homeworld']);
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

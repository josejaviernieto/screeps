var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function () {

  var tower = Game.getObjectById('228a48a3ea83166ed7473eee');
  if(tower) {
    var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (structure) => structure.hits < structure.hitsMax
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

  var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
  console.log('Harvesters: ' + harvesters.length);
  
  if(harvesters.length < 2) {
    var newName = 'Harvester' + Game.time;
    console.log('Spawning new harvester: ' + newName);
    Game.spawns['Homeworld'].spawnCreep([WORK,CARRY,MOVE], newName, 
				     {memory: {role: 'harvester'}});        
  }

  var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
  
  if(builders.length < 1) {
    var newName = 'Builder' + Game.time;
    console.log('Spawning new builder: ' + newName);
    Game.spawns['Homeworld'].spawnCreep([WORK,CARRY,MOVE], newName, 
				     {memory: {role: 'builder'}});        
  }

  var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
  
  if(upgraders.length < 2) {
    var newName = 'Upgrader' + Game.time;
    console.log('Spawning new upgrader: ' + newName);
    Game.spawns['Homeworld'].spawnCreep([WORK,CARRY,MOVE], newName, 
				     {memory: {role: 'upgrader'}});        
  }
  for(var name in Game.creeps) {
    var creep = Game.creeps[name];

    if(creep.memory.role == 'harvester') {
      roleHarvester.run(creep);
    }
    if(creep.memory.role == 'upgrader') {
      roleUpgrader.run(creep);
    }
    if(creep.memory.role == 'builder') {
      roleBuilder.run(creep);
    }
  }
}

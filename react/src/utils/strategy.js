
const getOperatorIcon = (operator) => {
  const operators = {
    'lt': '<',
    'lte': '<=',
    'gt': '>',
    'gte': '>=',
    'eq': '==',
    'ne': '!=',
    "and": "&&",
    "or": "||"
  };
  return operators[operator];
}

function generateConditionCode(conditions) {
  if (conditions.length === 0) return "true";

  return conditions.map(condition => {
    switch (condition.type) {
      case 'comparison':
        if (condition.target === "randomNumber") {
          return `Math.random() * 100 ${getOperatorIcon(condition.operator)} ${condition.value}`;
        }
        if (condition.target === "gladiatorCount") {
          return `enemies.length ${getOperatorIcon(condition.operator)} ${condition.value}`;
        }
        const target = condition.target === 'self' ? 'self' : `getTarget(enemies, '${condition.target}')`;
        return `${target}.${condition.attribute} ${getOperatorIcon(condition.operator)} ${condition.value}`;
      case 'composite':
        return `(${generateConditionCode([condition.leftCondition])} ${getOperatorIcon(condition.logic)} ${generateConditionCode([condition.rightCondition])})`;
      default:
        return "true";
    }
  }).join(" && ");
}

function generateActionCode(action) {
  if (action.type === "defend" || action.type === "rest") return `return self.${action.type}();`;
  const target = action.target === 'self' ? 'self' : `getTarget(enemies, '${action.target}')`;
  return `return self.${action.type}(${target});`;
}
function generateStrategyCode(blocks, executable = false) {
  let blocksCode = blocks.map((block, index) => {
    if (block.conditions.length === 0) return `    // Bloque ${index + 1}\n    ${generateActionCode(block.action)}`
    return (`    // Bloque ${index + 1}
    if (${generateConditionCode(block.conditions)}) {
        ${generateActionCode(block.action)}
    }`)
  }).join('\n');
  let innerCode = ``;
  if (executable) {
    innerCode = generateHelperFunctions()
  }
  innerCode += `${blocksCode}
    // Acción por defecto (pasar turno)
    return null;
`
  if (executable) {
    return new Function('self', 'enemies', innerCode)
  }
  const functionString = "function executeStrategy(self, enemies) {\n" + innerCode + "}"
  return functionString

}

function generateHelperFunctions() {
  return `
      function getTarget(enemies, targetType) {
        switch(targetType) {
          case 'maxHp':
            return enemies.reduce((max, enemy) => enemy.health > max.health ? enemy : max, enemies[0]);
          case 'minHp':
            return enemies.reduce((min, enemy) => enemy.health < min.health ? enemy : min, enemies[0]);
          case 'maxEnergy':
            return enemies.reduce((max, enemy) => enemy.energy > max.energy ? enemy : max, enemies[0]);
          case 'minEnergy':
            return enemies.reduce((min, enemy) => enemy.energy < min.energy ? enemy : min, enemies[0]);
          case 'random':
            return enemies[Math.floor(Math.random() * enemies.length)];
          default:
            return enemies[0];
        }
      }
    `;
}




export { generateStrategyCode }
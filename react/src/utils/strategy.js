
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
const generateBlockCode = (block,index) => {
  if (block.conditions.length === 0) return `    // Bloque ${index + 1} ${block.comment ? `(${block.comment})` : ''}\n    ${generateActionCode(block.action)}`
  return (`    // Bloque ${index + 1} ${block.comment ? `(${block.comment})` : ''}
    if (${generateConditionCode(block.conditions)}) {
        ${generateActionCode(block.action)}
    }`)

}
function generateStrategyCode(blocks) {
  let blocksCode = blocks.map((block, index) => {
    return generateBlockCode(block,index)
  }).join('\n');
  let innerCode = ``;
  
  innerCode += `${blocksCode}
    // Acción por defecto (pasar turno)
    return null;
`
  
  const functionString = "function executeStrategy(self, enemies) {\n" + innerCode + "}"
  return functionString

}




export { generateStrategyCode,generateBlockCode }
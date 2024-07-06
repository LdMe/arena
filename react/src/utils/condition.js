const createDefaultCondition = (type, depth = 0) => {
    const baseCondition = {
        id: Date.now() + depth,
        type: type,
        level: depth
    };

    switch (type) {
        case 'comparison':
            return {
                ...baseCondition,
                target: 'self',
                attribute: 'health',
                operator: 'gt',
                value: 50
            };
        case 'gladiatorCount':
            return {
                ...baseCondition,
                operator: 'gt',
                value: 1,
            };
        case 'composite':
            return {
                ...baseCondition,
                logic: 'and',
                leftCondition: createDefaultCondition('comparison', depth),
                rightCondition: createDefaultCondition('comparison', depth)
            };
        default:
            return baseCondition;
    }
};


/* const updateCondition = (condition, updates) => {
    console.log("updates", updates)
    if (updates.type === 'composite') {
        // Si estamos cambiando a una condición anidada, inicializamos las subcondiciones
        return {
            ...condition,
            ...updates,
            logic: 'and',
            leftCondition: createDefaultCondition('comparison', condition.level + 1),
            rightCondition: createDefaultCondition('comparison', condition.level + 1),
        };
    }
    if(updates.attribute === 'isDefending'){
        updates.operator = "eq";
        updates.value = "true"
    }
    if(updates.attribute && updates.attribute !== 'isDefending' && condition.attribute === 'isDefending'){
        updates.operator = "gt";
        updates.value = 50;
    }

    if((updates.target === 'randomNumber'  || updates.target == 'gladiatorCount' ) && condition.attribute === 'isDefending'){
        updates.operator = "gt";
        updates.value = 50;
        updates.attribute = 'health';
    }
    if(updates.leftCondition){
        updates.leftCondition = updateCondition(condition.leftCondition, updates.leftCondition);
    }
    if(updates.rightCondition){
        updates.rightCondition = updateCondition(condition.rightCondition, updates.rightCondition);
    }
    return {...condition, ...updates };
} */
const updateCondition = (condition, updates) => {
    console.log("updates", updates)
    // Si estamos cambiando a una condición anidada, inicializamos las subcondiciones
    if (updates.type === 'composite') {
        return {
            ...condition,
            ...updates,
            logic: 'and',
            leftCondition: createDefaultCondition('comparison', condition.level + 1),
            rightCondition: createDefaultCondition('comparison', condition.level + 1),
        };
    }

    // Si cambiamos la propiedad attribute a 'isDefending'
    if (updates.attribute === 'isDefending') {
        updates.operator = "eq";
        updates.value = "true";
    }

    // Si cambiamos de 'isDefending' a otra cosa
    if (updates.attribute && updates.attribute !== 'isDefending' && condition.attribute === 'isDefending') {
        updates.operator = "gt";
        updates.value = 50;
    }

    // Si cambiamos el target a 'randomNumber' o 'gladiatorCount'
    if ((updates.target === 'randomNumber' || updates.target == 'gladiatorCount') && condition.attribute === 'isDefending') {
        updates.operator = "gt";
        updates.value = 50;
        updates.attribute = 'health';
    }

    const newCondition = { ...condition, ...updates };
    console.log("newCondition", newCondition)
    return newCondition;
};


const createDefaultBlock = () => {

    return {
        id: Date.now(),
        conditions: [],
        action: createDefaultAction()
    };
}
const createDefaultAction = () => {
    return {
        id: Date.now(),
        type: 'defend'
    };
}

export {
    createDefaultCondition,
    createDefaultAction,
    createDefaultBlock,
    updateCondition
}
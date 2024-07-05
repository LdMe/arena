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
                leftCondition: createDefaultCondition('comparison', depth ) ,
                rightCondition: createDefaultCondition('comparison', depth )
            };
        default:
            return baseCondition;
    }
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
    createDefaultBlock
}
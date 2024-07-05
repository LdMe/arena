import { useState, useEffect } from "react";
import { createDefaultCondition } from "../utils/condition";

function Condition({ condition, updateCondition }) {
    const renderConditionContent = () => {
        switch (condition.type) {
            case 'comparison':
                return <ComparisonCondition condition={condition} updateCondition={updateCondition} />;
            case 'composite':
                return <NestedCondition condition={{...condition,level:(condition.level || 0) + 1}} updateCondition={updateCondition} />;
            default:
                return null;
        }
    };

    return (
        <div className={`condition level-${condition.level || 0}`} style={{ margin: '5px', padding: '5px', border: '1px solid gray' }}>
            <select
                value={condition.type}
                onChange={e => updateCondition({ type: e.target.value })}
            >
                <option value="comparison">Comparación</option>
                <option value="composite">Condición Compuesta</option>
            </select>
            {renderConditionContent()}
        </div>
    );
}
function ComparisonCondition({ condition, updateCondition }) {
    return (
        <div>
            <select
                value={condition.target || 'self'}
                onChange={e => updateCondition({ target: e.target.value })}
            >
                <option value="self">Mi gladiador</option>
                <option value="maxHp">Gladiador con más vida</option>
                <option value="minHp">Gladiador con menos vida</option>
                <option value="maxEnergy">Gladiador con más energía</option>
                <option value="minEnergy">Gladiador con menos energía</option>
                <option value="random">Gladiador aleatorio</option>
                <option value="randomNumber">Número aleatorio</option>
                <option value="gladiatorCount">Conteo de Gladiadores</option>
            </select>
            {(condition.target === 'randomNumber' || condition.target === 'gladiatorCount') ? (
                <></>
            ):
            (
            <select value={condition.attribute || 'health'} onChange={e => updateCondition({ attribute: e.target.value })}
            >
                <option value="health">Vida</option>
                <option value="energy">Energía</option>
                <option value="isDefending">Defendiendo</option>
            </select>
            )}

            <select
                value={condition.operator || 'gt'}
                onChange={e => updateCondition({ operator: e.target.value })}
            >
                {condition.attribute !== 'isDefending' && (
                    <>
                        <option value="gt">Mayor que</option>
                        <option value="gte">Mayor o igual que</option>
                        <option value="lt">Menor que</option>
                        <option value="lte">Menor o igual que</option>
                    </>
                )}
                <option value="eq">Igual a</option>
                <option value="ne">Diferente de</option>
            </select>
            {condition.attribute === 'isDefending' ? (
                <select value={condition.value || 'true'} onChange={e => updateCondition({ value: e.target.value })}>
                    <option value="true">Verdadero</option>
                    <option value="false">Falso</option>
                </select>
            ) : (
                <input
                    type="number"
                    value={condition.value}
                    onChange={e => updateCondition({ value: e.target.value })}
                />
            )}
        </div>
    );
}

function GladiatorCountCondition({ condition, updateCondition }) {
    return (
        <div>
            Gladiadores restantes
            <select
                value={condition.operator}
                onChange={e => updateCondition({ operator: e.target.value })}
            >
                <option value="gt">Mayor que</option>
                <option value="gte">Mayor o igual que</option>
                <option value="lt">Menor que</option>
                <option value="lte">Menor o igual que</option>
                <option value="eq">Igual a</option>
                <option value="ne">Diferente de</option>

            </select>
            <input
                type="number"
                value={condition.value || ''}
                onChange={e => updateCondition({ value: e.target.value })}
            />
        </div>
    );
}

function NestedCondition({ condition, updateCondition }) {

    const handleUpdateCondition = (updates,isLeft=true) => {
        

        if(isLeft){
            if(updates.type && condition.leftCondition.type !== updates.type){
                const leftCondition = createDefaultCondition(updates.type,condition.level)
                updateCondition({ leftCondition })
            }else{
                updateCondition({ leftCondition: { ...condition.leftCondition, ...updates } })
            }
        }else{
            if(updates.type && condition.rightCondition.type !== updates.type){
                const rightCondition = createDefaultCondition(updates.type,condition.level)
                updateCondition({ rightCondition })
            }else{
                updateCondition({ rightCondition: { ...condition.rightCondition, ...updates } })
            }
        }
    }
    return (
        <div>
            <select
                value={condition.logic || 'and'}
                onChange={e => updateCondition({ logic: e.target.value })}
            >
                <option value="and">Y</option>
                <option value="or">O</option>
            </select>
            <Condition
                condition={condition.leftCondition}
                updateCondition={(updates) => handleUpdateCondition(updates,true)}
            />
            <Condition
                condition={condition.rightCondition}
                updateCondition={(updates) => handleUpdateCondition(updates,false)}
            />
        </div>
    );
}

export default Condition
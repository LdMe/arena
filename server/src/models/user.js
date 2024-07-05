import mongoose from 'mongoose';
/*
blocks:Object
blocks:"[{"id":1720038469006,"conditions":[{"id":1720038470901,"type":"composite","level":0,"target":"self","attribute":"health","operator":"gt","value":50,"logic":"and","leftCondition":{"id":1720038544063,"type":"comparison","level":1,"target":"self","attribute":"health","operator":"gt","value":50},"rightCondition":{"id":1720038544063,"type":"comparison","level":1,"target":"self","attribute":"health","operator":"gt","value":50}}],"action":{"id":1720038469006,"type":"attack","target":"minEnergy"}}]"
*/
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: String,
    blocks: [
        {
            id: Number,
            conditions: [
                {
                    id: Number,
                    type: String,
                    level: Number,
                    target: String,
                    attribute: String,
                    operator: String,
                    value: Number,
                    logic: String,
                    leftCondition: Object,
                    rightCondition: Object
                }
            ],
            action: {
                id: Number,
                type: String,
                target: String
            }
        }
    ],
    totalGames: {
        type: Number,
        default: 0
    },
    won: {
        type: Number,
        default: 0
    },
    lost: {
        type: Number,
        default: 0
    },
    draw: {
        type: Number,
        default: 0
    }
});


export default mongoose.model('User', userSchema)
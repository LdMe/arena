import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
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
    password: String,
    blocks: [
        {
            id: Number,
            conditions: [
                {
                    id: Number,
                    type: {type:String},
                    level: Number,
                    target: String,
                    attribute: String,
                    operator: String,
                    value: mongoose.Schema.Types.Mixed,
                    logic: String,
                    leftCondition: Object,
                    rightCondition: Object
                }
            ],
            action: {
                id: Number,
                type: {type:String},
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

userSchema.pre('save', function(next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return next(err);
        }
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});

export default mongoose.model('User', userSchema)
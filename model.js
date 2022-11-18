const {
    db
} = require('./database');


module.exports = {
    create: async ({gate,assetsid,ip,status,startedAt,endedAt,onTime,offTime,created_at}) => {
        try {          
            let dbQuery = await db.tx(async t => { 
                    await t.none('INSERT INTO gate_health(gate,assetsid,ip,status,started_at,ended_at,ontime,offtime,created_at)VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)', [gate,assetsid,ip,status,startedAt,endedAt,onTime,offTime,created_at]);
                })   
                .then(data => {
                    return true;
                })
                .catch(error => {
                    console.log('Error occurred while inserting health data', error);
                    return false;
                });

            if (dbQuery) {
                return {
                    error: false,
                    message: 'Inserted Successfully!!',
                    data: []
                }
            } else {
                return {
                    error: true,
                    message: 'Insertion failed!!'
                }
            }

        } catch (error) {
            console.log(error);
            return {
                error: true,
                message: `${error.message}`,
            }
        }
    }, 
    setPowerOff: async ({gate,assetsid,offTime,endedAt}) => {

        console.log("@@@@",gate,assetsid,offTime,endedAt)
        try {          
            //gate:"gate",assetsId:"132",status:"on"
            let dbQuery = await db.tx(async t => {
                    await t.none('UPDATE gate_health SET status = $4, offtime = $5,ended_at=$6 WHERE gate = $1 AND assetsid=$2 AND status = $3', [gate,assetsid,'on','off',offTime,endedAt]);
                })
                .then(data => {
                    return true;
                })
                .catch(error => {
                    console.log('Error occurred while inserting health data', error);
                    return false;
                });

            if (dbQuery) {
                return Promise.resolve({
                    error: false,
                    message: 'Updated Successfully!!',
                    data: []
                })
            } else {
                return {
                    error: true,
                    message: 'Updation failed!!'
                }
            }

        } catch (error) {
            console.log(error);
            return {
                error: true,
                message: `${error.message}`,
            }
        }
    },
    setPowerOn: async ({gate,assetsid,onTime}) => {
        try {          
            //gate:"gate",assetsId:"132",status:"on"
            let dbQuery = await db.tx(async t => {
                    await t.none('UPDATE gate_health SET ontime = $4 , updated_at = $5 WHERE gate = $1 AND assetsid=$2 AND status = $3', [gate,assetsid,'on',onTime,new Date()]);
                })
                .then(data => {
                    return true;
                })
                .catch(error => {
                    console.log('Error occurred while updateing  health data', error);
                    return false;
                });

            if (dbQuery) {
                return Promise.resolve({
                    error: false,
                    message: 'Updated Successfully!!',
                    data: []
                })
            } else {
                return {
                    error: true,
                    message: 'Updation failed!!'
                }
            }

        } catch (error) {
            console.log(error);
            return {
                error: true,
                message: `${error.message}`,
            }
        }
    },
    getOffDeviceReport : async (status)=>{
            try {  
                let result = await db.query('SELECT * FROM gate_health WHERE status = $1 AND is_send=$2', [status,0])
                return {
                    error: false,
                    message: 'Get status successfully!!',
                    data: result
                }
    
            } catch (error) {
                // console.log(error);
                return {
                    error: true,
                    message: `${error.message}`,
                }
            }
    },
    updateSendDeviceData : async ()=>{
        try {
            await db.query('UPDATE gate_health SET is_send = $2, sended_at = $3 WHERE status = $1', ['off',1,new Date()])
            return {error:false,message:'Sended to Clouded Success'}
        } catch (error) {
            return {error: true,message: `${error.message}`}
        }
},
    details : async ({gate,assetsid,status})=>{
        console.log(gate,assetsid,status)
        try {
            let result = await db.one('SELECT * FROM gate_health WHERE gate = $1 AND assetsid = $2 AND status=$3 ORDER BY id DESC LIMIT 1', [gate,assetsid,status])
            return result;
 
        } catch (error) {
            // console.log(error);
            return {
                error: true,
                message: `${error.message}`,
            }
        }
}

}

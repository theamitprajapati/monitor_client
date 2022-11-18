var cron = require('node-cron');
 const moment = require('moment');
const axios = require('axios');
const onoffService = require("./model");
const GATE_ID = process.env.GATE_ID;
let counterCheck = {WAN:0,INTERNET:0};
const GATE_NUMBER = process.env.GATE_NUMBER
cron.schedule("*/5 * * * * *", async() => {
  addAndUpdateDeviceStatus('WAN')
  dnsResolveStatus('INTERNET');
    // const row = await onoffService.details({gate:GATE_ID,assetsid:GATE_NUMBER,status:"on"});
     
    // const rowData = {gate:GATE_ID,assetsid:GATE_NUMBER,ip:"127.0.0.2",status:"on",startedAt:new Date(),endedAt:null,onTime:"0",offTime:"0",created_at:new Date()};

    // console.log(' *** ',rowData)
    // if(!row){      
    //     onoffService.create(rowData)
    //     ++counterCheck; 
    //     return;
    // } 
    // if(counterCheck == 0 && row){
    //     // const machineOffDate = moment(row.updatedAt).add(row.onTime, "seconds");
    //     var startDate = moment(row.updated_at,"YYYY-MM-DD HH:mm:ss");
    //     var endDate = moment(new Date(),"YYYY-MM-DD HH:mm:ss");
    //     const totalOffHours = endDate.diff(startDate, 'seconds');
    //     onoffService.setPowerOff({gate:GATE_ID,assetsid:GATE_NUMBER,offTime:totalOffHours,endedAt:row.updated_at})    
    //     onoffService.create(rowData)
    //     ++counterCheck;
    //     console.log("Running off")        
    //     return;
    // }   
    // //console.log(row)    
    
    // var startDate = moment(row.started_at,"YYYY-MM-DD HH:mm:ss");
    // var endDate = moment(new Date(),"YYYY-MM-DD HH:mm:ss");
    // const totalRunningHours = endDate.diff(startDate, 'seconds');
    // const totalHours = (Number(row.ontime)+Number(totalRunningHours));
    // let d = await onoffService.setPowerOn({gate:GATE_ID,assetsid:GATE_NUMBER,onTime:totalHours});       
    // console.log("onTIme...",totalHours)
    // console.log(d)
    // console.log("Time hours updated")
    //++counterCheck;  
});
cron.schedule("*/50 * * * * *", async() => {
  postData()
});



const postData = async()=>{
  const rows = await onoffService.getOffDeviceReport('off');
  console.log(rows)
  const body = {gate:"gate",assetsId:"132",ip:"127.0.0.2",status:"on",startedAt:(new Date()),endedAt:null,onTime:0,offTime:0}
  axios.post('http://127.0.0.1:5500/api/health', body)
  .then( async (response) =>{
    console.log("xxxxxxxx ",response.data.flag)
    if(response.data && response.data.flag){
      let result = await onoffService.updateSendDeviceData();
      if(result.error){
        console.log('Cloud Send Error:',result.message)
        return;
      }
      console.log('Cloud Send Success:',result.message)
    }
  })
  .catch( (error)=> {
    console.log('Cloud Error',error.message);
  });

}
postData();
const dnsResolveStatus = (dnsType)=>{
  require('dns').resolve('www.google.com', function(err) {
    if (err) {
       console.log("No connection");
       counterCheck[dnsType] = 0;
    } else {
       console.log("Connected");
       addAndUpdateDeviceStatus(dnsType);
    }
  });  
}
const addAndUpdateDeviceStatus = async (assetsid)=>{
    const row = await onoffService.details({gate:GATE_ID,assetsid:assetsid,status:"on"});
    const rowData = {gate:process.env.GATE_ID,assetsid:assetsid,ip:"127.0.0.2",status:"on",startedAt:new Date(),endedAt:null,onTime:"0",offTime:"0",created_at:new Date()};
    if(!row){      
        onoffService.create(rowData)
        ++counterCheck[assetsid]; 
        return;
    } 
    if(counterCheck[assetsid] == 0 && row){
        // const machineOffDate = moment(row.updatedAt).add(row.onTime, "seconds");
        var startDate = moment(row.updated_at,"YYYY-MM-DD HH:mm:ss");
        var endDate = moment(new Date(),"YYYY-MM-DD HH:mm:ss");
        const totalOffHours = endDate.diff(startDate, 'seconds');
        onoffService.setPowerOff({gate:process.env.GATE_ID,assetsid:assetsid,offTime:totalOffHours,endedAt:row.updated_at})    
        onoffService.create(rowData)
        ++counterCheck[assetsid];
        console.log(`${assetsid} : OFF`)        
        return;
    }       
    var startDate = moment(row.started_at,"YYYY-MM-DD HH:mm:ss");
    var endDate = moment(new Date(),"YYYY-MM-DD HH:mm:ss");
    const totalRunningHours = endDate.diff(startDate, 'seconds');
    const totalHours = (Number(row.ontime)+Number(totalRunningHours));
    await onoffService.setPowerOn({gate:GATE_ID,assetsid:assetsid,onTime:totalHours});       
    console.log(`${assetsid} : ON ${totalHours}`)
}
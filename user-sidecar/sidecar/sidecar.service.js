const { fetch } = require('undici');
const User = require('../models/user.model');
const logger = require('../logger');

class IdentityService {
  async getToken() {
    const url = 'https://gateway.khanetala.ir/v1/query/internal/getToken';
    const body = {
      userName: "",  // Fill your credentials here or load from env vars
      password: ""
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("لطفا دوباره امتحان کنید");  // or throw BadRequestException if in NestJS context
    }

    const data = await response.json();
    return data;
  }

  async identity(info) {
    const url = "https://gateway.khanetala.ir/v1/main/internal/user/identity";
    const token = await this.getToken();

    if (!token || !token.token) {
      throw new Error("لطفا دوباره امتحان کنید");
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(info),
    });

    // if (!response.ok) {
    //   throw new Error("لطفا دوباره امتحان کنید");
    // }

    const data = await response.json();
    return data || "unknown";
  }
  async createWallet(wallet){
         const url='http://localhost:9011/wallet'
               const body=wallet
               
               const response = await fetch(url, {
                   method: 'POST',
                   headers: {
                   //   'Authorization': `Bearer ${token}`,
                     'Content-Type': 'application/json',
                   },
                   body: JSON.stringify(body),
                 });
       
                 console.log("response",response);
                 
                 if(!response.ok){
                   throw new BadRequestException("لطفا دوباره امتحان کنید");
                 }
                 const data = await response.json(); // <-- this gets the actual data
                 return data; 
  }
}

const identityService = new IdentityService();

async function processIdentityCheck() {
  const user = await User.findOne({ identityStatus: 2 });
//   const users=await User.find()
//   console.log("users",users);
  
  if (!user) {
    logger.info('No users pending identity verification');
    return;
  }

  logger.info(`Checking identity for user ${user.phoneNumber}`);

//   try {

    const info={
        phoneNumber:user.phoneNumber,
        birthDate:user.birthDate,
        nationalCode:user.nationalCode
    }

    console.log(info);
    
   
    const response=await identityService.identity(info)
    if(!response){
        return ;
    }


    console.log("");
    


    if(response.statusCode==1){
        console.log("1",response.statusCode);
        
        user.identityStatus=0
        await user.save()
        
    }  //? 
    if(response.statusCode==2){
         console.log("2",response.statusCode);
         user.identityStatus=0
         await user.save()
        
    }  //?
    if(response.statusCode==3){
         console.log("3",response.statusCode);
         user.identityStatus=0
         await user.save()
        
    }  //?
    if(response.statusCode==4){
         console.log("4",response.statusCode);
         user.identityStatus=0
         await user.save()
        
    }  //?
     if(response.statusCode==6){
      console.log("response",response);
         console.log("4",response.statusCode);
         user.identityStatus=1
         user.firstName=response.user.firstName
         user.lastName=response.user.lastName
         user.fatherName=response.user.fatherName
         user.phoneNumber=response.user.phoneNumber
         user.nationalCode=response.user.nationalCode
         user.birthDate=response.user.birthDate
         await user.save()

       const wallet = {
        owner: user._id,
        balance: 0,
        goldWeight: response.user.goldWeight
      }

      const createdWallet=await identityService.createWallet(wallet)

      console.log("wallet",createdWallet);
      
        
    }  //
    if(response.statusCode==5){
        console.log("response",response);
        user.identityStatus=1
        user.firstName=response.user.firstName
        user.lastName=response.user.lastName
        user.fatherName=response.user.fatherName
        await user.save()

 
       const wallet = {
        owner: user._id,
        balance: 0,
        goldWeight: "0"
      }

      const createdWallet=await identityService.createWallet(wallet)

      console.log("wallet",createdWallet);

    }
  
    
    logger.info(`Identity check completed for user ${user._id}, status: ${user.identityStatus}`);

//   } catch (err) {
//     logger.error(`Error during identity check for user ${user._id}: ${err.message}`);
//   }
}


module.exports = {
  processIdentityCheck
};
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

    if (!response.ok) {
      throw new Error("لطفا دوباره امتحان کنید");
    }

    const data = await response.json();
    return data || "unknown";
  }
}

const identityService = new IdentityService();

async function processIdentityCheck() {
  const user = await User.findOne({ identityStatus: 2 });
  if (!user) {
    logger.info('No users pending identity verification');
    return;
  }

  logger.info(`Checking identity for user ${user.phoneNumber}`);

  try {

    const info={
        phoneNumber:user.phoneNumber,
        birthDate:user.birthDate,
        nationalCode:user.nationalCode
    }
   
    const response=await identityService.identity(info)


    if(response.statusCode==1){
        return ;
    }  //? 
    if(response.statusCode==2){
        return ;
    }  //?
    if(response.statusCode==3){
        return ;
    }  //?
    if(response.statusCode==4){
        return ;
    }  //?
    if(response.statusCode==5){
        console.log("response",response);

       await user.save()
        
    }

    
    logger.info(`Identity check completed for user ${user._id}, status: ${user.identityStatus}`);

  } catch (err) {
    logger.error(`Error during identity check for user ${user._id}: ${err.message}`);
  }
}

module.exports = {
  processIdentityCheck
};
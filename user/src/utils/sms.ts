const Kavenegar = require('kavenegar');

export class SmsService {
  private api = Kavenegar.KavenegarApi({
    apikey:
      '7167656544666430374262632B61415374556A7A4A4D383170764A7843775142357A4B566B6E75493837633D',
  });
  sendOtpMessage(phoneNumber:string, otp:string) {

    console.log(phoneNumber,"phoneNumber", otp,"otp is here ");
    
    return new Promise((resolve, reject) => {
      try {
        let correctStatuses = [1, 2, 4, 5, 10];
        this.api.VerifyLookup(
          { token: otp, template: 'otp', receptor: phoneNumber },
          (res, status) => {
            console.log(status,"/////status is herere")
            console.log('kavenegar ', res);
            if (status == 200 && correctStatuses.includes(res[0].status)) {
              resolve({
                success: true,
                msg: 'کد اعتبارسنجی با موفقیت ارسال شد',
              });
            } else {
              resolve({ success: false, msg: 'خطا در ارسال کد تایید' });
            }
          },
        );
      } catch (error) {
        // monitor.error.push(`error in sending otp sms in kavenegar :: ${error}`)
        console.log(error);
        reject({ success: false, msg: 'خطای داخلی سیستم' });
      }
    });
  }
  
  // async sendGeneralMessage(phoneNumber, template, token, secToken, thirdToken) {
  //   try {
  //     let correctStatuses = [1, 2, 4, 5, 10];
  //     this.api.VerifyLookup(
  //       {
  //         token,
  //         token2: secToken,
  //         token3: thirdToken,
  //         template,
  //         receptor: phoneNumber,
  //       },
  //       (res, status) => {
  //         console.log('send message status', status);
  //         if (status == 200 && correctStatuses.includes(res[0].status)) {
  //           return { success: true, msg: 'پیامک ارسال شد' };
  //         } else {
  //           // monitor.error.push(`error in sending message to user in kavenegar :: ${res} for phoneNumber ${phoneNumber}  and message template ${template} `)
  //           return { success: false, msg: 'خطا در ارسال پیامک' };
  //         }
  //       },
  //     );
  //   } catch (error) {
  //     // monitor.error.push(`error in sending message to user in kavenegar :: ${error}`)
  //     console.log(error);
  //     return { success: false, msg: 'خطای داخلی سیستم' };
  //   }
  // }
}

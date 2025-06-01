import { redisCache } from "./redis.service";





class blackListClass{
    private list = new redisCache();

    getter(){
        return this.list
    }


    // setter(newToken : string){
    //     this.list.push(newToken)
    // }

    async checker(token:string){
        let data = await this.list.getter('blackList')
        if (data){
            let blackList = JSON.parse(data)
            if (blackList.includes(token)){
                return true
            }else{
                return false
            }
        }else{
            return false
        }
    }
}



const blackList = new blackListClass()

export default blackList;
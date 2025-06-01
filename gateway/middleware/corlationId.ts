import { UUIDTypes, v4 as uuidv4 } from "uuid";

export default (req: any, res: any, next: any) => {
  let uuid: UUIDTypes = uuidv4();
  req.id = uuid;
  console.log("corelationId add to req", req.id);
  next();
};

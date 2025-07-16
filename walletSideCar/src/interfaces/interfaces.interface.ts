import { walletDocument } from "src/wallet/entities/wallet.entity";

export interface Interfaces {}

export interface responseInterface{
      message: string,
      statusCode: number,
      data ?: walletDocument,
      error ?: string
}
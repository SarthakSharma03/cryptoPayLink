import WalletUserModel from "../model/WalletUser.model";

export const updateUser=(walletAddress:string)=>{
   return WalletUserModel.findOneAndUpdate(
          { walletAddress },
          { walletAddress },
          { upsert: true, returnDocument: 'after' }
        );
}

export const getUserByWallet = (walletAddress: string) => {
  return WalletUserModel.findOne({ walletAddress });
}

export const updateUserProfile = (walletAddress: string, updates: Partial<{
  fullName: string;
  email: string;
  username: string;
  country: string;
  phone?: string;
   address?: string;
  }>) => {
  return WalletUserModel.findOneAndUpdate(
    { walletAddress },
    { $set: updates },
    { returnDocument: 'after' }
  )
}

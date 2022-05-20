import * as StellarSdk from 'stellar-sdk';
export async function generateKeyPair(){
    return  StellarSdk.Keypair.random();
}
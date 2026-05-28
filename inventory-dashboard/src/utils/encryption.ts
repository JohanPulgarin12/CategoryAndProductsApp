import CryptoJS from 'crypto-js'

const KEY = CryptoJS.enc.Utf8.parse('ADNKey_2005_28_0')  // 16 chars
const IV  = CryptoJS.enc.Utf8.parse('ADN_Vect')           // 8 chars

export function encryptTripleDES(text: string): string {
  const encrypted = CryptoJS.TripleDES.encrypt(
    CryptoJS.enc.Utf8.parse(text),
    KEY,
    {
      iv: IV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  )
  return encrypted.toString()
}
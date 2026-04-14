import { JSEncrypt } from 'jsencrypt';
// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey = import.meta.env.VITE_APP_RSA_PUBLIC_KEY;

// 前端不建议存放私钥 不建议解密数据 因为都是透明的意义不大
const privateKey = import.meta.env.VITE_APP_RSA_PRIVATE_KEY;

// 加密
export const encrypt = (txt: string) => {
  if (!publicKey) {
    throw new Error('VITE_APP_RSA_PUBLIC_KEY is required');
  }
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(publicKey); // 设置公钥
  return encryptor.encrypt(txt); // 对数据进行加密
};

// 解密
export const decrypt = (txt: string) => {
  if (!privateKey) {
    throw new Error('VITE_APP_RSA_PRIVATE_KEY is required to decrypt encrypted responses');
  }
  const encryptor = new JSEncrypt();
  encryptor.setPrivateKey(privateKey); // 设置私钥
  return encryptor.decrypt(txt); // 对数据进行解密
};

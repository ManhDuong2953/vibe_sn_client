import { ethers } from 'ethers';

// Mặc định Ganache chạy tại http://localhost:8545
const provider = new ethers.JsonRpcProvider('HTTP://192.168.3.103:7545');

// Hàm lấy thông tin giao dịch theo hash
export const getTransactionInfo = async (txHash) => {
  try {
    const tx = await provider.getTransaction(txHash);
    console.log('Thông tin giao dịch:', tx);
  } catch (err) {
    console.error('Lỗi:', err);
  }
};

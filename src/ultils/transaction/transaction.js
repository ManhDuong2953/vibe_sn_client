import { BrowserProvider, parseEther, encodeBytes32String } from "ethers";
import { toast } from "react-toastify";

// Gửi ETH từ người dùng đến ví người bán, kèm payload lưu vào blockchain
export const sendTransaction = async (sellerAddress, amountEth, payload = "") => {
  try {
    if (!window.ethereum) {
      toast.error("MetaMask chưa được cài!", {
        position: "bottom-left",
      });
      return;
    }

    toast.warning("Đang đăng ký giao dịch...", {
      position: "bottom-left",
    });

    const provider = new BrowserProvider(window.ethereum); // ethers v6
    const signer = await provider.getSigner();

    toast.dismiss();
    toast.success("Đăng ký giao dịch thành công", {
      position: "bottom-left",
    });

    toast.warning("Đang khởi tạo giao dịch...", {
      autoClose: false,
      position: "bottom-left",
    });

    // Mã hóa payload nếu có
    let hexData = undefined;
    if (payload) {
      // Mã hóa chuỗi payload thành hex để lưu vào blockchain
      hexData = encodeBytes32String(payload); // Chỉ dùng cho chuỗi ngắn <= 32 ký tự
      // Nếu payload dài hơn: hexData = ethers.encodeUtf8Bytes(payload);
    }

    // Tạo giao dịch
    const tx = await signer.sendTransaction({
      to: sellerAddress,
      value: parseEther(amountEth), // ethers v6
      data: hexData, // Thêm data nếu có payload
    });

    toast.dismiss();
    toast.success("Khởi tạo giao dịch thành công!", {
      position: "bottom-left",
    });
    toast.warning("Giao dịch đã gửi. Chờ xác nhận...", {
      autoClose: false,
      position: "bottom-left",
    });

    await tx.wait();
    toast.dismiss();
    toast.success("Giao dịch thành công!", {
      position: "bottom-left",
    });
  } catch (error) {
    console.error("Lỗi giao dịch:", error);
    toast.dismiss();
    toast.error("Giao dịch thất bại!", {
      position: "bottom-left",
    });
  }
};

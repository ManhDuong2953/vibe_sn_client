import { BrowserProvider, parseEther } from "ethers";
import { toast } from "react-toastify";
import { postData } from "../fetchAPI/fetch_API";
import { API_POST_CONFIRM_PURCHASE } from "../../API/api_server";

const toHex = (str) => {
  return Array.from(new TextEncoder().encode(str))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

export const sendTransaction = async (
  sellerAddress,
  amountEth,
  payload = ""
) => {
  try {
    if (!window.ethereum) {
      toast.error("MetaMask chưa được cài!", { position: "bottom-left" });
      return;
    }

    toast.warning("Đang đăng ký giao dịch...", { position: "bottom-left" });

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    toast.dismiss();
    toast.success("Đăng ký giao dịch thành công", { position: "bottom-left" });

    toast.warning("Đang khởi tạo giao dịch...", {
      autoClose: false,
      position: "bottom-left",
    });

    // Chuyển payload thành hex
    let hexData = JSON.stringify(payload)
      ? "0x" + toHex(JSON.stringify(payload))
      : undefined;

    // Gửi giao dịch
    const tx = await signer.sendTransaction({
      to: sellerAddress,
      value: parseEther(amountEth),
      data: hexData, // Chuyển thành hex trước khi gửi
    });

    toast.dismiss();
    toast.success("Giao dịch đã gửi. Chờ xác nhận...", {
      autoClose: false,
      position: "bottom-left",
    });

    await tx.wait();
    toast.dismiss();
    toast.success("Giao dịch thành công!", { position: "bottom-left" });

    if (tx.hash)
      await postData(API_POST_CONFIRM_PURCHASE, {
        transactionHash: tx.hash, // gửi transactionHash lên BE
        sellerAddress,
        buyerAddress: await signer.getAddress(),
        amount: amountEth,
        productId: payload?.product_id,
      });


  } catch (error) {
    console.error("Lỗi giao dịch:", error);
    toast.dismiss();
    toast.error("Giao dịch thất bại!", { position: "bottom-left" });
  }
};

import { getAuth, signInWithPopup, FacebookAuthProvider } from "firebase/auth";
import { toast } from "react-toastify";

async function ShowPopupLoginWithFacebook() {
  const provider = new FacebookAuthProvider();
  provider.addScope("email");

  const auth = getAuth();
  auth.useDeviceLanguage();

  provider.setCustomParameters({
    display: "popup",
  });

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    return {
      user_id: user.providerData[0].uid,
      user_name: user.providerData[0].displayName,
      user_email: user.providerData[0].email,
      created_at: user.metadata.createdAt,
      user_password: user.providerData[0].displayName,
      media: {
        media_type: "avatar",
        media_link: user.providerData[0].photoURL,
      },
      type_account: "facebook",
    };
  } catch (error) {
    toast.error("Đăng nhập thất bại. Thử lại!");
  }
}

export default ShowPopupLoginWithFacebook;

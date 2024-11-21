import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { toast } from "react-toastify";


export default async function ShowPopupLoginWithGoogle() {
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

    const auth = getAuth();
    auth.useDeviceLanguage();

    provider.setCustomParameters({
        'login_hint': 'user@example.com'
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
                media_type: 'avatar',
                media_link: user.providerData[0].photoURL
            },
            type_account: 'google'
        };
    } catch (error) {

        const email = error.customData?.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        toast.error("Đăng nhập thất bại. Thử lại!")

    }
}

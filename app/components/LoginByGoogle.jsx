import { getAuth, signInWithRedirect, GoogleAuthProvider } from "firebase/auth";

const LoginByGoogle = () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    const loginByGoogle = () => signInWithRedirect(auth, provider);

    return <button onClick={() => loginByGoogle()}>Login by Google</button>;
};

export default LoginByGoogle;
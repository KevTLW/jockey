import { Auth } from "firebase/auth";
import { useRouter } from "next/router";
import nookies from "nookies";

export const useSignOut = (auth: Auth) => {
  const router = useRouter();

  const signOut = () => {
    auth.signOut();
    nookies.destroy({}, "token", { path: "/" });
    router.push("/");
  };

  return signOut;
};

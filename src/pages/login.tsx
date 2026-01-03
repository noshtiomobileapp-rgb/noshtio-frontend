import { useEffect } from "react";

export default function LoginRedirect() {
  useEffect(() => {
    window.location.replace("/vendor/login");
  }, []);

  return null;
}

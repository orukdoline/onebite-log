import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSignInWithPassword } from "@/hooks/mutations/use-sign-in-with-password";
import { useState } from "react";
import { Link } from "react-router";

export default function SignInPage() {
  const [email, setEmail] = useState(""); // Email 정보 저장하는 State.
  const [password, setPassword] = useState(""); // Password 정보 저장하는 State.

  const { mutate: signInWithPassword } = useSignInWithPassword();

  const handleSignInWithPasswordClick = () => {
    if (email.trim() == "") return;
    if (password.trim() == "") return;

    signInWithPassword({
      email,
      password,
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="text-xl font-bold">로그인</div>
      <div className="flex flex-col gap-2">
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Email 정보가 입력될 때마다 Email State 정보 수정.
          className="py-6"
          type="email"
          placeholder="example@abc.com"
        />
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Password 정보가 입력될 때마다 Password State 정보 수정.
          className="py-6"
          type="password"
          placeholder="password"
        />
      </div>
      <div>
        <Button className="w-full" onClick={handleSignInWithPasswordClick}>
          로그인
        </Button>
      </div>
      <div>
        <Link className="text-muted-foreground hover:underline" to={"/sign-up"}>
          계정이 없으시다면? 회원가입
        </Link>
      </div>
    </div>
  );
}

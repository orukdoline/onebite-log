import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSignUp } from "@/hooks/mutations/use-sign-up";
import { useState } from "react";
import { Link } from "react-router";

export default function SignUpPage() {
  const [email, setEmail] = useState(""); // Email 정보 저장하는 State.
  const [password, setPassword] = useState(""); // Password 정보 저장하는 State.

  const { mutate: signUp } = useSignUp(); // 회원가입 기능을 수행하는 Mutate.

  // 회원가입 버튼을 클릭하였을 때 동작하는 이벤트 핸들러.
  const hanleSignUpClick = () => {
    // 입력값 검증.
    if (email.trim() == "") return;
    if (password.trim() == "") return;

    // 회원가입 요청.
    signUp({ email, password });
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="text-xl font-bold">회원가입</div>
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
        <Button className="w-full" onClick={hanleSignUpClick}>
          회원가입
        </Button>
      </div>
      <div>
        <Link className="text-muted-foreground hover:underline" to={"/sign-in"}>
          이미 계정이 있다면? 로그인
        </Link>
      </div>
    </div>
  );
}

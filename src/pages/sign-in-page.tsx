import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSignInWithPassword } from "@/hooks/mutations/use-sign-in-with-password";
import { useState } from "react";
import { Link } from "react-router";
import gitHubLogo from "@/assets/github-mark.svg";
import { useSignInWithOAuth } from "@/hooks/mutations/use-sign-in-with-oauth";
import { toast } from "sonner";
import { generateErrorMessage } from "@/lib/error";

export default function SignInPage() {
  const [email, setEmail] = useState(""); // Email 정보 저장하는 State.
  const [password, setPassword] = useState(""); // Password 정보 저장하는 State.

  const { mutate: signInWithPassword, isPending: isSignInWithPasswordPending } =
    useSignInWithPassword({
      onError: (error) => {
        const message = generateErrorMessage(error); // 에러 메시지를 한국어로 변환.
        toast.error(message, { position: "top-center" }); // 토스트 UI로 에러 문구 출력.
        setPassword(""); // 비밀번호 입력칸 초기화.
      },
    });
  const { mutate: signInWithOAuth, isPending: isSignInWithOAuthPending } =
    useSignInWithOAuth({
      onError: (error) => {
        const message = generateErrorMessage(error);
        toast.error(message, { position: "top-center" });
      },
    });

  const handleSignInWithPasswordClick = () => {
    if (email.trim() == "") return;
    if (password.trim() == "") return;

    signInWithPassword({
      email,
      password,
    });
  };

  const handleSignInWithOAuthClick = () => {
    signInWithOAuth("github");
  };

  // password 로그인, OAuth 로그인 둘 중 하나라도 pending 상태라면 pending 상태로 간주.
  const isPending = isSignInWithPasswordPending || isSignInWithOAuthPending;

  return (
    <div className="flex flex-col gap-8">
      <div className="text-xl font-bold">로그인</div>
      <div className="flex flex-col gap-2">
        <Input
          disabled={isPending}
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Email 정보가 입력될 때마다 Email State 정보 수정.
          className="py-6"
          type="email"
          placeholder="example@abc.com"
        />
        <Input
          disabled={isPending}
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Password 정보가 입력될 때마다 Password State 정보 수정.
          className="py-6"
          type="password"
          placeholder="password"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Button
          disabled={isPending}
          className="w-full"
          onClick={handleSignInWithPasswordClick}
        >
          로그인
        </Button>
        <Button
          disabled={isPending}
          className="w-full"
          variant={"outline"}
          onClick={handleSignInWithOAuthClick}
        >
          <img className="h-4 w-4" src={gitHubLogo} />
          Github 계정으로 로그인
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        <Link className="text-muted-foreground hover:underline" to={"/sign-up"}>
          계정이 없으시다면? 회원가입
        </Link>
        <Link
          className="text-muted-foreground hover:underline"
          to={"/forget-password"}
        >
          비밀번호를 잊으셨나요?
        </Link>
      </div>
    </div>
  );
}

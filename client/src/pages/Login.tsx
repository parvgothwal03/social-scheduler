import { SignIn } from "@clerk/clerk-react";

export default function Login() {
    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <SignIn forceRedirectUrl="/dashboard" signUpFallbackRedirectUrl="/dashboard" />
        </div>
    );
}
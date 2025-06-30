import { LoginFormComponent } from "../components/LogInComponent";
import { Boxes } from "../components/ui/background-boxes";
import { cn } from "../lib/utils";

const LoginPage = () => {
  return (
    <div className="w-full min-h-screen bg-slate-900 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-slate-900 z-10 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
      <Boxes />
      <div className="relative z-20 flex flex-col items-center gap-6">
        <h1 className={cn("md:text-4xl text-xl text-white")}>
          Ven a Betting House y obten la mejor experiencia de apuestas
        </h1>
        <LoginFormComponent />
      </div>
    </div>
  );
};

export default LoginPage;

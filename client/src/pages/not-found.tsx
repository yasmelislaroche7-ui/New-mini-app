import { Link } from "wouter";
import { CyberButton } from "@/components/CyberButton";
import { AlertTriangle } from "lucide-react";
import { MatrixRain } from "@/components/MatrixRain";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black text-primary p-4 overflow-hidden relative">
      <MatrixRain />
      
      <div className="z-10 bg-black/90 p-12 border border-primary/30 backdrop-blur text-center space-y-6 max-w-lg">
        <AlertTriangle className="w-24 h-24 mx-auto text-primary animate-pulse" />
        
        <div className="space-y-2">
          <h1 className="text-6xl font-bold glitch-effect">404</h1>
          <h2 className="text-xl font-mono tracking-widest">SYSTEM ERROR</h2>
        </div>

        <p className="text-primary/60 font-mono">
          The requested data segment could not be located in the matrix.
        </p>

        <Link href="/" className="inline-block pt-4">
          <CyberButton className="w-full min-w-[200px]">
            RETURN TO SOURCE
          </CyberButton>
        </Link>
      </div>
    </div>
  );
}

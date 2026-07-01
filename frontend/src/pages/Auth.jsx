import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { Sparkles, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

const Auth = () => {
  const { user, loading, signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  if (user && !loading) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (isLogin) {
      await signIn(email, password);
    } else {
      await signUp(email, password, displayName);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-background relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-pink-500/20 blur-[120px] pointer-events-none" />

      {/* Left Side - Visuals (hidden on mobile) */}
      <div className="hidden lg:flex flex-1 flex-col justify-center items-center relative z-10 p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-md text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-white/80">Next-gen task management</span>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-6 text-gradient leading-tight">
            Organize your life with unparalleled elegance.
          </h1>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Boost your productivity with a beautifully designed, lightning-fast dashboard that adapts to your workflow.
          </p>
          
          <div className="space-y-4">
            {['Smart prioritization', 'Seamless collaboration', 'Beautiful analytics'].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + (i * 0.1) }}
                className="flex items-center gap-3 text-white/70"
              >
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span>{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="glass rounded-3xl p-8 sm:p-10 relative overflow-hidden">
            {/* Inner glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            
            <div className="relative z-10">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">
                  {isLogin ? 'Welcome back' : 'Create an account'}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {isLogin 
                    ? 'Enter your credentials to access your dashboard' 
                    : 'Join us and start organizing your tasks today'}
                </p>
              </div>

              {/* Custom Tabs */}
              <div className="flex p-1 bg-black/20 rounded-xl mb-8 border border-white/5">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${isLogin ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'text-muted-foreground hover:text-white'}`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${!isLogin ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'text-muted-foreground hover:text-white'}`}
                >
                  Sign Up
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <AnimatePresence mode="wait">
                  {!isLogin && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 0 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="space-y-2 overflow-hidden"
                    >
                      <Label htmlFor="displayName" className="text-white/80">Display Name</Label>
                      <Input 
                        id="displayName" 
                        type="text" 
                        placeholder="John Doe" 
                        value={displayName} 
                        onChange={e => setDisplayName(e.target.value)}
                        className="bg-black/20 border-white/10 focus-visible:ring-primary h-11"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/80">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required 
                    className="bg-black/20 border-white/10 focus-visible:ring-primary h-11"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password" className="text-white/80">Password</Label>
                    {isLogin && <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>}
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    required 
                    className="bg-black/20 border-white/10 focus-visible:ring-primary h-11"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-11 mt-6 bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(103,58,255,0.4)] transition-all group" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <span className="flex items-center gap-2">
                      {isLogin ? "Sign In" : "Create Account"}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
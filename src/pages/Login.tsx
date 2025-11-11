import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, UserCheck, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'admin' | 'mentor'>('admin');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(username, password);
      if (success) {
        toast({
          title: "Login Successful",
          description: `Welcome to the DRDO HR Portal.`,
          duration: 2000,
        });
        navigate(selectedRole === 'admin' ? '/admin' : '/mentor');
      } else {
        setError("Invalid username or password.");
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (role: 'admin' | 'mentor') => {
    setUsername('admin');
    setPassword('admin123');
    setSelectedRole(role);
    setError('');
  };

  return (
    <div className="grid h-screen w-full lg:grid-cols-2">
      <div className="relative hidden lg:flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 via-white to-blue-100 p-12 text-center">
        <div className="relative z-10">
          <img src="/drdo_logo.png" alt="DRDO Logo" className="h-80 mb-10 mx-auto" />
          <blockquote className="space-y-2">
            <p className="text-4xl font-extrabold leading-tight">
              <span className="text-blue-900">Empowering India's Defense</span>
              <br />
              <span className="text-gray-500">Through Innovation</span>
            </p>
          </blockquote>
        </div>
      </div>

      <div className="relative flex items-center justify-center p-4 bg-gradient-to-b from-blue-50 via-white to-blue-100">
        <div className="w-full max-w-lg">
          <Card className="w-full bg-white shadow-xl rounded-none">
            <CardHeader className="text-center">
              <div>
                <CardTitle className="text-3xl font-bold text-blue-900">DRDO Human Resource Portal</CardTitle>
                <CardDescription className="text-base text-gray-500 mt-1">
                  Defense Research & Development Organization
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center uppercase tracking-wider">Select your role to continue</p>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('admin')}
                    className={`p-3 rounded-none border-2 transition-all duration-200 ${
                      selectedRole === 'admin'
                        ? 'bg-blue-700 text-white border-blue-700'
                        : 'bg-transparent text-gray-600 border-gray-300 hover:border-blue-500 hover:text-blue-500'
                    }`}
                  >
                    <Shield className="w-5 h-5 mx-auto mb-2" />
                    <div className="text-sm font-medium uppercase">Admin</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('mentor')}
                    className={`p-3 rounded-none border-2 transition-all duration-200 ${
                      selectedRole === 'mentor'
                        ? 'bg-blue-700 text-white border-blue-700'
                        : 'bg-transparent text-gray-600 border-gray-300 hover:border-blue-500 hover:text-blue-500'
                    }`}
                  >
                    <UserCheck className="w-5 h-5 mx-auto mb-2" />
                    <div className="text-sm font-medium uppercase">Mentor</div>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm uppercase">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="placeholder:text-gray-500 text-sm rounded-none"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm uppercase">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="placeholder:text-gray-500 text-sm pr-10 rounded-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                <Button
                  type="submit"
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white transition-all duration-200 shadow-md hover:shadow-lg text-base py-3 rounded-none uppercase"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>

              <div className="space-y-3">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">
                      Demo Credentials
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleQuickLogin('admin')}
                    className="w-full text-sm rounded-none uppercase"
                  >
                   Quick Login as Admin
                  </Button>
                </div>
              </div>
              <div className="text-center text-xs text-gray-500">
                Need help? <a href="mailto:support@drdo.gov.in" className="underline hover:text-blue-700">Email: support@drdo.gov.in</a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;

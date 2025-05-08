import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { toast } from 'react-toastify';
import BASE_URL from '../config/Base';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login/Signup
  const [email,setEmail] = useState()
  const [password,setPasswrd] = useState()
  const Navigate = useNavigate()
  const handleGuestMode = () => {
    localStorage.removeItem("User")
   Navigate('/dashboard')
  };
  const submitForm=async(e)=>{
    e.preventDeafult
    if(!isLogin){
        try {
            const response = await axios.post(`${BASE_URL}/auth/signup`, { email, password });
      
            // If success, show success pop-up
            if (response.status === 201) {
              toast.success('User created successfully!');
              localStorage.setItem('user', JSON.stringify(response.data.User));
    
              setTimeout(() => {
                Navigate('/dashboard')
              }, 2000);
            }
          } catch (error) {
            // Show error message from backend
            if (error.response && error.response.data && error.response.data.message) {
              toast.error(error.response.data.message);
            } else {
              toast.error('Something went wrong!');
            }
          }
    }
    if(isLogin){
        try {
            const response = await axios.post(`${BASE_URL}/auth/login`, { email, password });
      
            // If success, show success pop-up
            if (response.status === 200) {
              toast.success('User login successfully!');
              localStorage.setItem('User', JSON.stringify(response.data.User));
    
              setTimeout(() => {
                Navigate('/dashboard')
              }, 2000);
            }
          } catch (error) {
            // Show error message from backend
            if (error.response && error.response.data && error.response.data.message) {
              toast.error(error.response.data.message);
            } else {
              toast.error('Something went wrong!');
            }
          }
    }
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center text-indigo-600">
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>

        {/* Form */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e)=>{setEmail(e.target.value)}}
              placeholder="Enter your email"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e)=>{setPasswrd(e.target.value)}}
              placeholder="Enter your password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <button
              type="submit"
              onClick={submitForm}
              className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
          </div>
          
          <div className="text-center">
            <span
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-indigo-600 cursor-pointer hover:text-indigo-500"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
            </span>
          </div>
        </div>

        {/* Guest Mode Button */}
        <div className="mt-4 text-center">
          <button
            onClick={handleGuestMode}
            className="w-full py-2 px-4 bg-gray-200 text-gray-700 font-semibold rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

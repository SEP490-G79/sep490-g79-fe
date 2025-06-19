// "use client";
// import React, { useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import authorizedAxiosInstance from "@/utils/authorizedAxios";
// import { useNavigate } from "react-router-dom";
// import bgImage from "@/assets/dc3.jpg";
// import { toast } from "react-toastify";

// export const Register = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [username, setUsername] = useState("");

//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (password !== confirmPassword) {
//       toast.error("Passwords do not match!");
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await authorizedAxiosInstance.post("/auth/register", {
//         username,
//         email,
//         password,
//       });
//       toast.success("Đăng ký thành công! Vui lòng kiểm tra email để xác thực.");
//       setTimeout(() => {
//         navigate("/login");
//       }, 1500);
//     } catch (error: any) {
//       console.error("Registration failed", error);
//       const errMsg =
//         error.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.";
//       toast.error(errMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="w-screen h-screen flex items-center justify-center bg-background text-foreground relative overflow-hidden">
//       <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-white/10 dark:from-white/10 dark:to-white/5 z-0" />

//       <div className="z-10 w-full max-w-6xl h-4/5 flex shadow-2xl rounded-3xl overflow-hidden backdrop-blur-md bg-card text-card-foreground flex-col md:flex-row">
//         {/* Ảnh chó mèo */}
//         <div className="w-full md:w-1/2 hidden md:block relative">
//           <img
//             src={bgImage}
//             alt="Dog and Cat"
//             className="w-full h-full object-cover"
//           />
//         </div>

//         {/* Form Register */}
//         <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-10 py-8">
//           <h2 className="text-4xl font-extrabold text-primary mb-2 flex items-center gap-2">
//             🐾 Join PawShelter!
//           </h2>
//           <p className="text-muted-foreground mb-6 text-center">
//             Create your account and start your paw-some journey.
//           </p>

//           <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5">
//             <div>
//               <div>
//                 <Label>Username</Label>
//                 <Input
//                   type="text"
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   className="rounded-xl focus:outline-none focus:ring-2 focus:ring-ring"
//                   placeholder="yourname123"
//                   required
//                 />
//               </div>

//               <Label>Email</Label>
//               <Input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="rounded-xl focus:outline-none focus:ring-2 focus:ring-ring"
//                 placeholder="you@example.com"
//                 required
//               />
//             </div>
//             <div>
//               <Label>Password</Label>
//               <Input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="rounded-xl focus:outline-none focus:ring-2 focus:ring-ring"
//                 placeholder="••••••••"
//                 required
//               />
//             </div>
//             <div>
//               <Label>Confirm Password</Label>
//               <Input
//                 type="password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 className="rounded-xl focus:outline-none focus:ring-2 focus:ring-ring"
//                 placeholder="••••••••"
//                 required
//               />
//             </div>
//             <Button
//               type="submit"
//               disabled={loading}
//               className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
//             >
//               {loading ? "Registering..." : "Register"}
//             </Button>
//           </form>

//           <p className="text-sm mt-4">
//             Already have an account?{" "}
//             <a href="/login" className="text-primary hover:underline">
//               Log in
//             </a>
//           </p>
//           <p className="text-xs text-muted-foreground mt-6">
//             © 2025 PawShelter
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

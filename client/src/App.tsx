import { Route, Routes } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import Scheduler from "./pages/Scheduler";
import AIcomposer from "./pages/AIcomposer";
import { Toaster } from "react-hot-toast";
import { AutoReply } from "./pages/AutoReply";
import Analytics from "./pages/Analytics";

export default function App() {
    return (
        <>
            <Toaster position="top-right"/>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                
                {/* Protected Routes */}
                <Route 
                    element={
                        <>
                            <SignedIn>
                                <Layout/>
                            </SignedIn>
                            <SignedOut>
                                <RedirectToSignIn />
                            </SignedOut>
                        </>
                    }
                >
                    <Route path="/dashboard" element={<Dashboard/>}/>
                    <Route path="/accounts" element={<Accounts/>}/>
                    <Route path="/schedule" element={<Scheduler/>}/>
                    <Route path="/ai-composer" element={<AIcomposer/>}/>
                    <Route path="/auto-reply" element={<AutoReply/>}/>
                    <Route path="/analytics" element={<Analytics/>}/>
                </Route>
            </Routes>
        </>
    );
}
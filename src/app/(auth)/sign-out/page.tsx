"use client";
import PageLoading from "@/components/PageLoading/page";
import { successToast } from "@/helpers/toast";
import { AppDispatch } from "@/store";
import { logoutAuthAction, } from "@/store/slices/auth.slice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const SignOutPage = () => {
    const { push} = useRouter()
    const [loading, setLoading] = useState(true)
    const dispatch = useDispatch<AppDispatch>();
 
    
    useEffect(() => {
        console.log('SignOutPage mounted');
        
        const signOut = async () => {
            dispatch(logoutAuthAction())
            await push('/sign-in')     
            successToast('Log out Successfully');
        };
        signOut();
        return () => setLoading(true)
    }, []);

    return <>
        <PageLoading isLoading={loading}/>
    </>
}

export default SignOutPage

// SignOutPage.Layout = EmptyLayout
// SignOutPage.Title = 'sign_out'
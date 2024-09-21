import {PropsWithChildren} from "react";
import {Header} from "./Header.tsx";
import { Footer } from "./Footer.tsx";

export const Layout = ({children}: PropsWithChildren) => {
    return (
       <>
           <div className="bg-white py-24 sm:py-32">
               <div className="mx-auto max-w-7xl px-6 lg:px-8">
           <Header />
           {children}
           <Footer />
               </div>
           </div>
       </>
    )
}
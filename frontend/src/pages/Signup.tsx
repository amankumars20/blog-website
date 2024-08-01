import {Quote} from "../components/Quote"
import {Auth_signup} from "../components/Auth_signup"

export const Signup = () => {
    return(
        <>
         <div className='grid grid-cols-1 lg:grid-cols-2'>
        <div>
            <Auth_signup type="signup"/>
        </div>
        <div className='hidden lg:block'>
            <Quote/>
        </div>
        </div>
            
        </>
    )
}
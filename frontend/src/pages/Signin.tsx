
import {Auth_signin} from "../components/Auth_signin"
import {Quote} from "../components/Quote"

export const Signin = () => {
    return(
        <>
         <div className='grid grid-cols-1 lg:grid-cols-2'>
        <div>
            <Auth_signin type="signin"/>
        </div>
        <div className='hidden lg:block'>
            <Quote/>
        </div>
        </div>
            
        </>
    )
}
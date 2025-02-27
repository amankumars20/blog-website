import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign} from 'hono/jwt'
import { signupInput } from "@amankumars20/blog-website-common_new";
import { signinInput } from "@amankumars20/blog-website-common_new";


export const userRouter = new Hono<
{
    Bindings:{
        DATABASE_URL: string
        JWT_SECRET:string
    }
}>();


userRouter.post('/signup', async (c) => {
    const body = await c.req.json();

    const {success}=signupInput.safeParse(body);
    if(!success){
        c.status(403)
        return c.json(
            {
                massage:"Inputs are Incorrect"
            }
        )
    }

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  
  
  try{
    const user = await prisma.user.create({
        data:{
            email:body.email,
            password:body.password,
        },
      })
    
      //@ts-ignore
      const token = await sign({id:user.id},c.env.JWT_SECRET)
    
      return c.json(
        {jwt:token}
      )
  }catch(e){
        c.status(403)
        return c.json({
            massage:"somthing went worng"
        })
  }
    
  })
  
userRouter.post('/signin', async (c) => {
    const prisma = new PrismaClient({
          datasourceUrl: c.env?.DATABASE_URL,
      }).$extends(withAccelerate());
  
      const body = await c.req.json();
      const user = await prisma.user.findUnique({
          where: {
              email: body.email
          }
      });
  
      if (!user) {
          c.status(403);
          return c.json({ error: "user not found" });
      }
  
      const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
      return c.json({ jwt });
  })
  
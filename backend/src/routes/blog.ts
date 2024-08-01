import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign,verify} from 'hono/jwt'
import { JWTPayload } from "hono/utils/jwt/types";

export const blogRouter = new Hono<
{
    Bindings:{
        DATABASE_URL: string;
        JWT_SECRET:string;
    },
    Variables:{
        userId:string;
    }
}>();

blogRouter.use('/*', async (c, next) => {
    //get the header
    //verify the header
    //verify the header if header exits then okk
    //if not then return 401
    const header = c.req.header('Authorization') || "";
    try{
        const user=await verify(header,c.env.JWT_SECRET);
        if(user){
            c.set("jwtPayload",user.id);
            await next()
        }
        else{
          c.status(403);
          return c.json(
            {
              error:"you are not logged in"
            }
          )
        }
    }catch(e){
        c.status(403);
        return c.json(
          {
            error:"you are not logged in"
          }
        )
    }
    
  })
  

blogRouter.post('/',async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json();
    const userId=c.get("jwtPayload")
    
    try{
        const post=await prisma.post.create({
            data:{
                title: body.title,
                content: body.content,
                authorId:userId
    
            }
        })
        return c.json({
            id:post.id
        })
    }catch(e){
        return c.json({massage:"post could not be created "})
    }
    
  })
  


blogRouter.put('/', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json();

    const post=await prisma.post.update({
        where:{
            id:body.id
        },
        data:{
            title: body.title,
            content: body.content
        }
    })
    return c.json({
        id:post.id
    })
  })
  


//add pegination
blogRouter.get('/bulk',async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    try{
        const posts = await prisma.post.findMany({
            select:{
                content:true,
                title:true,
                id:true,
                author:{
                    select:{
                        name:true
                    }
                }
            }
        });

        return c.json({
            posts
                     })
    }catch(e){
        c.status(403)
        return c.json(
            {
                    massage:"could not load blogs"
            }
        )
    }
    
  })



blogRouter.get('/:id', async (c) => {
    const id=c.req.param("id");
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    try{
            const body = await c.req.json();

            const post=await prisma.post.findFirst({
                where:{
                    id:id
                },select:{
                    id:true,
                    content:true,
                    title:true,
                    author:{
                        select:{
                            name:true
                        }
                    }
                }
            })
            return c.json({
                post
            })
    }catch(e){
        c.status(411)
        return c.json({
            massage:"probelm during the fetching the posts"
        })
    }
  })


//@ts-ignore
import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";
//@ts-ignore
import * as dejs from 'https://deno.land/x/dejs/mod.ts';

const app = new Application();
const router = new Router();

const courseGoals: {id: string, content: string}[] = [];

router.get('/', async (ctx) => {
  const body = await dejs.renderFileToString(Deno.cwd() + '/course_goals.ejs', 
  {
    title: 'My Goals',
    goals: courseGoals
  });
  ctx.response.body = body;
});

router.post("/add-goals", async (ctx) => {
  const { value } = ctx.request.body({ type: "form-data" });
  const formData = await value.read();
  const newGoal = {id: new Date().toISOString(), content: formData.fields.new_goal};
  courseGoals.push(newGoal);
  ctx.response.redirect('/');
});

app.use(router.routes());
app.use(router.allowedMethods());

app.use(async (ctx) => {
  await send(ctx, ctx.request.url.pathname, {
    root: `${Deno.cwd()}/static`,
  });
});

app.listen({ port: 3000 });
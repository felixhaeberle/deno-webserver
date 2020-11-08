// @ts-ignore
import { serve } from 'https://deno.land/std@0.74.0/http/server.ts';

const server = serve({
  port: 3000, 
});

export default server;
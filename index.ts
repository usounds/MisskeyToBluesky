import {
    Application,
    Router,
    ServerRequest,
  } from "https://deno.land/x/oak@v12.5.0/mod.ts";
  import { cont } from './lib.ts'
  
  // アプリケーションを起動する
  async function startApp() {
    const app = new Application();
    const router = new Router();
    
    router.post('/post', cont.create)
    // ルートを登録
    app.use(router.routes());
    app.use(router.allowedMethods());
  
    // アプリケーションを起動
    await app.listen({ port: 8001 });
  }
  
  // アプリケーションの起動を開始
  startApp();
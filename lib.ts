import { RouterContext, helpers } from "https://deno.land/x/oak@v6.5.0/mod.ts";

import twitterText from 'npm:twitter-text';
import AtprotoAPI from 'npm:@atproto/api';

export const cont = {
  
    async create(ctx: RouterContext) {

        const identifier =  Deno.env.get("BLUESKY_IDENTIFIER") || '';
        const password =  Deno.env.get("BLUESKY_PASSWORD") || '';

        const result = ctx.request.body()
        const body= await result.value || ''
        console.log(body)

        // リクエストヘッダにMisskeyシークレットが未設定の場合はエラー
        if(ctx.request.headers.get("x-misskey-hook-secret") !==  Deno.env.get("MISSKEY_SECRET")){
            ctx.response.status = 400
            ctx.response.body = 'invalid secret'
            console.log('invalid secret')
        // Misskeyから投稿以外のWebhockが飛んできたらエラー
        }else if(body.type !== 'note'){
            ctx.response.status = 400
            ctx.response.body = 'invalid type. accept note only'
            console.log('invalid type. accept note only')

        }else{
            // Bluesky認証
            const { BskyAgent, RichText } = AtprotoAPI;
            const agent = new BskyAgent({ service: 'https://bsky.social' });
            await agent.login({ identifier, password});

            // 本文設定
            let text = body.body.note.text;
            console.log(text);

            const rt = new RichText({ text });
            await rt.detectFacets(agent);

            const postObj: Partial<AtprotoAPI.AppBskyFeedPost.Record> &
            Omit<AtprotoAPI.AppBskyFeedPost.Record, 'createdAt'> = {
                $type: 'app.bsky.feed.post',
                text: rt.text,
                facets: rt.facets,
                langs: ["ja"],
                via: 'Misskey to BSKY Proxy'
            };

            //ハッシュタグ抽出
            const hashTags = twitterText.extractHashtagsWithIndices(text);
            postObj.facets = new Array(0);

            for(const obj of hashTags){
                //ハッシュタグまでの文字列とハッシュタグが終わる文字列を取得
                const fromText = text.slice(0,obj.indices[0]);
                const toText = text.slice(0,obj.indices[1]);

                //マルチバイト対応
                const fromIndex = encodeURI(fromText).replace(/%../g, "*").length;
                const toIndex = encodeURI(toText).replace(/%../g, "*").length;

                postObj.facets.push(
                    {
                        index: {
                            "byteStart": fromIndex,
                            "byteEnd":  toIndex
                        },
                        features: [
                            {
                            "$type": "app.bsky.richtext.facet#tag",
                            "tag": obj.hashtag
                            }
                        ]
                    }
                );
            }

            // リンク処理
            const pattern =
                /https?:\/\/[-_.!~*\'a-zA-Z0-9;\/?:\@&=+\$,%#\u3000-\u30FE\u4E00-\u9FA0\uFF01-\uFFE3]+/g;
            const urls = text.match(pattern);

            // URLと出現位置を保持する配列を定義
            let urlArray: {[urlKey: string]: number};
            urlArray = {};

            //URLが取得できたら、URLが出現するまでのバイト数をカウントする
            let pos = 0;

            if(urls!=null){
                for (const url of urls) {
                    console.log(url);
                    pos = encodeURI(text).replace(/%../g, "*").indexOf(url);
                    //URLが見つからない場合は想定外とみなし処理を行わない（正規表現で想定外の検知をしたものは処理をしない）
                    if(pos>=0){
                        urlArray[url] = pos;
                    }
                }
            }

            //URLをリンク化
            Object.keys(urlArray).forEach(function(key) {
                if(typeof postObj.facets !== "undefined"){
                postObj.facets.push(
                    {
                        index: {
                            "byteStart": urlArray[key],
                            "byteEnd":  urlArray[key]+key.length
                        },
                        features: [
                            {
                                "$type": "app.bsky.richtext.facet#link",
                                "uri": key
                            }
                        ]
                    }
                );
                }
            });
            
            //画像処理
            const imgUrls = new Array(0);
            const imgBlob = new Array(0);

            // Noteのfilesは画像しかありえない想定でURL取得
            for (let imgTag of body.body.note.files) {
                imgUrls.push(imgTag.url);
            } 

            //画像の実態を取得
            for(let imgUrl of imgUrls){
                //画像は最大４件まで
                if(imgBlob.length<=3){
                    //画像を取得
                    const res = await fetch(imgUrl)
                    const buffer = await res.arrayBuffer();
                    const blob = new Blob([buffer]);

                    //PDSにアップロード
                    const uploadedImage = await agent.uploadBlob(blob, {
                        encoding: res.headers.get('content-type')
                    });
                    
                    imgBlob.push(uploadedImage);
                }
            }

            if(imgBlob.length>0){
                postObj.embed = {
                $type: 'app.bsky.embed.images',
                };
            
                postObj.embed.images = new Array(0);
            
                for(const obj of imgBlob){
            
                  postObj.embed.images.push({
                    "image": {
                      "cid":      obj.data.blob.ref.toString(),
                      "mimeType": obj.data.blob.mimeType
                    },
                    "alt": ""
                  });
            
                }
            }

            console.log(postObj);
            const result = await agent.post(postObj);
            console.log(result);

            ctx.response.body = "success";
        }
    }
  }

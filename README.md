# MisskeyToBluesky
MisskeyのWebhookを使用して、Blueskyに投稿をクロスポストします。<br>
Deno Deployを使用する想定です。<br>
仕様上、Deno DeployのProjectのURLと、MisskeyのSecretの2つがセットで他人にバレるとBlueskyに自由に投稿できちゃいます。万が一バレた際は、MisskeyのSecretも別のものに変更してください。<br>

# Setup
1.このレポジトリをフォークします<br>
2.Deno Deployで適当なProjectを作ります<br>
3.ProjectのSettingのEnvironment Variablesに下記を登録します<br>
(a)BLUESKY_IDENTIFIER:Blueskyのハンドル<br>
(b)BLUESKY_PASSWORD:BlueskyのハンドルのApp Password<br>
(c)MISSKEY_SECRET:適当なランダム文字列を登録<br>
4.ProjectのSettingのGit Integrationでフォークしたレポジトリのindex.tsにリンクする（もしフォークした時点でGitHub Actionが有効になっている場合は無効にしてください）<br>
5.MisskeyのWebhookに<a href="https://DENOENVDOMAIN.deno.dev/post">https://DENOENVDOMAIN.deno.dev/post</a>（DENOENVDOMAIN.deno.devはProjectのドメイン）、シークレットに3-(c)と同じ値、Webhookを実行するタイミングに「ノートを投稿した時」のみにチェックを入れ、保存

# KnownIssue
- デプロイを行うと、直前の投稿が重複して登録されることがある
- Misskeyのノートの本文がない場合にエラーになる

# デプロイ
- GitHub Actionのマニュアルデプロイを行う際は、DENO_DEPLOY_TOKENとPROJECT_NAMEをsecretに登録ください

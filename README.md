# MisskeyToBluesky
MisskeyのWebhookを使用して、Blueskyに投稿をポストします。<br>
Deno Deployを使用する想定です。<br>
仕様上、MisskeyのSecretが他人にバレるとBlueskyに自由に投稿できちゃいます。万が一バレた際は、MisskeyのSecretも別のものに変更してください。<br>

# Setup
1.このレポジトリをフォークします<br>
2.Deno Deployで適当なProjectを作ります<br>
3.ProjectのSettingのGit Integrationでフォークしたレポジトリのmainブランチを選び、Github Actionを選びLinkする<br>
4.<a href="https://dash.deno.com/account#access-tokens">https://dash.deno.com/account#access-tokens</a>でアクセストークンを取得する<br>
5.ProjectのSettingのEnvironment Variablesに下記を登録します<br>
(a)BLUESKY_IDENTIFIER:Blueskyのハンドル<br>
(b)BLUESKY_PASSWORD:BlueskyのハンドルのApp Password<br>
(c)MISSKEY_SECRET:適当なランダム文字列を自分で考えて登録。２０字文字程度の長い文字列を推奨します<br>
6.MisskeyのWebhookに<a href="https://DENOENVDOMAIN.deno.dev/post">https://DENOENVDOMAIN.deno.dev/post</a>（DENOENVDOMAIN.deno.devはProjectのドメイン）、シークレットに4-(c)と同じ値、Webhookを実行するタイミングに「ノートを投稿した時」のみにチェックを入れ、保存<br>
7.GitHubのフォークしたレポジトリのRepository secretsに下記を登録する<br>
(d)DENO_DEPLOY_TOKEN：4で取得したもの<br>
(e)PROJECT_NAME:2で作成したプロジェクト名<br>
8.GitHub ActionからDenoDeployのWorkflowを実行する

# KnownIssue
- デプロイを行うと、直前の投稿が重複して登録されることがある
- Misskeyのノートの本文がない場合にエラーになる

# Automatic DeployとManual Deployデプロイ
- Deno DeployのAutomatic Deployも利用可能です

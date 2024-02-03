# MisskeyToBluesky
MisskeyのWebhookを使用して、Blueskyに投稿をポストします。<br>
Deno Deployを使用する想定です。<br>
仕様上、MisskeyのSecretが他人にバレるとBlueskyに自由に投稿できちゃいます。万が一バレた際は、MisskeyのSecretを別のものに変更してください。<br>

# Setup
1.このレポジトリの右上の「Use this template」から自身に新しいレポジトリを作成します<br>
2.Deno Deployで適当なProjectを作ります<br>
3.ProjectのSettingのGit Integrationで1で作成したレポジトリのmainブランチ、Autoで「index.ts」を選びLinkする<br>
4.ProjectのSettingのEnvironment Variablesに下記を登録します<br>
(a)BLUESKY_IDENTIFIER:Blueskyのハンドル<br>
(b)BLUESKY_PASSWORD:BlueskyのハンドルのApp Password<br>
(c)MISSKEY_SECRET:適当なランダム文字列を自分で考えて登録。２０字文字程度の長い文字列を推奨します<br>
5.MisskeyのWebhookに<a href="https://DENOENVDOMAIN.deno.dev/post">https://DENOENVDOMAIN.deno.dev/post</a>（DENOENVDOMAIN.deno.devはProjectのドメイン）、シークレットに4-(c)と同じ値、Webhookを実行するタイミングに「ノートを投稿した時」のみにチェックを入れ、保存<br>

# KnownIssue
- デプロイを行うと、直前の投稿が重複して登録されることがある
- Misskeyのノートの本文がない場合にエラーになる

# その他
- Deno DeployのManual Deployも利用可能です。デプロイ先のDeno Deployのプロジェクト名は、Secretに「PROJECT_NAME」で登録してください。（DENO_DEPLOY_TOKENも同様に必要となりますので、事前に取得ください）
- RepositoryのVisivilityはPrivateでOKです

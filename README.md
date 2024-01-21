# MisskeyToBluesky
MisskeyのWebhookからBlueskyに投稿をクロスポストします。<br>
Deno Deployを使用する想定です。<br>
仕様上、Deno DeployのProjectのURLと、MisskeyのSecretの2つがセットで他人にバレるとBlueskyに自由に投稿できちゃいます。万が一バレた際は、ProjectのURLを変えて、MisskeyのSecretも別のものに変更してください。<br>

# Setup
1.このレポジトリをフォークします<br>
2.Deno Deployで適当なProjectを作ります<br>
3.ProjectのSettingのEnvironment Variablesに下記を登録します<br>
(a)BLUESKY_IDENTIFIER:Blueskyのハンドル<br>
(b)BLUESKY_PASSWORD:BlueskyのハンドルのApp Password<br>
(c)MISSKEY_SECRET:適当なランダム文字列を登録<br>
4.ProjectのSettingのGit Integrationでフォークしたプロジェクトのindex.tsにリンクする<br>
5.MisskeyのWebhookに"https://DENOENVDOMAIN.deno.dev/post"、シークレットに3-(c)と同じ値、Webhookを実行するタイミングに「ノートを投稿した時」のみにチェックを入れ、保存


# KnownIssue
- Misskeyのジョブの都合か、投稿が５分後ぐらいに重複して投稿される場合がある
- Misskeyの投稿本文がない場合にエラーになる

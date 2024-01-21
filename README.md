# MisskeyToBluesky
MisskeyのWebhookからBlueskyに投稿をクロスポストします。\n
Deno Deployを使用する想定です。\n
仕様上、Deno DeployのProjectのURLと、MisskeyのSecretの2つがセットで他人にバレるとBlueskyに自由に投稿できちゃいます。万が一バレた際は、ProjectのURLを変えて、MisskeyのSecretも別のものに変更してください。

1.このレポジトリをフォークします\n
2.Deno Deployで適当なProjectを作ります\n
3.ProjectのSettingのEnvironment Variablesに下記を登録します\n
(a)BLUESKY_IDENTIFIER:Blueskyのハンドル\n
(b)BLUESKY_PASSWORD:BlueskyのハンドルのApp Password\n
(c)MISSKEY_SECRET:適当なランダム文字列を登録\n

---
title: "WSL2を使ってWindows10Homeでも快適なDocker環境を構築(Git・エディタも)"
slug: "wsl2-docker"
description: "wsl2というwindows上でLinux動作できる環境を利用してwin10Homeでも楽にdocker環境の構築を行いました。 IPアドレスなどVirtualBox+Vagrantで環境構築する場合は別途設定が必要だったのですが wsl2はホストマシンと同じなので楽でした"
publishedAt: "2020-06-30T15:00:00.000Z"
tags: ["Docker", "WSL2"]
categories: []
emoji: "🐳"
---

# 概要

wsl2というwindows上でLinux動作できる環境を利用してwin10Homeでも楽にdocker環境の構築を行いました。

IPアドレスなどVirtualBox+Vagrantで環境構築する場合は別途設定が必要だったのですが  
wsl2はホストマシンと同じなので楽でした

*   [VirtualBoxとWSLを比較してWSLに乗り換えました](https://ryotatake.hatenablog.com/entry/2019/08/15/wsl_vs_virtualbox)

# 手順

## OSのアップデート

wsl2は下記の要件を満たしていないと利用できないのでアップデートを行います。

> バージョン 2004、ビルド 19041 以上に更新された Windows 10 を実行している。

バージョン確認は `windowsロゴ + R` でプログラム実行画面 → `winver` で実行  
自動更新だと最新の状態とでてしまうので手動での更新が必要です！

*   [公式サイトからアップデート](https://www.microsoft.com/ja-jp/software-download/windows10)

## wslの有効化 & アップデート

いきなりwsl2を入れるということではなく  
wslを有効化してwsl2にバージョンアップするということみたいです

### 管理者としてPowerShell起動

*   [Windows 10 用 Windows Subsystem for Linux のインストール ガイド](https://docs.microsoft.com/ja-jp/windows/wsl/install-win10)

"Linux 用 Windows サブシステム" オプション機能を有効化 → wsl有効化

```
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
```

"仮想マシン プラットフォーム" オプション機能 → wsl2で使用する機能の有効化

```
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

ここで再起動をします

再度PowerShellを管理者で開いてwslの既定バージョンを2にする

```
wsl --set-default-version 2
```

> WSL 2 を実行するには、カーネル コンポーネントの更新が必要です。詳細については https://aka.ms/wsl2kernel を参照してください

このメッセージがでる場合は https://aka.ms/wsl2kernel からダウンロードしてインストールしてください

再度上記のバージョン設定コマンド実行

> WSL2との主な違いは～

と出たら大丈夫です！

```
wsl -l -v
```

でバージョン確認できます

## Linuxディストリビューションのインストール

自分はubuntuにしたので以下はubuntu入れた場合です！

[Microsoft Store](https://aka.ms/wslstore)を開いてubuntuをインストール  
Microsoftアカウントが必要です！

インストール後起動すると初回のみユーザー名とパスワード求められるので設定

これでwsl2の基本設定は完了

`mkdir workspace`でworkspaceフォルダ作成しておく

`pwd`実行で下記のパスになってることを確認  
/home/{ユーザー名}/workspace

ここの中でGitのリポジトリなど管理します！

## エディタ

他のエディタは不明ですがvscodeで作業するものと想定します！

1.  windowsにvscodeインストール（普段エディタがvscodeの場合はスキップ）
2.  拡張機能「Remote-WSL」を入れる
3.  windowsからubuntu起動、作業ディレクトリで`code .`を実行するとubuntu用のエディタが起動される

## GitLab（GitHubもほぼ同様だと思います）

`cd ~/.ssh`

鍵発行（パスワード不要の場合は3回enter）

```
ssh-keygen -t rsa -b 4096 -C {ユーザー名}@example.com
```

クリップボードに公開鍵の内容をコピー

```
clip < ~/.ssh/id_rsa.pub
```

GitLabログイン

1.  右上のアカウント → settings → SSH Keys
2.  クリップボードの内容貼り付け、タイトルはwsl2とかで大丈夫だと思います
3.  Add key

ubuntuのコンソールに戻って`cd ~/.ssh`

`vi config`で設定ファイル作成

接続情報記載する

```~/.ssh/config
Host gitlab                                                                                                                                                                                                                                          
    HostName {Host名}                                                                                                                                                                                                                       
    User {ユーザー名}                                                                                                                                                                                                                              
    IdentityFile ~/.ssh/id_rsa                                                                                                                                                                                                                    
    Port 22                                                                                                                                                                                                                                       
    TCPKeepAlive yes                                                                                                                                                                                                                              
    IdentitiesOnly yes
```

これでGitLabのリポジトリをssh接続でcloneできると思います！

## Docker

[公式サイト](https://www.docker.com/products/docker-desktop)からインストール  
※インストール途中の Configuration は Enable WSL 2 Windows Features のチェックを外さないようにしてください。

これでubuntuでdockerが（docker-composeも）使えるようになりました！
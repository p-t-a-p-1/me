---
title: "Pythonでドラクエのポーカーを実装してみた"
slug: "python-poker"
publishedAt: "2020-05-25T15:00:00.000Z"
tags: ["Python"]
categories: []
emoji: "♠️"
---

# はじめに

今回はドラクエのポーカーを実装してみたいと思います。

通常のポーカーは基本的にplayer同士で行われますが、

*   player同士のリアルタイム対戦機能が大変
*   ブラフ（はったり）が一切なくなる
    *   強いカードと思わせ、相手を降ろして勝つ
    *   弱いカードと思わせ、相手により多くのお金を賭けさせる

こういった理由からplayer同士のポーカーではなく、  
ドラクエのポーカーのような一人用のゲームを実装していこうと思います。

## ゲームの流れ

ポーカーで役を作る → ダブルアップゲームでスコアを倍にしていく  
というのが基本的な流れです。

## 機能要件

### 基本

*   デッキはポーカー、ダブルアップゲーム共に毎回リセット
*   プレイヤーの初期スコアは0
*   ポーカー終了後、1ペア以上の役があればダブルアップゲームスタート
*   ジョーカーはなし

### ポーカー

1.  5枚のカードが配られる
2.  1枚ずつ 変える or 残す を選択
3.  変える を選択したカードを交換
4.  交換後の5枚で役の計算
5.  役の判定を行い、役に応じてスコア決定

### ダブルアップゲーム

1.  5枚のカードが配られる（1枚は表向き、4枚は裏向き）
2.  4枚の裏向きのカードから表向きのカードよりも強いと思うカードを選択
    1.  強い場合はスコアが倍、再度ダブルアップゲームに挑戦できる
    2.  弱い場合はスコアが0、ポーカーから再スタート

## 役・スコアについて

役名

カードの状態

手札の例

スコア

1ペア

同じ数字のペアが1つ

\[♣️-4, ♠︎-4, ♦︎-Q, ♠︎-K, ❤︎-5\]

50

2ペア

同じ数字のペアが2つ

\[♣️-4, ♠︎-4, ♦︎-Q, ♠︎-Q, ❤︎-5\]

100

3カード

同じ数字3枚

\[♣️-4, ♠︎-4, ♦︎-4, ♠︎-Q, ❤︎-5\]

200

ストレート

数字が連続している

\[♣️-3, ♠︎-4, ♦︎-5, ♠︎-6, ❤︎-7\]

300

フラッシュ

マークが全て同じ

\[♠︎-3, ♠︎-4, ♠︎-5, ♠︎-Q, ♠︎-9\]

400

フルハウス

同じ数字3枚 + 1ペア

\[♠︎-3, ♠︎-4, ♠︎-5, ♠︎-Q, ♠︎-9\]

500

フォーカード

同じ数字4枚

\[♠︎-4, ♦︎-4, ♠︎-4, ♣️-4, ❤︎-9\]

1000

ストレートフラッシュ

フラッシュ かつ ストレート

\[♠︎-4, ♠︎-5, ♠︎-6, ♠︎-7, ♠︎-8\]

2000

ロイヤルストレートフラッシュ

フラッシュ かつ ストレート

\[♠︎-10, ♠︎-J, ♠︎-Q, ♠︎-K, ♠︎-A\]

10000

※ 今回はジョーカーなしで実装するのでファイブカード、  
ドラクエだと一番上のロイヤルストレートスライム（マークがスライム）はなしです！

# 実装

下記のクラスを用意しました。他にも良い方法はあると思います。。

## Cardクラス・Deckクラス

[こちらの記事](https://qiita.com/p-t-a-p-1/items/ef34310e5a58fce8d217)で作成したものをそのまま利用しました。

## Playerクラス

```Python
class Player:
    """
    プレイヤーのスコア・手札・ポーカー勝利フラグ
    """

    def __init__(self):
        self.score = 0
        self.hands = []
        self.is_poker_win = True

    def draw_card(self, deck, num=1):
        """
        カードをデッキからドローし手札に加える
        ※異なる枚数がドローされてもok

        Parameters
        ----------
        num : int, default 1
            カードをドローする回数

        Examples
        --------
        >>> player.draw_card(2) # 2枚ドロー [♠︎-J, ♠︎-10]
        >>> player.draw_card(3) # [♦︎-9, ♣️-10, ♠︎-2]
        >>> print(player.hands)
        [♠︎-J, ♠︎-10, ♦︎-9, ♣️-10, ♠︎-2]
        """
        self.hands_store = deck.pick_card(num)
        self.hands.extend(self.hands_store)
```

## Gameクラス

```Python
class Game:
    """
    メインゲーム

    Examples
    --------
    >>> game = Game()
    >>> game.main() # ゲームスタート（下記の初期フェーズが表示）

    """

    RANKS = (*"23456789", "10", *"JQKA")
    VALUES = (range(2, 14 + 1))
    # 表示マークとスコアを紐づける
    RANK_TO_VALUES = dict(zip(RANKS, VALUES))

    def main(self):
        """
        ゲーム全体（ポーカー + ダブルアップチャンス）
        """
        can_play_game = True

        while can_play_game:

            # ゲームごとにplayer情報リセット
            player = Player()

            # 山札セット（セット数を決める） = ゲームごとに山札再構築
            deck = stock.Deck()
            poker = Poker(deck, player)
            poker.main_game()

            # 役ありはダブルアップチャンス
            print(player.is_poker_win)
            if player.is_poker_win:
                bonus_game = DoubleUp(player)
                bonus_game.main_game()

            # ゲームリスタート
            restart_msg = "Qでゲーム終了、それ以外でゲームスタート："
            start_res = input(restart_msg)
            if start_res == 'Q':
                can_play_game = False


if __name__ == '__main__':
    game = Game()
    game.main()
```

## Pokerクラス

### 役判定について

役判定については下記のフローチャートのようになってます。

![poker.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/462329/25613806-daaa-b40d-a3b1-10263f704c7f.png)

```Python
class Poker:

    RANKS = (*"23456789", "10", *"JQKA")
    VALUES = (range(2, 14 + 1))
    # 表示マークとスコアを紐づける
    RANK_TO_VALUES = dict(zip(RANKS, VALUES))

    def __init__(self, deck, player):
        self.deck = deck
        self.player = player

    def change_hands(self, player_hands):
        """
        カードを1枚ずつ交換選択させ、交換後の手札を返す

        Parameters
        ----------
        player_hands : list
            カード交換する前のplayerの山札

        Returns
        --------
        changed_hands : list
            カード交換した後のplayerの山札
        """

        changed_hands = []

        # それぞれのカードを「のこす」か「かえる」のどちらかを選択
        print("Enter \"y\" to replace the card.")

        for card_idx, change_card in enumerate(player_hands):
            change_card_msg = f"{change_card}："
            change_card_res = input(change_card_msg)

            # 変える場合は山札からドローしてカードを交換
            if change_card_res == "y":
                # デッキからドローして上書き
                change_card = self.deck.pick_card(1)[0]
                self.player.hands[card_idx] = change_card

            # 連想配列に追加
            check_card_set = str(change_card).split("-")
            # ❤︎
            card_mark = check_card_set[0]
            # K
            card_rank = check_card_set[1]
            # 13
            card_number = self.RANK_TO_VALUES[card_rank]
            # チェック用の辞書に追加
            changed_hands.append({
                "mark": card_mark,
                "rank": card_rank,
                "number": card_number
            })
        return changed_hands

    def calc_hand(self, check_hands):
        """
        手札から役の計算

        Parameters
        ----------
        check_hands : list
            カード交換した後のplayerの山札

        Returns
        --------
        hand_results : dict
            playerの山札のそれぞれの役の状態
        """

        # フラッシュ（マークが同じ）
        is_flash = True
        # ストレート（数字が連番）
        is_straight = True
        # 同じ数字のカウント
        same_number_count = 0
        same_number = 0
        # ペア数（1ペアや2ペア）
        match_pair_count = 0

        # 手札からカードの数字をもとに昇順に並べ替え
        check_hands_sorted = sorted(check_hands, key=lambda x: x["number"])

        # カード5枚から1枚ずつチェック
        for check_idx, check_card in enumerate(check_hands_sorted):

            # 1枚目は前のカードがないのでスキップ
            if check_idx == 0:
                continue

            # 前のカード {'mark': '♠︎', 'rank': '4', 'number': 4}
            prev_card = check_hands_sorted[check_idx - 1]

            # 前後のマーク違う場合はフラッシュ判定をFalse
            if is_flash and check_card["mark"] != prev_card["mark"]:
                is_flash = False

            # 前後で数字が連続していない場合はストレート判定をFalse
            if is_straight and check_card["number"] != prev_card["number"] + 1:
                is_straight = False

            # 前後で数字が一致してる場合は 同じ数字のカウント を+1
            if check_card["number"] == prev_card["number"]:
                # マッチ数 + 1
                same_number_count += 1

                # 最後のカード
                if check_idx == 4:
                    if same_number_count == 1:
                        # ペア数 + 1
                        match_pair_count += 1
                    else:
                        # 3カードや4カード
                        same_number = same_number_count + 1

            # 違う数字の場合
            else:
                if same_number_count == 1:
                    # ペア数 + 1
                    match_pair_count += 1
                elif same_number_count > 1:
                    # 3カードや4カード
                    same_number = same_number_count + 1
                # 違う数字なのでリセット
                same_number_count = 0

        # 手札のそれぞれの役の状態
        hand_results = {
            "is_flash": is_flash,
            "is_straight": is_straight,
            "same_number_count": same_number_count,
            "same_number": same_number,
            "match_pair_count": match_pair_count
        }
        return hand_results

    def showdown_hand(self, hand_status, check_hands):
        """
        役の状態から役の決定、スコア計算

        Parameters
        ----------
        hand_status : dict
            カード交換した後のplayerの役の状態
        check_hands : list
            playerの手札

        Returns
        --------
        hand_result_msg : str
            役の判定文
        """

        # 結果
        hand_result_msg = ""

        # フラッシュかつストレート
        if hand_status["is_flash"] and hand_status["is_straight"]:
            # 最小のカードが10,最大のカードが14(A)
            if check_hands[0]["number"] == 10 and  \
                    check_hands[4]["number"] == 14:
                hand_result_msg = "ロイヤルストレートフラッシュ"
                self.player.score = 10000
            else:
                hand_result_msg = "ストレートフラッシュ"
                self.player.score = 2000
        # 4カード
        elif hand_status["same_number"] == 4:
            hand_result_msg = "4カード"
            self.player.score = 1000

        # 3カード, フルハウス判定
        elif hand_status["same_number"] == 3:
            # 3カードかつペアが1
            if hand_status["match_pair_count"] == 1:
                hand_result_msg = "フルハウス"
                self.player.score = 500
            else:
                hand_result_msg = "3カード"
                self.player.score = 250

        # フラッシュ
        elif hand_status["is_flash"]:
            hand_result_msg = "フラッシュ"
            self.player.score = 400

        # ストレート
        elif hand_status["is_straight"]:
            hand_result_msg = "ストレート"
            self.player.score = 300

        # 2ペア
        elif hand_status["match_pair_count"] == 2:
            hand_result_msg = "2ペア"
            self.player.score = 200

        # １ペア
        elif hand_status["match_pair_count"] == 1:
            hand_result_msg = "1ペア"
            self.player.score = 150

        return hand_result_msg

    def main_game(self):
        """
        ポーカーのメインゲーム
        """

        print("Poker Game start")

        # 最初は5枚ドロー
        self.player.draw_card(self.deck, 5)

        # 初期カード表示
        print(f"player's hands：{self.player.hands}")

        # カード交換フェイズ
        check_hands = self.change_hands(self.player.hands)

        # 交換後のカード表示
        print(f"player's hands：{self.player.hands}")

        # 手札の数字をもとに昇順にソート
        check_hands_sorted = sorted(check_hands, key=lambda x: x["number"])

        # 手札から役の計算
        hand_results = self.calc_hand(check_hands_sorted)
        print(hand_results)
        # 役判定
        hand_result_msg = self.showdown_hand(hand_results, check_hands_sorted)

        # 何もない場合は負け
        if hand_result_msg == "":
            hand_result_msg = "役はありませんでした..."
            self.player.is_poker_win = False

        # 結果出力
        print(hand_result_msg)
```

## DoubleUpクラス

```Python
import re
from deck import stock


class DoubleUp:

    RANKS = (*"23456789", "10", *"JQKA")
    VALUES = (range(2, 14 + 1))
    # 表示マークとスコアを紐づける
    RANK_TO_VALUES = dict(zip(RANKS, VALUES))

    def __init__(self, player):
        self.player = player
        self.is_game_win = True

    def add_check_hands(self, player_hands):
        """
        カードを1枚ずつ表示して番号を割り振る

        Parameters
        ----------
        player_hands : list
            手札5枚

        Returns
        --------
        check_hands : list
            playerの手札
        """

        check_hands = []
        for card_idx, card_val in enumerate(player_hands):

            # 連想配列に追加
            check_card_set = str(card_val).split("-")
            # ❤︎
            card_mark = check_card_set[0]
            # K
            card_rank = check_card_set[1]
            # 13
            card_number = self.RANK_TO_VALUES[card_rank]
            # チェック用の辞書に追加
            check_hands.append({
                "mark": card_mark,
                "rank": card_rank,
                "number": card_number
            })
            # 1番目は選択できない
            if card_idx >= 1:
                # 隠す
                # print(f"{card_idx}：*-*")
                print(f"{card_idx}：{card_val}")

        return check_hands

    def win_judge_selected_card(self, input_res, check_hands):
        """
        ゲームの勝利判定（選択したカードと表向きのカードを比較）

        Parameters
        ----------
        input_res : str
            コマンドに入力された数字
        check_hands : list
            playerの手札
        """

        if re.compile(r'^[1-4]+$').match(input_res) is not None:
            # 選んだ番号のカードと表向きのカードの数字の大きさ比較
            if check_hands[int(input_res)]["number"] >= check_hands[0]["number"]:
                # 大きければスコア２倍
                print("win!")
                self.player.score *= 2
            else:
                # 小さい場合, スコアは0になり、再度ポーカーからスタート
                print("lose..")
                self.player.score = 0
                self.is_game_win = False
        else:
            print("ダメです")

    def main_game(self):
        """
        ダブルアップのメインゲーム
        """

        while self.is_game_win:
            # 山札再構築
            self.deck = stock.Deck()
            print("double-Up Chance Game start")
            print(f"Now, your score is {self.player.score} points.")
            self.player.hands = []

            # デッキから5枚のカードを配る
            self.player.draw_card(self.deck, 5)

            # 5枚中1枚が表、4枚は裏向きでセット
            print(f"player's hands：{self.player.hands[0]}, *-*, *-*, *-*, *-*")

            # カードを1枚ずつ表示して番号を割り振る
            check_hands = self.add_check_hands(self.player.hands)

            # 4枚の裏向きカードの中から、表向きのカードの数字より強いものを1枚選ぶ
            card_select_msg = f"Enter a card number that is stronger than {self.player.hands[0]}："
            card_select_res = input(card_select_msg)

            # １〜４までの数字から１つ選ぶ
            self.win_judge_selected_card(card_select_res, check_hands)

            print(self.player.score)
```

# 動作

```
$ python main.py
Poker Game start

player's hands：[❤︎-4, ♠︎-9, ♣️-4, ♠︎-3, ♠︎-2]
Enter "y" to replace the card.
❤︎-4：
♠︎-9： y
♣️-4：
♠︎-3： y
♠︎-2： y
player's hands：[❤︎-4, ❤︎-K, ♣️-4, ♠︎-K, ♣️-6]
2ペア

double-Up Chance Game start
Now, your score is 100 points.
player's hands：♠︎-6, *-*, *-*, *-*, *-*
1：*-*
2：*-*
3：*-*
4：*-*
Enter a card number that is stronger than ♠︎-6： 2
Selected card is ❤︎-12
win!
200

double-Up Chance Game start
Now, your score is 200 points.
player's hands：♠︎-K, *-*, *-*, *-*, *-*
1：*-*
2：*-*
3：*-*
4：*-*
Enter a card number that is stronger than ♠︎-K： 3
Selected card is ♦︎-2
lose..
0

Qでゲーム終了、それ以外でゲームスタート：Q
```

※今回作成した全ファイルは[こちら](https://github.com/p-t-a-p-1)に載せております。
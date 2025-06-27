---
title: Pythonでトランプゲームのブラックジャックを実装してみた
slug: python-brackjack
publishedAt: '2020-05-15T15:00:00.000Z'
tags:
  - Python
categories: []
emoji: ♣️
description: >-
  今回はブラックジャックのメインゲーム機能を実装してみました。  
  実際にプログラムを書き、既存の要件からどう言った部分を自分だったら拡張するか？とか考えたりして色々勉強になったと思います！
category: backend
readingTime: 4
difficulty: beginner
wordCount: 14113
lastOptimized: '2025-06-26T15:10:08.251Z'
---

# はじめに

今回はブラックジャックのメインゲーム機能を実装してみました。  
実際にプログラムを書き、既存の要件からどう言った部分を自分だったら拡張するか？とか考えたりして色々勉強になったと思います！

# 機能要件

基本的なルール・要件はこちらの[プログラミング入門者からの卒業試験は『ブラックジャック』を開発すべし](https://qiita.com/hirossyi73/items/cf8648c31898216312e5)にあるものをそのまま参考にさせていただきました！

> *   初期カードは52枚。引く際にカードの重複は無いようにする
> *   プレイヤーとディーラーの2人対戦。プレイヤーは実行者、ディーラーは自動的に実行
> *   実行開始時、プレイヤーとディーラーはそれぞれ、カードを2枚引く。引いたカードは画面に表示する。ただし、**ディーラーの2枚目のカードは分からないようにする**
> *   その後、先にプレイヤーがカードを引く。プレイヤーが21を超えていたらバースト、その時点でゲーム終了
> *   プレイヤーは、カードを引くたびに、次のカードを引くか選択できる
> *   プレイヤーが引き終えたら、その後ディーラーは、自分の手札が17以上になるまで引き続ける
> *   プレイヤーとディーラーが引き終えたら勝負。より21に近い方の勝ち
> *   JとQとKは10として扱う
> *   **Aはとりあえず「1」としてだけ扱う。**「11」にはしない
> *   ダブルダウンなし、スプリットなし、サレンダーなし、その他特殊そうなルールなし

今回はこれらの要件に加え、以下の機能を追加してみました。

*   Aを1, 11とし2つスコア計算できるように
*   1回のプログラム実行でゲームを複数回できるように

# 実装

下記のクラスを用意しそれぞれファイルを分けました。  
CardクラスとDeckクラスは他のトランプゲームでも使えるようにブラックジャック固有の仕様は入れておりません。

*   Cardクラス ... カード単体
*   Deckクラス ... Cardクラスを利用した山札
*   PlayerクラスとDealerクラス ... 子と親。DealerクラスはPlayerクラスを継承
*   Gameクラス ... PlayerクラスとDealerクラスをインスタンス引数にもちゲームのメイン機能
*   BlackJackクラス ... ブラックジャックに関するもの

## Cardクラス・Deckクラス

[こちらの記事](https://qiita.com/p-t-a-p-1/items/ef34310e5a58fce8d217)で作成したものをそのまま利用しました

## Playerクラス・Dealerクラス

```python
from bj import BlackJack


class Player:
    """
    子（手動で操作できるプレイヤー）
    """

    def __init__(self):
        self.win_count = 0
        self.hands = []
        self.card_current_score = 0
        self.card_current_score_sub = 0
        self.has_A_card = False

    def keep_drawing_card(self, deck):
        """
        playerに hit or stand 決めさせる
        （stand で player のターンが終了）

        Parameters
        ----------
        deck : deck
            カードひと組
        """
        want_to_draw = True
        while want_to_draw:
            hit_or_stand_msg = "\nHit(1) or Stand(2) : "
            hit_or_stand_res = input(hit_or_stand_msg)
            if hit_or_stand_res == "1":
                # hit の場合は1枚ドロー
                self.draw_card(deck)
                print(f"player draw card is : {self.hands[-1]}")
                BlackJack.calc_current_score(self)
                sub_score = ""
                if self.has_A_card is True:
                    sub_score = \
                        f", {self.card_current_score_sub}"
                print(
                    f"players's total_score : \
{self.card_current_score}{sub_score}")

                # バーストでplayerターン強制終了
                if BlackJack.is_score_bust(int(self.card_current_score)) and \
                    BlackJack.is_score_bust(
                        int(self.card_current_score_sub)):
                    print("player bust!!!")
                    want_to_draw = False

                if self.card_current_score == 21 or \
                        self.card_current_score_sub == 21:
                    # 21になった時点で強制終了
                    want_to_draw = False

            elif hit_or_stand_res == "2":
                # standの場合はターン終了
                want_to_draw = False
            else:
                # 1, 2以外のコマンドは再度入力させる
                print("ダメです")

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


class Dealer(Player):
    """
    親（自動操作）
    """

    def keep_drawing_card(self, deck):
        """
        dealerは17超えるまで自動でカードを引き続ける
        17超えたら終了

        Parameters
        ----------
        deck : object
            現在の手札
        """
        self.has_A_card = False
        while self.card_current_score < 17 or \
                self.card_current_score_sub < 17:
            self.draw_card(deck)
            print(f"dealer draw card is : {self.hands[-1]}")
            BlackJack.calc_current_score(self)
            sub_score = ""
            if self.has_A_card:
                sub_score = \
                    f", {self.card_current_score_sub}"
            print(
                f"dealer's total_score : {self.card_current_score}{sub_score}")
            if BlackJack.is_score_bust(self.card_current_score) and \
                    BlackJack.is_score_bust(
                    int(self.card_current_score_sub)):
                print("dealer bust!!!")

```

## Gameクラス

```python
from deck import stock
import role
from bj import BlackJack


class Game:
    """
    メインゲーム（インスタンス作成時にplayerとdealerインスタンス作成）

    Examples
    --------
    >>> game = Game()
    >>> game.main() # ゲームスタート（下記の初期フェーズが表示）
    dealer's hands : [❤︎-7, *-*]

    player's hands : [♠︎-9, ♦︎-J]
    players's total_score : 19

    Hit(1) or Stand(2) :
    """

    def __init__(self):
        # playerとdealer作成
        self.player = role.Player()
        self.dealer = role.Dealer()

    def get_nearest_score(self, score_list):
        """
        メインスコアとサブスコアから21以下で21にもっとも近い数字を返す
        どちらも21超えてる場合は0を返す

        Parameters
        ----------
        score_list : list
            メインスコアとサブスコアのリスト

        Returns
        --------
        main_score : int
            2つのスコアのうち21に近い数字（どちらも21より大きい場合は0）
        """
        main_score = 0
        for score in score_list:
            if score > 21:
                # 21より大きい数字はバースト
                continue
            elif main_score < score:
                main_score = score
        return main_score

    def judge_winner(self, player, dealer):
        """
        勝敗判定

        Parameters
        ----------
        dealer : object
            親
        player : object
            子
        """

        # player, dealer の各スコアで21以下の21に近い方を取得し比較
        player_score_list = [
            player.card_current_score,
            player.card_current_score_sub]
        player_score = self.get_nearest_score(player_score_list)

        dealer_score_list = [
            dealer.card_current_score,
            dealer.card_current_score_sub]
        dealer_score = self.get_nearest_score(dealer_score_list)

        judge_win = ""
        # どちらもバーストはdraw
        if player_score == 0 and dealer_score == 0:
            judge_win = "---draw---"

        if dealer_score < \
                player_score <= 21:
            # dealer < player <= 21の時、playerの勝利
            judge_win = "player win!"
            player.win_count += 1
        elif player_score <= 21 \
                < dealer_score:
            # player が21以下、dealerがバーストはplayerの勝利
            judge_win = "player win!"
            player.win_count += 1
        elif player_score == dealer_score \
                and player_score <= 21:
            # どちらもバーストせず、同じ数字の場合は引き分け
            judge_win = "---draw---"
        else:
            # それ以外の場合は全部playerの負け
            judge_win = "dealer win!"
            dealer.win_count += 1
        # コンソール表示
        print(f"\n/***********/\n/{judge_win}/\n/***********/")

    def display_final_result(
            self,
            player_win_count,
            dealer_win_count,
            total_count):
        """
        勝敗判定

        Parameters
        ----------
        player_win_count : int
            playerの勝利回数
        dealer_win_count : int
            dealerの勝利回数
        total_count : int
            総ゲーム数
        """
        # 総ゲーム数からplayerとdealerの勝利数引いてドローの回数計算
        draw_count = total_count - player_win_count - dealer_win_count
        return f"""\
*-*-*-*-*-*-*-*
total：{total_count}
win：{player_win_count}
lose：{dealer_win_count}
draw：{draw_count}
*-*-*-*-*-*-*-*\
"""

    def main(self):
        """
        ブラックジャックのメインゲーム関数
        """

        # 山札セット（セット数を決める）
        deck = stock.Deck()

        total_count = 0
        can_play_game = True
        # 残りカードが5枚以上の場合
        while can_play_game and len(deck.cards) > 5:

            self.player.hands = []
            self.dealer.hands = []

            # ゲーム数+1
            total_count += 1

            # 最初は２枚ずつドロー
            self.player.draw_card(deck, 2)
            self.dealer.draw_card(deck, 2)

            # player初期スコア計算
            BlackJack.calc_current_score(self.player)
            # A引いてる場合はサブスコアも表示
            player_sub_score = BlackJack.check_draw_A(self.player)

            # 初期ドロー時のスコア表示（dealer側の1枚は伏せる）
            print("\n--Game Start--\n")
            first_msg = f"""\
dealer's hands : [{self.dealer.hands[0]}, *-*]
player's hands : {self.player.hands}

players's total_score : {self.player.card_current_score}{player_sub_score}\
            """
            print(f"{first_msg}")

            # playerに hit or stand 決めさせる（stand で player のターンが終了）
            self.player.keep_drawing_card(deck)

            print("\n--Result--\n")

            # dealerスコア計算
            BlackJack.calc_current_score(self.dealer)
            # A引いてる場合はサブスコアも表示
            dealer_sub_score = BlackJack.check_draw_A(self.dealer)
            dealer_msg = f"""\
dealer's hands : {self.dealer.hands}
dealer's total_score : {self.dealer.card_current_score}{dealer_sub_score}\
            """
            print(f"{dealer_msg}")

            # dealerの手札の合計が17になるまで引く
            self.dealer.keep_drawing_card(deck)

            # 勝敗判定
            self.judge_winner(self.player, self.dealer)

            print("\n--Game End--\n")

            # ゲームリスタート
            restart_msg = "Qでゲーム終了、それ以外でゲームスタート："
            start_res = input(restart_msg)
            if start_res == 'Q':
                can_play_game = False

        # ゲーム回数や勝利回数など計算して表示
        final_score_str = self.display_final_result(
            self.player.win_count, self.dealer.win_count, total_count)
        print(final_score_str)


if __name__ == '__main__':
    game = Game()
    game.main()
```

## BlackJackクラス

```python
class BlackJack:
    """
    ブラックジャックのルールに関するもの
    """

    RANKS = (*"A23456789", "10", *"JQK")
    values = list(range(1, 11))  # 1〜10
    values.extend([10, 10, 10])  # JQK
    VALUES = (values)
    # 表示マークとスコアを紐づける
    # {'A': 1, '2': 2, '3': 3, '4': 4, '5': 5,
    #  '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
    #  'J': 10, 'Q': 10, 'K': 10}
    RANK_TO_VALUES = dict(zip(RANKS, VALUES))

    @classmethod
    def calc_current_score(cls, person):
        """
        現在のスコアを計算

        Parameters
        ----------
        person : object
            現在の手札

        Returns
        --------
        card_current_score : int
            現在のスコア
        """
        person.card_current_score = 0
        person.card_current_score_sub = 0
        person.has_A_card = False
        for card in person.hands:
            card_rank = str(card).split("-")[1]
            card_value = cls.RANK_TO_VALUES[card_rank]

            # Aの時も考慮
            person.card_current_score += card_value
            person.card_current_score_sub += card_value
            if card_value == 1:
                if person.has_A_card:
                    # Aが連続した時サブスコアで2重でサブスコア加算されるので+10(+11-1)
                    person.card_current_score_sub += 10
                    print(person.card_current_score_sub)
                    continue
                person.has_A_card = True
                person.card_current_score_sub += 11

    @classmethod
    def is_score_bust(cls, total_score):
        """
        現在のスコアを計算

        Parameters
        ----------
        current_hands : list
            現在の手札

        Returns
        --------
        True or False
            バーストでTrue
        """
        return total_score > 21

    @classmethod
    def check_draw_A(cls, person):
        """
        手札にAがある場合はサブスコアも表示

        Parameters
        ----------
        person : object
            player or dealer

        Returns
        --------
        person_sub_score : str
            サブスコア用文字列（手札にAない場合は空文字）
        """
        person_sub_score = ""
        if person.has_A_card is True:
            person_sub_score = f", {person.card_current_score_sub}"
        return person_sub_score
```

# 悩んだ点

## Aのスコア計算について（Playerクラスのcalc\_current\_score）

こちらは悩みましたが自分は最初からサブスコアを用意しておいて、A引いた場合にコンソール表示、  
スコア計算の際はメインは+1、サブは+11として実装してみました。他にもっと良い方法はあると思います。  
Aを1としてスコア計算するところまではかなりスムーズに実装できましたが、  
サブスコアを用意する方法にしたことによって  
スコア計算の処理が増えてしまったのは少し失敗したかな...と思ってます。

## 複数スコアの勝利判定（Gameクラスのget\_nearest\_score、judge\_winner）

今回はplayerとdealerそれぞれ2つのスコアを持っており、  
お互いのリストの中で21を越えずに21により近いものを判定用のスコアとしました。

2スコアともバーストの場合は0、片方がバーストの場合はもう片方が判定用スコアになります。  
→ playerは17以上とかはない（16でドロー終了とかあるので）  
→ dealerは2スコアとも17超えるまで自動でドロー

# 動作

実行するとこんな感じです。最後にゲーム数とplayerの勝利回数が表示されます。

```
$ python main.py 

--Game Start--

dealer's hands : [❤︎-J, *-*]
player's hands : [♦︎-3, ♠︎-3]

players's total_score : 6            

Hit(1) or Stand(2) : 1
player draw card is : ♠︎-Q
players's total_score : 16

Hit(1) or Stand(2) : 1
player draw card is : ♠︎-5
players's total_score : 21

--Result--

dealer's hands : [❤︎-J, ♦︎-5]
dealer's total_score : 15            
dealer draw card is : ❤︎-Q
dealer's total_score : 25
dealer burst!!!

/***********/
/player win!/
/***********/

--Game End--

Qでゲーム終了、それ以外でゲームスタート：

--Game Start--

dealer's hands : [♠︎-10, *-*]
player's hands : [♠︎-8, ♦︎-8]

players's total_score : 16            

Hit(1) or Stand(2) : 2

--Result--

dealer's hands : [♠︎-10, ♣️-A]
dealer's total_score : 11, 22            
dealer draw card is : ♣️-5
dealer's total_score : 16, 27
dealer draw card is : ♣️-Q
dealer's total_score : 26, 37
dealer burst!!!

/***********/
/player win!/
/***********/

--Game End--

Qでゲーム終了、それ以外でゲームスタート：

--Game Start--

dealer's hands : [❤︎-K, *-*]
player's hands : [♦︎-A, ♠︎-7]

players's total_score : 8, 19            

Hit(1) or Stand(2) : 2

--Result--

dealer's hands : [❤︎-K, ♠︎-J]
dealer's total_score : 20            

/***********/
/dealer win!/
/***********/

--Game End--

Qでゲーム終了、それ以外でゲームスタート：Q
*-*-*-*-*-*-*-*
total：3
win：2
lose：1
draw：0
*-*-*-*-*-*-*-*
```

# おわり

ダブルダウンとスプリットについては今後の課題です。

※今回作成した全ファイルは[こちら](https://github.com/p-t-a-p-1/bj_2.0)に載せております。  
現在同じようにブラックジャック実装している方の参考になればと思います！

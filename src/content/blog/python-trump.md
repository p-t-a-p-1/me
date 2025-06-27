---
title: Pythonでトランプのカードゲームを実装してみた
slug: python-trump
publishedAt: '2020-05-05T15:00:00.000Z'
tags:
  - Python
categories: []
emoji: "\U0001F0CF"
description: '## はじめに'
category: backend
readingTime: 2
difficulty: beginner
wordCount: 4155
lastOptimized: '2025-06-26T15:10:08.253Z'
---

## はじめに

Pythonの入門として、[プログラミング入門者からの卒業試験は『ブラックジャック』を開発すべし](https://qiita.com/hirossyi73/items/cf8648c31898216312e5)に挑戦しようと思います。要件はそのまま参考にしております。不慣れな点もあるのでこここうしたらいいよ！とかあるとコメントいただきたいです！

## 実装前にやったこと

Pythonの構文などの学習については下記を参考に行いました。

*   [独学プログラマー Python言語の基本から仕事のやり方まで](https://www.amazon.co.jp/%E7%8B%AC%E5%AD%A6%E3%83%97%E3%83%AD%E3%82%B0%E3%83%A9%E3%83%9E%E3%83%BC-Python%E8%A8%80%E8%AA%9E%E3%81%AE%E5%9F%BA%E6%9C%AC%E3%81%8B%E3%82%89%E4%BB%95%E4%BA%8B%E3%81%AE%E3%82%84%E3%82%8A%E6%96%B9%E3%81%BE%E3%81%A7-%E3%82%B3%E3%83%BC%E3%83%AA%E3%83%BC%E3%83%BB%E3%82%A2%E3%83%AB%E3%82%BD%E3%83%95/dp/4822292274/ref=tmm_hrd_swatch_0?_encoding=UTF8&qid=1588765972&sr=8-2)
    
*   [N予備校 - 機械学習入門](https://www.nnn.ed.nico/pages/programming/)
    
    ​ 機械学習の前にPythonで何か実装してみたかったのでPython入門までやりました
    

## 実装について

ブラックジャックのゲームの前に、カードゲームの基本であるトランプのデッキの機能が必要だと思ったのでそこからスタートしようと思います。

### Cardクラス

Cardクラスから生成されたインスタンスにマークと数字の引数を持たせてカード情報を取得します。

```python:card.py
#!/usr/bin/env python
# coding: UTF-8


class Card:
    """
    カードのマークと数字を出力
    Attributes
    ----------
    card_mark : int
        カードのマーク（♠︎❤︎♦︎♣︎）
    card_value : int
        カードの数字
    """

    # マーク
    MARKS = ("♠︎-", "❤︎-", "♦︎-", "♣️-")
    # 数字
    VALUES = (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13)

    def __init__(self, card_mark, card_value):
        """
        Parameters
        ----------
        card_mark : int
            カードのマーク（♠︎❤︎♦︎♣︎）
        card_value : int
            カードの数字
        """
        self.mark = card_mark
        self.value = card_value

    # オーバーライドしてインスタンスの出力内容を変更
    def __repr__(self):
        return self.MARKS[self.mark] + str(self.VALUES[self.value])
```

上記Cardクラス単体で実行すると下記のようになります。  
reprメソッドを用いてインスタンスの出力内容を変えています。

```python
# Cardクラスからインスタンスを生成（引数にマークと数字）
# reprメソッドで出力内容を変更しているので下記のように出力される
# 通常 → <__main__.Card object at 0x10c949310>
# reprメソッド追加 → ♦︎-4

# ♦︎-4
card = Card(2, 4)
print(card)
```

### Deckクラス

Cardクラスを利用して1デッキあたり52枚のランダムなカードリストを生成します。

```deck.py
#!/usr/bin/env python
# coding: UTF-8

# Cardクラス
import card
# リストの要素をシャッフル
from random import shuffle


class Deck:
    """
    52枚のトランプカード（1デッキ）を作成
    Attributes
    ----------
    deck_set_no : int
        デッキの個数
    """

    def __init__(self, deck_set_count=1):
        """
        Parameters
        ----------
        deck_set_count : int
            デッキの個数
        """

        self.cards = []
        for index in range(deck_set_count):
            # 4つのマーク
            for mark in range(len(card.Card.MARKS)):
                # 数字（2から13 + 1の14）
                for value in range(len(card.Card.VALUES)):
                    # cardsに追加
                    self.cards.append(card.Card(mark, value))
        # デッキをシャッフル
        shuffle(self.cards)

    def get_card(self, card_num=1):
        """
        要素を取得しリストから削除
        Parameters
        ----------
        card_num : int
            取得するカードの枚数
        """
  
        self.card_list = []
        if len(self.cards) == 0:
            # カードが0枚の時は何もしない
            return

        ＃self.cards内の末尾からcard_num分取得しリストから削除
        for index in range(card_num):
            self.card_list.append(self.cards.pop())
        return self.card_list
```

Deckクラスを実行すると下記のようになります。

```python
# 2つ分のデッキを生成
deck = Deck(2)
# [♦︎-12, ♠︎-3, ♦︎-13, ❤︎-9, ♦︎-3, ♦︎-8, ♠︎-11, ♦︎-13, ♣︎-9, ♦︎-11,
#  ♦︎-12, ♠︎-2, ♠︎-8, ❤︎-10, ♦︎-4, ♦︎-9, ♣︎-10, ♣︎-4, ♦︎-9, ♠︎-6,
#  ♠︎-3, ♣︎-12, ♠︎-12, ❤︎-13, ♣︎-11, ♣︎-8, ♦︎-10, ♦︎-5, ♦︎-7, ❤︎-12,
#  ♣︎-8, ♦︎-10, ♣︎-10, ♦︎-6, ♠︎-9, ♦︎-5, ❤︎-12, ♠︎-12, ♠︎-10, ♣︎-1,
#  ♣︎-3, ❤︎-1, ❤︎-9, ❤︎-3, ❤︎-6, ♠︎-8, ♦︎-1, ♠︎-13, ❤︎-3, ♦︎-2, ♣︎-1,
#  ♣︎-12, ♠︎-7, ❤︎-8, ♣︎-5, ♠︎-9, ♣︎-4, ♠︎-10, ❤︎-11, ❤︎-4, ♣︎-11,
#  ♠︎-4, ♣︎-7, ❤︎-7, ❤︎-6, ♣︎-3, ♣︎-9, ♦︎-2, ♦︎-11, ❤︎-5, ❤︎-4, ♠︎-13,
#  ♠︎-4, ♣︎-13, ♠︎-1, ♦︎-1, ♠︎-2, ♦︎-8, ❤︎-8, ♣︎-5, ♣︎-6, ♠︎-7, ♣︎-7,
#  ♠︎-11, ♠︎-6, ♠︎-5, ♦︎-6, ❤︎-5, ♣︎-6, ♣︎-13, ❤︎-7, ♦︎-7, ❤︎-10, ❤︎-11,
#  ♠︎-5, ❤︎-2, ❤︎-13, ♦︎-3, ♠︎-1, ❤︎-1, ♦︎-4, ♣︎-2, ❤︎-2, ♣︎-2]
print(deck.cards)

# カードの枚数 104
print(len(deck.cards))

# カードを5枚引く[♣︎-2, ❤︎-2, ♣︎-2, ♦︎-4, ❤︎-1]
# 引いたカードはリストから削除される
print(deck.get_card(5))
```

これでトランプのデッキ、カードを引く機能は実装できました！

次回はPlayer、Dealerのデータの保持についてまとめたいと思います！

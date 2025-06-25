---
title: "ChakraUIのcolorSchemeの上書きについて"
slug: "chakraui-colorscheme"
description: "SwitchやRadioなど、Input要素のコンポーネントのcolorSchemeのカスタマイズ方法についてご紹介しています。"
publishedAt: "2022-10-31T15:00:00.000Z"
tags: ["Chakra UI"]
categories: []
emoji: "🎨"
---

Swicthコンポーネントの`colorScheme` を指定することで、  
選択中の色を変更することができます。

[公式ドキュメント](https://chakra-ui.com/docs/components/switch/usage#switch-background-color)

```jsx
<Switch colorScheme="teal" size="lg" />
```

以下のようなカスタムテーマで設定したカラーコードを設定したい場合、  
`colorScheme="theme.primary"`のように指定しても  
ブラウザでは`color: theme.primary.500;` のようになってしまい、色が反映されません..

```jsx
const theme = extendTheme({
  colors: {
    theme: {
      primary: '#30A49D',
    },
  },
})
```

以下のように、 `500` のプロパティを新たに追加することで  
colorSchemeの値をカスタマイズできるようになります。

```jsx
const theme = extendTheme({
  colors: {
    switch: {
      500: '#30A49D',
    },
  },
})
```

```jsx
<Switch colorScheme="switch" size="lg" />
```
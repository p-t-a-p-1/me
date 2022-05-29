<template>
  <header class="header">
    <div class="header__inner">
      <h1 class="header__logo headerLogo">
        <nuxt-link to="/" class="headerLogo__link"> p-t-a-p-1 </nuxt-link>
      </h1>
      <nav role="navigation" class="header__nav headerNav">
        <ul class="headerNav__links">
          <li
            v-for="(item, index) in links"
            :key="index"
            class="headerNav__item"
          >
            <a
              v-if="item.isExternal"
              :href="item.path"
              target="_blank"
              class="headerNav__link"
            >
              <span class="headerNav__link__text">
                {{ item.label }}
              </span>
              <component
                :is="item.icon"
                class="headerNav__link__icon"
                :class="`-${item.label}`"
              />
            </a>
            <nuxt-link v-else :to="item.path" class="headerNav__link">
              {{ item.label }}
            </nuxt-link>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script lang="ts">
import Vue from 'vue'
import IconTwitter from '~/assets/img/icon_twitter.svg'
import IconGitHub from '~/assets/img/icon_github.svg'
// interface Link {
//   label: string,
//   path: string,
//   icon: string,
//   isExternal: boolean
// }

export default Vue.extend({
  name: 'LayoutDefault',
  components: {
    IconTwitter,
    IconGitHub,
  },
  data() {
    return {
      links: [
        {
          label: 'Blog',
          path: '/blog',
          icon: '',
          isExternal: false,
        },
        {
          label: 'Contact',
          path: '/contact',
          icon: '',
          isExternal: false,
        },
        {
          label: 'Twitter',
          path: 'https://twitter.com/hako_mavs',
          icon: 'IconTwitter',
          isExternal: true,
        },
        {
          label: 'GitHub',
          path: 'https://github.com/p-t-a-p-1',
          icon: 'IconGitHub',
          isExternal: true,
        },
      ],
    }
  },
})
</script>

<style lang="scss" scoped>
.header {
  padding: 16px 40px;
  background-color: rgba($color: $colorDarkWhite, $alpha: 0.8);
  @media #{$sp} {
    padding: 8px 4.3%;
  }
  &__inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    @media #{$sp} {
      row-gap: 8px;
      justify-content: center;
    }
  }
}
.headerLogo {
  &__link {
    transition: opacity 0.3s;
    font-size: 2.4rem;
    font-family: $enFont;
    color: $colorCorporateMain;
    @media #{$pc} {
      font-size: 2.8rem;
    }
    &:hover {
      opacity: 0.7;
    }
  }
}
.headerNav {
  &__links {
    display: flex;
    column-gap: 32px;
  }
  &__item {
  }
  &__link {
    font-weight: 600;
    -webkit-font-smoothing: antialiased;
    display: flex;
    align-items: center;
    column-gap: 8px;
    transition: color 0.3s ease-in-out;
    position: relative;
    line-height: 2;
    font-family: $enFont;
    &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 2px;
      display: block;
      transform-origin: left;
      transform: scaleX(0);
      transition: all 0.25s cubic-bezier(0.65, 0.05, 0.36, 1);
    }
    &__icon {
      width: 16px;
      height: 16px;
      &.-Twitter {
        &::v-deep {
          path {
            fill: $colorTwitter;
          }
        }
      }
    }
    &:hover {
      color: $colorCorporateMain;
      &::after {
        background-color: $colorCorporateMain;
        transform: scaleX(1);
        text-decoration: none;
      }
      .headerNav__link__icon {
        &::v-deep {
          path:nth-of-type(2) {
            fill: $colorCorporateMain;
          }
        }
      }
    }
    &.nuxt-link-exact-active {
      pointer-events: none;
      color: $colorCorporateMain;
      &::after {
        visibility: hidden;
      }
    }
  }
}
</style>

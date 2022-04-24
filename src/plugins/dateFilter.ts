import Vue from 'vue'

const dateFilter = (value: string) => {
  return formatDate(value)
}

function formatDate(inputDate: string) {
  const date = new Date(inputDate)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}/${month}/${day}`
}

Vue.filter('dateFilter', dateFilter)

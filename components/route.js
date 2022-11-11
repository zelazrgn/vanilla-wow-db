import Item from './item.js'
import Search from './search.js'

const routes = {
  '/': Search,
  '/item': Item
}

export default {
  data() {
    return {
      currentPath: window.location.hash
    }
  },
  computed: {
    currentView() {
      const pathSplit = this.currentPath.slice(1).split('/');
      let root = '/'
      if (pathSplit.length > 1) {
        root += pathSplit[1];
      }
      return routes[root] || NotFound
    }
  },
  mounted() {
    window.addEventListener('hashchange', () => {
		  this.currentPath = window.location.hash
		})
  },
  template: `
    <div id="navBar">
    <a href="#/">Home</a>
    </div>
    <component :key="currentPath" :is="currentView" />`
}

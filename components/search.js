import itemDB from '../item-db.json' assert {type: 'json'};

export default {
  data() {
    return {
      itemDB: itemDB,
      searchString: "",
      searchResults: [],
    }
  },
  computed: {
    // itemId() {
    //   const pathSplit = this.currentPath.split('/');
    //   return parseInt(pathSplit[pathSplit.length - 1]);
    // },
  },
  watch: {
    searchString(value) {
      this.searchResults = [];
      if (value === "") return;
      value = value.toLowerCase();
      const results = {};
      for (let item of this.itemDB) {
        if (item.name.toLowerCase().includes(value)) {
          const prevPatches = results[item.id] ? results[item.id].patches : [];
          results[item.id] = {item: item, patches: [...prevPatches, `1.${2 + item.patch}`]};
        }
      }
      for (let [id, item] of Object.entries(results)) {
        this.searchResults.push(item);
      }
    }
  },
  template: `
  <div>
    <label for="site-search">Search:</label>
    <input type="search" v-model="searchString">
  </div>
  <div id="searchResults">
    <a :href="'#/item/' + item.item.id" v-for="item of searchResults"><span :class="'quality'+item.item.quality">{{ item.item.name }}</span>  <span class="patches">({{ item.patches.join(', ')}})</span></a>
  </div>`
}

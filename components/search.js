import itemDB from '../item-db.js';

let timeoutId = undefined;

export default {
  mounted() {
    document.title = 'Vanilla WoW Item Database';
  },
  data() {
    return {
      patch: "",
      searchString: "",
      searchResults: [],
      lastSearchedTime: Date.now()
    }
  },
  computed: {
    itemDB() {
      let res = itemDB;
      if (this.patch !== "") {
        res = res.filter(x => x.patch <= this.patch);
      }
      return res;
    }
  },
  methods: {
    updateResults() {
      this.searchResults = [];
      let value = this.searchString;
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
  watch: {
    searchString() {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        this.updateResults();
      }, 300);
    },
    patch() {
      this.updateResults();
    }
  },
  template: `
  <div>
    <select v-model="patch">
      <option disabled value="">Filter by patch</option>
      <option v-for="index in 11" :value="index-1">Patch 1.{{index+1}}</option>
    </select>
  </div>
  <div>
    <input autofocus type="search" spellcheck="false" v-model="searchString" placeholder="Search by name">
  </div>
  <div id="searchResults">
    <a :href="'#/item/' + item.item.id" v-for="item of searchResults"><span :class="'quality'+item.item.quality">{{ item.item.name }}</span>  <span class="patches">({{ item.patches.join(', ')}})</span></a>
  </div>`
}

import itemDB from '../item-db.json' assert {type: 'json'};

let timeoutId = undefined;

export default {
  data() {
    return {
      itemDB: itemDB,
      searchString: "",
      searchResults: [],
      lastSearchedTime: Date.now()
    }
  },  
  watch: {
    searchString(value) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
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
      }, 300);
    }
  },
  template: `
  <div>
    <input type="search" spellcheck="false" v-model="searchString" placeholder="Search by name">
  </div>
  <div id="searchResults">
    <a :href="'#/item/' + item.item.id" v-for="item of searchResults"><span :class="'quality'+item.item.quality">{{ item.item.name }}</span>  <span class="patches">({{ item.patches.join(', ')}})</span></a>
  </div>`
}

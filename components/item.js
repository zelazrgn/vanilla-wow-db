import itemDB from '../item-db.json' assert {type: 'json'};

const statIdToName = {
  3: 'Agility',
  4: 'Strength',
  5: 'Intellect',
  6: 'Spirit',
  7: 'Stamina',
  'frost_res': 'Frost Resistance',
  'shadow_res': 'Shadow Resistance',
  'fire_res': 'Fire Resistance',
  'nature_res': 'Nature Resistance',
  'arcane_res': 'Arcane Resistance',
};

const typeIdToString = {
  1: 'Head',
  3: "Shoulder",
  5: "Chest",
  6: 'Waist',
  7: 'Legs',
  8: 'Feet',
  9: 'Wrist',
  10: 'Hands',
  11: 'Finger',
  13: 'One-Hand',
  14: 'Off Hand',
  17: 'Two-hand',
  21: 'Main Hand',
  22: 'Off Hand',
  23: 'Held In Off-Hand',
}

const classToString = {
  2: {
    1: 'Axe',
    6: 'Polearm',
    7: 'Sword',
    8: 'Sword',
    10: 'Staff',
    13: 'Fist Weapon',
    15: 'Dagger',
  },
  4: {
    1: "Cloth",
    2: "Leather",
    3: "Mail",
    4: "Plate",
    6: 'Shield'
  }
}

export default {
  mounted() {
    document.title = this.items[0].name;
  },
  data() {
    return {
      itemDB: itemDB,
      currentPath: window.location.hash,
    }
  },
  computed: {
    itemId() {
      const pathSplit = this.currentPath.split('/');
      return parseInt(pathSplit[pathSplit.length - 1]);
    },
    items() {
      const id = this.itemId;
      const res = [];
      for (let item of itemDB) {
        if (item.id === id) {
          res.push(item);
        }
      }
      console.log('res', res);
      return res;
    },
  },
  methods: {
    statToString(stat) {
      const statId = stat[0];
      const statVal = stat[1];
      const name = statIdToName[statId] || `Stat (${statId})`; 
      return `+${statVal} ${name}`;
    },
    typeToString(typeId) {
      return typeIdToString[typeId] || `Type (${typeId})`;
    },
    classToString(classId, subclassId) {
      const itemClass = classToString[classId];
      if (itemClass) {
        const subclass = itemClass[subclassId];
        if (subclass) {
          return subclass
        }
      }
      return `Class (${classId}, ${subclassId})`
    },
    dps(item) {
      let totalDamage = 0;
      if (item.dmg) {
        for (let dmg of item.dmg) {
          totalDamage += dmg[1] + dmg[2];
        }
      }
      const dps = totalDamage / (item.speed * 2 / 1000);
      return `${dps.toFixed(1)} damage per second`;
    },
    dmgToString(dmg) {
      if (dmg[0] === 0) {
        return `${dmg[1]} - ${dmg[2]}`;
      }
      if (dmg[0] === 3) {
        return `+ ${dmg[1]} - ${dmg[2]} Nature Damage`;
      }
      return dmg;
    },
  },
  template: `
  <div class="itemDetailedContainer">
      <div class="patches">
        <div class="item" v-for="item in items">
          <div :class="'quality'+item.quality" class="name">{{ item.name }}</div>
          <div class="type">{{ typeToString(item.type) }}</div>
          <div v-if="item.subclass" class="class">{{ classToString(item.class, item.subclass) }}</div>
          <div v-if="item.armor > 0" class="armor">{{ item.armor }} Armor</div>
          <div v-if="item.speed">Speed {{ item.speed / 1000 }}</div>
          <div v-if="item.dmg">{{ dps(item) }}</div>
          <div v-for="dmg in item.dmg">{{ dmgToString(dmg) }}</div>
          <div v-for="stat in item.stats">{{ statToString(stat) }}</div>
          <div class="spell" v-for="spell in item.spells">{{ spell }}</div>
          <div v-if="item.required_level">Requires Level {{item.required_level}}</div>
          <div>Patch: 1.{{ item.patch + 2 }}</div>
        </div>
      </div>
    </div>`
}

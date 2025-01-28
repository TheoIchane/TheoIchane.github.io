const apiUrl = 'https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json';

let heroes = [];
let filterHeroes = [];
let pageSize = 20;
let currentPage = 1;
let sortFilter = ['name','fullName','race','gender','height','weight','placeOfBirth','alignment','intelligence','strength','speed','durability','power','combat'];

window.onload = () => {
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      heroes = data;
      filterHeroes = data;

      pageSize = 20;
      document.getElementById('page-size').value = pageSize;

      initTable();
    });
};

function initTable() {
  const tableBody = document.getElementById('hero-body');
  tableBody.innerHTML = '';
  const start = (currentPage - 1) * pageSize;
  const end = pageSize === 'all' ? filterHeroes.length : Math.min(start + pageSize, filterHeroes.length);
  const currentHeroes = filterHeroes.slice(start, end);
  currentHeroes.forEach((hero) => {
    const row = document.createElement('tr');
    row.innerHTML = `
     <td><img src="${hero.images.xs}" alt="${hero.name}"></td>
     <td>${displayValue(hero.name)}</td>
      <td>${displayValue(hero.biography.fullName)}</td>
      <td>${displayValue(hero.appearance.race)}</td>
      <td>${displayValue(hero.appearance.gender)}</td>
      <td>${displayValue(hero.appearance.height[1])}</td>
      <td>${displayValue(hero.appearance.weight[1])}</td>
      <td>${displayValue(hero.biography.placeOfBirth)}</td>
      <td>${displayValue(hero.biography.alignment)}</td>
      <td>${displayValue(hero.powerstats.intelligence)}</td>
      <td>${displayValue(hero.powerstats.strength)}</td>
      <td>${displayValue(hero.powerstats.speed)}</td>
      <td>${displayValue(hero.powerstats.durability)}</td>
      <td>${displayValue(hero.powerstats.power)}</td>
      <td>${displayValue(hero.powerstats.combat)}</td>
    
    `;
    tableBody.appendChild(row);
    paginate();
  });
}

function displayValue(value) {
  if (value === null || value === 'null') return 'null';
  if (value === undefined || value === '' || value === '-' || value === '0') return '-';
  return value;
}

function paginate() {
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';
  const totalPages = pageSize === 'all' ? 0 : Math.ceil(filterHeroes.length / pageSize);
  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement('button');
    button.textContent = i;
    button.onclick = () => {
      currentPage = i;
      initTable();
    };
    pagination.appendChild(button);
  }
}

function changePageSize() {
  const size = document.getElementById('page-size');
  pageSize = size.value === 'all' ? 'all' : parseInt(size.value);
  currentPage = 1;
  initTable();
}

function filterTable() {
  const searchField = document.getElementById('searchField').value.split(' ')
  const searchElement = document.getElementById('search').value.toLowerCase();
  if (searchField.length === 1) {
    filterHeroes = heroes.filter((hero) => {
      return (hero[searchField[0]] || '').toLowerCase().includes(searchElement);
    });
  } else if (['height','weight'].includes(searchField[1])) {
    filterHeroes = heroes.filter((hero) => {
      return (hero[searchField[0]][searchField[1]][1] || '').toLowerCase().includes(searchElement);
    });
  } else if (searchField[0] === 'powerstats') {
    filterHeroes = heroes.filter((hero) => {
      return (String(hero[searchField[0]][searchField[1]]) || '').toLowerCase().includes(searchElement);
    });
  } else {
    filterHeroes = heroes.filter((hero) => {
      return (hero[searchField[0]][searchField[1]] || '').toLowerCase().includes(searchElement);
    });
  }
  currentPage = 1;
  initTable();
}

function sortTable(filtre) {
  if (filtre === 'name') {
    resetSortFilter(filtre); // Réinitialise l'autre tri
    sortByName();
  } else if (filtre === 'fullName') {
    resetSortFilter(filtre); // Réinitialise l'autre tri
    sortByfullName();
  } else if (filtre === 'race') {
    resetSortFilter(filtre) ;
    sortByRace();
  } else if (filtre === 'gender') { // Ajout du tri par gender
    resetSortFilter(filtre); // Réinitialise le tri précédent
    sortByGender();
  } else if (filtre === 'weight') {
    resetSortFilter(filtre); // Réinitialise le tri précédent
    sortByWeight();
  } else if (filtre === 'height') {
    resetSortFilter(filtre);
    sortByHeight();
  } else if (filtre === 'placeOfBirth') {
    resetSortFilter(filtre);
    sortByBirthPlace();
  } else if (filtre === 'alignment') {
    resetSortFilter(filtre);
    sortByAlignment();
  } else if (isStat(filtre)) {
    resetSortFilter(filtre)
    sortByPowerStats(filtre)
  }
}

function isStat(filtre) {
  const stats = ['intelligence','strength','speed','durability','power','combat']
  return stats.includes(filtre)
}

let sortedVariables = {
  intelligence: true,
  strength:true,
  speed:true,
  durability:true,
  power:true,
  combat:true
};

function resetSortFilter(filtre) {
  const temp = sortedVariables[filtre];
  console.log(document.getElementById(filtre).innerText.slice(-1))
  sortFilter.forEach((x) => sortedVariables[x] = true);
  sortFilter.forEach((x) => ['⇧','⇩'].includes(document.getElementById(x).innerText.slice(-1)) ? document.getElementById(x).innerText = document.getElementById(x).innerText.slice(0,-1) : document.getElementById(x).innerText = document.getElementById(x).innerText)
  sortedVariables[filtre] = temp;
  if (sortedVariables[filtre]) {
    document.getElementById(filtre).innerHTML += ' ⇧'
  } else {
    document.getElementById(filtre).innerHTML += ' ⇩'
  }
}

sortedVariables.name = true
const sortByName = () => {
  filterHeroes.sort((a, b) => a.name.localeCompare(b.name));
  if (!sortedVariables.name) {
    filterHeroes.reverse();
  }
  sortedVariables.name = !sortedVariables.name;
  initTable();
};


sortedVariables.fullName = true
const sortByfullName = () => {
  filterHeroes.sort((a, b) => {
    const nameA = (a.biography.fullName || '').toLowerCase();
    const nameB = (b.biography.fullName || '').toLowerCase();

    const isNameAEmpty = !nameA;
    const isNameBEmpty = !nameB;


    if (isNameAEmpty && !isNameBEmpty) return 1; //Placement des noms vide
    if (!isNameAEmpty && isNameBEmpty) return -1; 
    if (isNameAEmpty && isNameBEmpty) return 0; 

    if (nameA < nameB) return sortedVariables.fullName ? -1 : 1;
    if (nameA > nameB) return sortedVariables.fullName ? 1 : -1;
    return 0;
  });
  sortedVariables.fullName = ! sortedVariables.fullName;
  initTable();
};


// Fonction pour trier par race
sortedVariables.race = true
const sortByRace = () => {
  filterHeroes.sort((a, b) => {
    const raceA = (a.appearance.race || '').toLowerCase();
    const raceB = (b.appearance.race || '').toLowerCase();

    const isRaceAEmpty = !raceA;
    const isRaceBEmpty = !raceB;

    if (isRaceAEmpty && !isRaceBEmpty) return 1;
    if (!isRaceAEmpty && isRaceBEmpty) return -1; 
    if (isRaceAEmpty && isRaceBEmpty) return 0; 

    if (raceA < raceB) return sortedVariables.race ? -1 : 1;
    if (raceA > raceB) return sortedVariables.race ? 1 : -1;
    return 0;
  });
  sortedVariables.race = !sortedVariables.race;
  initTable();
};

// Fonction pour trier par genre
sortedVariables.gender = true
const sortByGender = () => {
  filterHeroes.sort((a, b) => {
    const genderA = (a.appearance.gender || '').toLowerCase();
    const genderB = (b.appearance.gender || '').toLowerCase();

  
    const isGenderAEmpty = !genderA || genderA === "-" || genderA === null;
    const isGenderBEmpty = !genderB || genderB === "-" || genderB === null;

    if (isGenderAEmpty && !isGenderBEmpty) return 1;
    if (!isGenderAEmpty && isGenderBEmpty) return -1;
    if (isGenderAEmpty && isGenderBEmpty) return 0;

    if (genderA < genderB) return sortedVariables.gender ? -1 : 1;
    if (genderA > genderB) return sortedVariables.gender ? 1 : -1;
    return 0;
  });
  sortedVariables.gender = !sortedVariables.gender;
  initTable();
};

// Fonction pour trier par taille
sortedVariables.height = true
const sortByHeight = () => {
  filterHeroes.sort((a, b) => {
    const heightAstr = (a.appearance.height[1] || '').toLowerCase();
    const heightBstr = (b.appearance.height[1] || '').toLowerCase();

    const isHeightAEmpty = !heightAstr || heightAstr.includes("-") || heightAstr === null || heightAstr === "0 cm";
    const isHeightBEmpty = !heightBstr || heightBstr.includes("-") || heightBstr === null || heightBstr === "0 cm";

    if (isHeightAEmpty && !isHeightBEmpty) return 1;
    if (!isHeightAEmpty && isHeightBEmpty) return -1; 
    if (isHeightAEmpty && isHeightBEmpty) return 0; 

    const heightA = getHeigthMeter(heightAstr);
    const heightB = getHeigthMeter(heightBstr);

    if (heightA < heightB) return sortedVariables.height ? -1 : 1;
    if (heightA > heightB) return sortedVariables.height ? 1 : -1;
    return 0;
  });
  sortedVariables.height = !sortedVariables.height;
  initTable();
};

function getHeigthMeter(str) {
  if (str.includes('meters')) {
    return Number(str.split(' ')[0])
  } 
  return Number(str.split(' ')[0]) / 100
}

// Fonction pour trier par lieu de naissance
sortedVariables.placeOfBirth = true
const sortByBirthPlace = () => {
  filterHeroes.sort((a, b) => {
    const birthPlaceA = (a.biography.placeOfBirth || '').toLowerCase();
    const birthPlaceB = (b.biography.placeOfBirth || '').toLowerCase();

    const isbirthPlaceAEmpty = !birthPlaceA || birthPlaceA === "-";
    const isbirthPlaceBEmpty = !birthPlaceB || birthPlaceB === "-";

    if (isbirthPlaceAEmpty && !isbirthPlaceBEmpty) return 1;
    if (!isbirthPlaceAEmpty && isbirthPlaceBEmpty) return -1; 
    if (isbirthPlaceAEmpty && isbirthPlaceBEmpty) return 0; 

    if (birthPlaceA < birthPlaceB) return sortedVariables.placeOfBirth ? -1 : 1;
    if (birthPlaceA > birthPlaceB) return sortedVariables.placeOfBirth ? 1 : -1;
    return 0;
  });
  sortedVariables.placeOfBirth = !sortedVariables.placeOfBirth;
  initTable();
};

// Fonction pour trier par lieu de naissance
sortedVariables.alignment = true
const sortByAlignment = () => {
  filterHeroes.sort((a, b) => {
    const alignmentA = (a.biography.alignment || '').toLowerCase();
    const alignmentB = (b.biography.alignment || '').toLowerCase();

    const isalignmentAEmpty = !alignmentA || alignmentA === "-";
    const isalignmentBEmpty = !alignmentB || alignmentB === "-";

    if (isalignmentAEmpty && !isalignmentBEmpty) return 1;
    if (!isalignmentAEmpty && isalignmentBEmpty) return -1; 
    if (isalignmentAEmpty && isalignmentBEmpty) return 0; 

    if (alignmentA < alignmentB) return sortedVariables.alignment ? -1 : 1;
    if (alignmentA > alignmentB) return sortedVariables.alignment ? 1 : -1;
    return 0;
  });
  sortedVariables.alignment = !sortedVariables.alignment;
  initTable();
};

// Fonction pour trier par poids
sortedVariables.weight = true;
const sortByWeight = () => {
  filterHeroes.sort((a, b) => {
    const weightA = a.appearance.weight[0];
    const weightB = b.appearance.weight[0];


    const isWeightAEmpty = !weightA || weightA.includes("-") || weightA === null;
    const isWeightBEmpty = !weightB || weightB.includes("-") || weightB === null;

    if (isWeightAEmpty && !isWeightBEmpty) return 1;
    if (!isWeightAEmpty && isWeightBEmpty) return -1;
    if (isWeightAEmpty && isWeightBEmpty) return 0;

    // Convertir les poids en nombre
    const weightANumber = parseFloat(weightA);
    const weightBNumber = parseFloat(weightB);

    if (weightANumber < weightBNumber) return sortedVariables.weight ? -1 : 1;
    if (weightANumber > weightBNumber) return sortedVariables.weight ? 1 : -1;
    return 0;
  });
  sortedVariables.weight = !sortedVariables.weight;
  initTable();
};

//Fonction pour trier selon une stat de combat
const sortByPowerStats= (stat) => {
  filterHeroes.sort((a,b) => {
    const statA = Number(a.powerstats[stat])
    const statB = Number(b.powerstats[stat])

    if (statA < statB) return sortedVariables[stat] ? -1 : 1;
    if (statA > statB) return sortedVariables[stat] ? 1 : -1;
    return 0;

  });
  sortedVariables[stat] = !sortedVariables[stat];
  initTable();
}
// ------------------------------
// DO NOT CHANGE ABOVE THIS LINE!
// ------------------------------

const think = [
    "I guess...",
    "I imagine...",
    "I suppose...",
    "It looks to me as if...",
    "It looks to me as though...",
    "I reckon...",
    "I figure...",
    "I gather...",
];

const start = [
    "As a matter of fact...",
    "To be frank...",
    "Frankly...",
    "In actuality...",
    "Quite honestly...",
    "By and large...",
    "On the whole...",
    "I'd like to point out that...",
    "Can't you realize that... ?",
    "Wouldn't it be better if... ?",
    "I beg to differ, since...",
    "We're definitely on the same page, as...",
    "Let's face it...",
    "It's a well known fact that...",
    "It goes without saying that...",
    "You'll be interested in knowing that...",
];

const but = [
    "However",
    "Yet",
    "Although",
    "Though",
    "While",
    "Whereas",
    "Nevertheless",
    "Notwithstanding",
    "Despite",
    "In spite of",
    "On the other hand",
    "Nonetheless",
    "Still",
    "Instead",
    "Conversely",
    "In contrast",
    "Even so",
    "Be that as it may",
    "Otherwise",
    "Except",
];

const like = [
    "To enjoy",
    "To love",
    "To adore",
    "To appreciate",
    "To delight in",
    "To fancy",
    "To be fond of",
    "To have a soft spot for",
    "To take pleasure in",
    "To find appealing",
    "To cherish",
    "To take delight in",
    "To have a taste for",
    "To have a liking for",
    "To get a kick out of",
    "To have an affinity for",
    "To have a preference for",
    "To have a weakness for",
    "To have a passion for",
    "To have a thing for",
];

const so = [
    "Therefore",
    "Thus",
    "Consequently",
    "Hence",
    "As a result",
    "Accordingly",
    "Because of that",
    "That being the case",
    "For this reason",
    "Ergo",
    "In consequence",
    "That is why",
    "So that",
    "With the result that",
    "Due to this",
    "Resultantly",
    "Then",
    "In turn",
    "Following that",
    "In conclusion",
];

const idiom = [
    "Idiom A",
    "Idiom B",
    "Idiom C",
    "Idiom D",
    "Idiom E",
    "Idiom F",
    "Idiom G",
];

const expColor = [
    "Color Expression A",
    "Color Expression B",
    "Color Expression C",
    "Color Expression D",
    "Color Expression E",
    "Color Expression F",
    "Color Expression G",
];

const expAnimal = [
    "Animal Expression A",
    "Animal Expression B",
    "Animal Expression C",
    "Animal Expression D",
    "Animal Expression E",
    "Animal Expression F",
    "Animal Expression G",
];

const boxes = ["Starters", "Consequence", "Contrast", "Preference", "Expressions", "Idioms"];

const max = 6;			// Maximum number of sentences in each box

const lists = [			// Names of the lists displayed in each box
    ["think", "start"],
    ["so"],
    ["but"],
    ["like"],
    ["expAnimal", "expColor"],
    ["idiom"],
];

const sizes = [
    [1, max, max, max, 3, max]	// Number of sentences on the first list in each box
];

// ------------------------------
// DO NOT CHANGE BELOW THIS LINE!
// ------------------------------

sizes[1] = sizes[0].map(i => max - i);

function shuffleList(list) {
    for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
    }
}

function switchSentences(pos, boxId, row) {
    const list = lists[boxId][pos];
    const size = sizes[pos][boxId];

    [list[row], list[size]] = [list[size], list[row]];

    list.push(list.splice(size, 1)[0]);
    updateBox(pos, boxId, 1);
}

function updateBox(pos, boxId, score) {
    const list = lists[boxId][pos];
    const size = sizes[pos][boxId];

    const box = document.getElementById(boxId);
    const sentences = box.querySelectorAll('.box-sentences')[pos];
    const counter = box.querySelector('.box-counter');

    sentences.innerHTML = "";

    for (let i = 0; i < size; i++) {
        const sentence = document.createElement('div');
        sentence.classList.add('box-sentence');
        sentence.textContent = list[i];
        sentence.addEventListener('click', () => switchSentences(pos, boxId, i));
        sentences.appendChild(sentence);
    }

    counter.textContent = parseInt(counter.textContent) + score;
}

function startup(list) {
    list.forEach((box, boxIndex) => {
        box.forEach((name, nameIndex) => {
            fetch('sentences/' + name + '.txt')
            .then(response => response.text())
            .then(text => {
                box[nameIndex] = text.split('\n'));
                shuffleList(box[nameIndex]);
                updateBox(nameIndex, boxIndex, 0);
            });
        });
    });
}

window.onload = function() {
    const fade = 250;

    const showall = document.querySelector('.showall');
    showall.style.display = "none";
    showall.addEventListener('click', () => {
        showall.style.display = "none";
        document.querySelectorAll('.box').forEach(all => {
            all.style.display = "initial";
            setTimeout(function() {
                all.style.opacity = "initial";
            }, fade * 0.5);
        });
    });

    const container = document.querySelector('.container');

    for (let i = 0; i < boxes.length; i++) {
        const box = document.createElement('div');
        box.classList.add('box');
        box.setAttribute('id', i);
        container.appendChild(box);

        const title = document.createElement('div');
        title.classList.add('box-title');
        title.textContent = boxes[i];
        title.addEventListener('click', () => {
            lists[i].forEach((list, pos) => {
                shuffleList(list);
                updateBox(pos, i, 0);
            });
        });
        title.addEventListener('dblclick', () => {
            box.style.opacity = 0;
            setTimeout(function() {
                box.style.display = "none";
                showall.style.display = "initial";
            }, fade * 1.5);
        });
        box.appendChild(title);

        const sentences = document.createElement('div');
        sentences.classList.add('box-sentences');
        box.appendChild(sentences);
        box.appendChild(sentences.cloneNode(true));

        const counter = document.createElement('div');
        counter.classList.add('box-counter');
        counter.textContent = 0;
        counter.addEventListener('dblclick', () => {
            counter.textContent = 0;
        });
        box.appendChild(counter);
    }

    startup(lists);
};

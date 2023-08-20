const boxes = [];
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
    fetch('sentences/!boxes.txt')
    .then(response => response.text())
    .then(text => boxes = text.split('\n').map(i => i.trim()));

    list.forEach((box, boxIndex) => {
        box.forEach((name, nameIndex) => {
            fetch('sentences/' + name + '.txt')
            .then(response => response.text())
            .then(text => {
                box[nameIndex] = text.split('\n').map(i => i.trim());
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

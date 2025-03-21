// Базовый класс Block
class Block {
    constructor(imageSrc) {
        this.id = Math.random().toString(36).substring(2, 9);
        this.imageSrc = imageSrc || 'default-image.jpg';
    }

    render(isEditMode, isImageLeft) {
        throw new Error("Метод render() должен быть переопределён в дочернем классе.");
    }

    updateImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.imageSrc = e.target.result;
            assemblePage(initialBlocks, isEditMode);
        };
        reader.readAsDataURL(file);
    }
}

// Класс для информации
class InfoBlock extends Block {
    constructor(title, description, imageSrc) {
        super(imageSrc);
        this.title = title;
        this.description = description;
    }

    render(isEditMode, isImageLeft) {
        const textContent = `
            <div class="text-content">
                <h2 ${isEditMode ? 'contenteditable="true" data-field="title"' : ''}>${this.title}</h2>
                <p ${isEditMode ? 'contenteditable="true" data-field="description"' : ''}>${this.description}</p>
                ${isEditMode ? '<button class="delete-btn">Удалить</button>' : ''}
            </div>
        `;
        const imageContent = `
            <div class="image-content" data-block-id="${this.id}" data-speed="0.7">
                <img src="${this.imageSrc}" alt="Block Image">
            </div>
        `;
        return `
            <section id="${this.id}" class="block-row ${isImageLeft ? 'image-left' : 'image-right'}">
                ${isImageLeft ? imageContent + textContent : textContent + imageContent}
            </section>
        `;
    }

    updateField(field, value) {
        if (field === 'location') this.location = value;
        if (field === 'faction') this.faction = value.replace('Фракция: ', '');
        if (field === 'behavior') this.behavior = value.replace('Поведение: ', '');
        if (field === 'guards') this.guards = value.replace('Охрана: ', '');
    }
}

// Класс для характеристик
class StatsBlock extends Block {
    constructor(stats, imageSrc) {
        super(imageSrc);
        this.stats = stats;
    }

    render(isEditMode, isImageLeft) {
        const textContent = `
            <div class="text-content">
                <h2 ${isEditMode ? 'contenteditable="true"' : ''}>Статистика</h2>
                <ul>
                    ${Object.entries(this.stats)
                        .map(([key, value]) => `<li ${isEditMode ? 'contenteditable="true" data-field="' + key + '"' : ''}>${key}: ${value}</li>`)
                        .join('')}
                </ul>
                ${isEditMode ? '<button class="delete-btn">Удалить</button>' : ''}
            </div>
        `;
        const imageContent = `
            <div class="image-content" data-block-id="${this.id}">
                <img src="${this.imageSrc}" alt="Block Image">
            </div>
        `;
        return `
            <section id="${this.id}" class="block-row ${isImageLeft ? 'image-left' : 'image-right'}">
                ${isImageLeft ? imageContent + textContent : textContent + imageContent}
            </section>
        `;
    }

    updateField(field, value) {
        const [key, val] = value.split(': ');
        if (this.stats[field]) {
            this.stats[field] = val;
        }
    }
}

// Класс для снаряжения
class EquipmentBlock extends Block {
    constructor(equipmentList, imageSrc) {
        super(imageSrc);
        this.equipmentList = equipmentList;
    }

    render(isEditMode, isImageLeft) {
        const textContent = `
            <div class="text-content">
                <h2 ${isEditMode ? 'contenteditable="true"' : ''}>Снаряжение</h2>
                <ul>
                    ${this.equipmentList
                        .map((item, index) => `<li ${isEditMode ? 'contenteditable="true" data-field="' + index + '"' : ''}>${item}</li>`)
                        .join('')}
                </ul>
                ${isEditMode ? '<button class="delete-btn">Удалить</button>' : ''}
            </div>
        `;
        const imageContent = `
            <div class="image-content" data-block-id="${this.id}">
                <img src="${this.imageSrc}" alt="Block Image">
            </div>
        `;
        return `
            <section id="${this.id}" class="block-row ${isImageLeft ? 'image-left' : 'image-right'}">
                ${isImageLeft ? imageContent + textContent : textContent + imageContent}
            </section>
        `;
    }

    updateField(field, value) {
        const index = parseInt(field);
        if (!isNaN(index) && index >= 0 && index < this.equipmentList.length) {
            this.equipmentList[index] = value;
        }
    }
}


class CustomBlock extends Block {
    constructor(content, imageSrc) {
        super(imageSrc);
        this.content = content || 'Введите текст...';
    }

    render(isEditMode, isImageLeft) {
        const textContent = `
            <div class="text-content">
                <div ${isEditMode ? 'contenteditable="true" data-field="content"' : ''}>${this.content}</div>
                ${isEditMode ? '<button class="delete-btn">Удалить</button>' : ''}
            </div>
        `;
        const imageContent = `
            <div class="image-content" data-block-id="${this.id}">
                <img src="${this.imageSrc}" alt="Block Image">
            </div>
        `;
        return `
            <section id="${this.id}" class="block-row ${isImageLeft ? 'image-left' : 'image-right'}">
                ${isImageLeft ? imageContent + textContent : textContent + imageContent}
            </section>
        `;
    }

    updateField(field, value) {
        if (field === 'content') this.content = value;
    }
}


class HeaderBlock extends Block {
    constructor(title, subtitle, imageSrc) {
        super(imageSrc);
        this.title = title;
        this.subtitle = subtitle;
    }

    render(isEditMode, isImageLeft) {
        const textContent = `
            <div class="text-content">
                <h1 ${isEditMode ? 'contenteditable="true" data-field="title"' : ''}>${this.title}</h1>
                <h2 ${isEditMode ? 'contenteditable="true" data-field="subtitle"' : ''}>${this.subtitle}</h2>
                ${isEditMode ? '<button class="delete-btn">Удалить</button>' : ''}
            </div>
        `;
        const imageContent = `
            <div class="image-content" data-block-id="${this.id}">
                <img src="${this.imageSrc}" alt="Block Image">
            </div>
        `;
        return `
            <section id="${this.id}" class="block-row header-block ${isImageLeft ? 'image-left' : 'image-right'}">
                ${isImageLeft ? imageContent + textContent : textContent + imageContent}
            </section>
        `;
    }

    updateField(field, value) {
        if (field === 'title') this.title = value;
        if (field === 'subtitle') this.subtitle = value;
    }
}

function saveToLocalStorage(blocks) {
    const blocksData = blocks.map(block => {
        if (block instanceof InfoBlock) {
            return { type: 'info', location: block.location, faction: block.faction, behavior: block.behavior, guards: block.guards, id: block.id, imageSrc: block.imageSrc };
        } else if (block instanceof StatsBlock) {
            return { type: 'stats', stats: block.stats, id: block.id, imageSrc: block.imageSrc };
        } else if (block instanceof EquipmentBlock) {
            return { type: 'equipment', equipmentList: block.equipmentList, id: block.id, imageSrc: block.imageSrc };
        } else if (block instanceof CustomBlock) {
            return { type: 'custom', content: block.content, id: block.id, imageSrc: block.imageSrc };
        } else if (block instanceof HeaderBlock) {
            return { type: 'header', title: block.title, subtitle: block.subtitle, id: block.id, imageSrc: block.imageSrc };
        }
    });
    localStorage.setItem('blocks', JSON.stringify(blocksData));
}

function loadFromLocalStorage() {
    const savedData = localStorage.getItem('blocks');
    if (!savedData) return null;
    const blocksData = JSON.parse(savedData);
    return blocksData.map(data => {
        if (data.type === 'info') {
            return new InfoBlock(data.location, data.faction, data.behavior, data.guards, data.imageSrc);
        } else if (data.type === 'stats') {
            return new StatsBlock(data.stats, data.imageSrc);
        } else if (data.type === 'equipment') {
            return new EquipmentBlock(data.equipmentList, data.imageSrc);
        } else if (data.type === 'custom') {
            return new CustomBlock(data.content, data.imageSrc);
        } else if (data.type === 'header') {
            return new HeaderBlock(data.title, data.subtitle, data.imageSrc);
        }
    });
}


let initialBlocks = loadFromLocalStorage() || [
    new HeaderBlock('Тагилла', 'У этого завода уже есть хозяин', '../img/png/Tagila.png'),
    new InfoBlock('Описание', 'Тагилла - это босс Диких на локации Завод, по информации от Егеря раньше работал на Полихиме, потом двинулся крышей и стал беспредельничать. Хотел превзойти своего старшего брата - Киллу. Вооруженный на ряду с огнестрельным оружием, огромным молотом, который очень любит пускать в ход. Если видит жертву в непосредственной близости от себя, бежит к ней и с особой жестокостью забивает молотом. Если жертва стоит в труднодоступном месте то переключается на огнестрельное оружие. ', '../img/jpeg/factory.jpeg'),
    new StatsBlock({ 'Голова': 100, 'Грудь': 320, 'Живот': 260, 'Руки': 130, 'Ноги': 140, 'Всего': 1220 }, '../img/webp/Health_Tagilla.webp'),
    new EquipmentBlock(['Кувалда', 'Сварочная маска', 'Бронежилет'], '../img/png/maska.png'),
];

function assemblePage(blocks, isEditMode = false) {
    const smoothContent = document.querySelector('#smooth-content');
    smoothContent.innerHTML = `
        <div id="controls">
            ${!isEditMode ? '<button id="edit-mode-toggle">Режим редактирования</button>' : ''}
            ${isEditMode ? '<button id="save-btn">Сохранить</button>' : ''}
        </div>
        <div id="sidebar" class="sidebar" style="display: ${isEditMode ? 'block' : 'none'};">
            <h3>Добавить блок</h3>
            <ul id="block-options">
                <li data-type="info">Информация</li>
                <li data-type="stats">Статистика</li>
                <li data-type="equipment">Снаряжение</li>
                <li data-type="custom">Пользовательский блок</li>
                <li data-type="header">Заголовок</li>
            </ul>
        </div>
        <div id="content" class="${isEditMode ? 'edit-mode' : ''}">
            ${blocks.map((block, index) => block.render(isEditMode, index % 2 === 0)).join('')}
        </div>
        ${isEditMode ? '<input type="file" id="image-upload-input" accept="image/*" style="display: none;">' : ''}
    `;

    const editButton = document.getElementById('edit-mode-toggle');
    const saveButton = document.getElementById('save-btn');
    const blockOptions = document.getElementById('block-options');
    const imageUploadInput = document.getElementById('image-upload-input');

    if (editButton) {
        editButton.addEventListener('click', () => {
            isEditMode = !isEditMode;
            assemblePage(blocks, isEditMode);
        });
    }

    if (saveButton) {
        saveButton.addEventListener('click', () => {
            saveToLocalStorage(blocks);
            isEditMode = false;
            assemblePage(blocks, isEditMode);
        });
    }

    blockOptions.addEventListener('click', (event) => {
        const target = event.target;
        if (target.tagName === 'LI') {
            const type = target.getAttribute('data-type');
            addNewBlock(type);
        }
    });

    if (isEditMode) {
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                blocks.splice(index, 1);
                assemblePage(blocks, isEditMode);
            });
        });

        const editableFields = document.querySelectorAll('[contenteditable="true"]');
        editableFields.forEach(field => {
            field.addEventListener('blur', (e) => {
                const blockId = e.target.closest('section').id;
                const block = blocks.find(b => b.id === blockId);
                const fieldName = e.target.getAttribute('data-field');
                const newValue = e.target.textContent;
                if (block && fieldName) {
                    block.updateField(fieldName, newValue);
                }
            });
        });

        const imageContents = document.querySelectorAll('.image-content');
        imageContents.forEach(imageContent => {
            imageContent.addEventListener('click', (e) => {
                const blockId = e.currentTarget.getAttribute('data-block-id');
                const block = blocks.find(b => b.id === blockId);
                if (block) {
                    imageUploadInput.setAttribute('data-block-id', blockId);
                    imageUploadInput.click();
                }
            });
        });

        if (imageUploadInput) {
            imageUploadInput.addEventListener('change', (e) => {
                const blockId = e.target.getAttribute('data-block-id');
                const block = blocks.find(b => b.id === blockId);
                if (block && e.target.files[0]) {
                    block.updateImage(e.target.files[0]);
                    e.target.value = '';
                }
            });
        }
    }
}

function addNewBlock(type) {
    let newBlock;
    switch (type) {
        case 'info':
            newBlock = new InfoBlock('Новое местоположение', 'Новая фракция', 'Новое поведение', 'Новая охрана', '../img/png/default-image.png');
            break;
        case 'stats':
            newBlock = new StatsBlock({ 'Параметр': 'Значение' }, '../img/png/default-image.png');
            break;
        case 'equipment':
            newBlock = new EquipmentBlock(['Новое снаряжение'], '../img/png/default-image.png');
            break;
        case 'custom':
            newBlock = new CustomBlock('Введите текст...', '../img/png/default-image.png');
            break;
        case 'header':
            newBlock = new HeaderBlock('Новый заголовок', 'Новое описание', '../img/png/default-image.png');
            break;
        default:
            return;
    }
    initialBlocks.push(newBlock);
    isEditMode = true;
    assemblePage(initialBlocks, isEditMode);
}

let isEditMode = false;

window.onload = () => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    const body = document.querySelector('body');
    const smoothWrapper = document.createElement('div');
    smoothWrapper.id = 'smooth-wrapper';
    const smoothContent = document.createElement('div');
    smoothContent.id = 'smooth-content';
    smoothWrapper.appendChild(smoothContent);
    body.appendChild(smoothWrapper);

    assemblePage(initialBlocks, isEditMode);

    const smoother = ScrollSmoother.create({
        wrapper: '#smooth-wrapper',
        content: '#smooth-content',
        smooth: 1.5,
        effects: true
    });

    ScrollTrigger.refresh();

    setupAnimations();
};
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event fired');

    const screens = document.querySelectorAll('.screen');
    const nextButton = document.getElementById('next-button');
    const startButton = document.getElementById('start-button');
    const testButtons = document.querySelectorAll('.test-button');
    let currentScreen = 0;

    function showScreen(index) {
        console.log(`showScreen called with index: ${index}`);
        screens.forEach((screen, i) => {
            screen.classList.toggle('active', i === index);
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            console.log('nextButton clicked');
            const form = document.getElementById('user-form');
            if (form) {
                if (form.checkValidity()) {
                    console.log('Form is valid');
                    document.querySelector('.card.form').style.display = 'none';
                    document.querySelector('.card.intro-text').style.display = 'block';
                } else {
                    console.log('Form is not valid');
                    form.reportValidity();
                }
            } else {
                console.log('Form not found');
            }
        });
    } else {
        console.log('nextButton not found');
    }

    if (startButton) {
        startButton.addEventListener('click', () => {
            console.log('startButton clicked');
            showScreen(1); // Переход на экран с тестами
        });
    } else {
        console.log('startButton not found');
    }

    testButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const testId = event.target.getAttribute('data-test');
            console.log(`testButton clicked, testId: ${testId}`);
            if (testId) {
                const testElement = document.getElementById(testId);
                if (testElement) {
                    testElement.classList.add('active');
                    const testListScreen = document.getElementById('test-list-screen');
                    if (testListScreen) {
                        testListScreen.classList.remove('active');
                    } else {
                        console.log('test-list-screen not found');
                    }
                    currentScreen = parseInt(testId.replace('test', ''));
                } else {
                    console.log(`Element with id ${testId} not found`);
                }
            } else {
                console.log('data-test attribute not found on button');
            }
        });
    });

    // Initialize the first screen
    showScreen(currentScreen);

    // Тест №1: История из картинок
    const test1 = document.getElementById('test1');
    if (test1) {
        const imagesContainer = test1.querySelector('.images');
        const images = Array.from(imagesContainer.querySelectorAll('img'));
        let correctOrder = images.map((img, index) => index + 1); // Пример правильного порядка
        let timerInterval;
        let startTime;
        let shuffleTimeout;

        // Функция запуска таймера
        function startTimer() {
            console.log('startTimer called');
            startTime = Date.now();
            const timerElement = document.getElementById('timer');
            if (!timerElement) {
                console.error('Timer element not found');
                return;
            }
            timerInterval = setInterval(() => {
                const elapsedTime = Date.now() - startTime;
                const minutes = Math.floor(elapsedTime / 60000);
                const seconds = Math.floor((elapsedTime % 60000) / 1000);
                timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                console.log(`Timer updated: ${timerElement.textContent}`);
            }, 1000);
        }

        // Перемешивание и запуск таймера при переходе на экран теста №1
        document.querySelector('[data-test="test1"]').addEventListener('click', () => {
            console.log('test1 button clicked');
            // Начальный порядок картинок
            images.forEach((img, index) => img.setAttribute('data-order', index + 1));
            images.forEach(img => imagesContainer.appendChild(img));
            startTimer();
            
            // Перемешивание через 30 секунд для тестирования
            // Замените 30000 на 180000 для 3 минут
            shuffleTimeout = setTimeout(() => {
                shuffleArray(images);
                images.forEach(img => imagesContainer.appendChild(img));
                enableDragAndDrop();
            }, 30000); // 30 секунд для тестирования
        });

        document.getElementById('checkTest1').addEventListener('click', () => {
            console.log('checkTest1 button clicked');
            clearInterval(timerInterval); // Остановка таймера
            clearTimeout(shuffleTimeout); // Отмена перемешивания, если еще не произошло

            let userOrder = [];
            images.forEach(img => {
                userOrder.push(parseInt(img.getAttribute('data-order')));
            });

            let correctCount = userOrder.filter((num, index) => num === correctOrder[index]).length;

            let resultMessage;
            if (correctCount <= 2) { // Измените условие, чтобы сравнение было корректным
                resultMessage = "Ничего страшного! В следующий раз результат будет лучше!";
            } else if (correctCount <= 4) {
                resultMessage = "Ты уже делаешь успехи, продолжай в том же духе!";
            } else {
                resultMessage = "У тебя отличная память! Молодец!";
            }

            alert(resultMessage);
            document.getElementById('nextTest1').style.display = 'block';
        });

        document.getElementById('nextTest1').addEventListener('click', () => {
            console.log('nextTest1 button clicked');
            goToNextTest(1);
        });

        function enableDragAndDrop() {
            let dragSrcEl = null;

            function handleDragStart(e) {
                this.style.opacity = '0.4';
                dragSrcEl = this;

                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/html', this.outerHTML);
            }

            function handleDragOver(e) {
                if (e.preventDefault) {
                    e.preventDefault();
                }

                e.dataTransfer.dropEffect = 'move';
                return false;
            }

            function handleDragEnter(e) {
                this.classList.add('over');
            }

            function handleDragLeave(e) {
                this.classList.remove('over');
            }

            function handleDrop(e) {
                if (e.stopPropagation) {
                    e.stopPropagation();
                }

                if (dragSrcEl !== this) {
                    dragSrcEl.outerHTML = this.outerHTML;
                    this.outerHTML = e.dataTransfer.getData('text/html');
                    enableDragAndDrop(); // Reinitialize drag and drop after updating elements
                }

                return false;
            }

            function handleDragEnd(e) {
                this.style.opacity = '1';
                items.forEach(function (item) {
                    item.classList.remove('over');
                });
            }

            let items = document.querySelectorAll('#sortable-images img');
            items.forEach(function (item) {
                item.addEventListener('dragstart', handleDragStart, false);
                item.addEventListener('dragenter', handleDragEnter, false);
                item.addEventListener('dragover', handleDragOver, false);
                item.addEventListener('dragleave', handleDragLeave, false);
                item.addEventListener('drop', handleDrop, false);
                item.addEventListener('dragend', handleDragEnd, false);
            });
        }

        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }

        // Вызов функции enableDragAndDrop для инициализации перетаскивания
        enableDragAndDrop();
    }

    // Функция перехода к следующему тесту
    function goToNextTest(currentTest) {
        console.log(`goToNextTest called with currentTest: ${currentTest}`);
        const nextTest = currentTest + 1;
        const nextTestId = `test${nextTest}`;
        const nextTestElement = document.getElementById(nextTestId);
        if (nextTestElement) {
            showScreen(nextTest);
            currentScreen = nextTest;
        } else {
            alert("Это был последний тест.");
            showScreen(0); // Возвращаемся на главный экран
        }
    }
// Тест №2: Таблица Шульте
const test2 = document.getElementById('test2');
if (test2) {
    const schulteTableContainer = test2.querySelector('.schulte-table-container');
    const checkTest2Button = document.getElementById('checkTest2');
    const nextTest2Button = document.createElement('button'); // Создаем кнопку для перехода к следующему тесту
    nextTest2Button.id = 'nextTest2';
    nextTest2Button.className = 'button';
    nextTest2Button.style.display = 'none'; // Скрываем кнопку по умолчанию
    nextTest2Button.textContent = 'Следующий тест';
    test2.querySelector('.card').appendChild(nextTest2Button);
    let timerInterval;
    let startTime;
    const correctOrder = [19, 2, 9, 24, 6, 17, 4, 21, 11, 18, 12, 3, 13, 8, 16, 5, 22, 23, 20, 1, 14, 15, 7, 25, 10];

    // Функция для создания фиксированной таблицы Шульте с указанными числами
    function createFixedSchulteTable() {
        const table = document.createElement('div');
        table.className = 'schulte-table';
        correctOrder.forEach(number => {
            const cell = document.createElement('div');
            cell.textContent = number;
            cell.className = 'schulte-cell';
            table.appendChild(cell);
        });
        return table;
    }

    // Функция для отображения таблицы Шульте
    function displaySchulteTable() {
        schulteTableContainer.innerHTML = ''; // Очистить существующую таблицу
        const table = createFixedSchulteTable();
        schulteTableContainer.appendChild(table);
    }

    // Функция для скрытия таблицы Шульте
    function hideSchulteTable() {
        schulteTableContainer.innerHTML = ''; // Очистить таблицу
    }

    // Функция для отображения пустой таблицы с возможностью редактирования
    function displayEmptyTable() {
        schulteTableContainer.innerHTML = ''; // Очистить существующую таблицу
        const table = document.createElement('div');
        table.className = 'schulte-table';
        for (let i = 0; i < 25; i++) {
            const cell = document.createElement('div');
            cell.contentEditable = true; // Сделать ячейки редактируемыми
            cell.className = 'schulte-cell empty';
            table.appendChild(cell);
        }
        schulteTableContainer.appendChild(table);
    }

    // Функция для запуска таймера
    function startTimer() {
        console.log('startTimer called');
        startTime = Date.now();
        const timerElement = document.getElementById('schulte-timer');
        if (!timerElement) {
            console.error('Timer element not found');
            return;
        }
        timerInterval = setInterval(() => {
            const elapsedTime = Date.now() - startTime;
            const minutes = Math.floor(elapsedTime / 60000);
            const seconds = Math.floor((elapsedTime % 60000) / 1000);
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            console.log(`Timer updated: ${timerElement.textContent}`);
        }, 1000);
    }

    // Функция для проверки таблицы Шульте
    function validateSchulteTable() {
        const cells = test2.querySelectorAll('.schulte-cell.empty');
        let userNumbers = [];
        cells.forEach(cell => {
            const number = parseInt(cell.textContent.trim());
            if (!isNaN(number)) {
                userNumbers.push(number);
            }
        });

        let correctCount = userNumbers.filter((num, index) => num === correctOrder[index]).length;

        let resultMessage;
        if (correctCount <= 8) {
            resultMessage = "Ничего страшного! В следующий раз результат будет лучше!";
        } else if (correctCount <= 16) {
            resultMessage = "Ты уже делаешь успехи, продолжай в том же духе!";
        } else {
            resultMessage = "У тебя отличная память! Молодец!";
        }

        alert(resultMessage);
    }

    // Обработчик для кнопки начала теста Шульте
    document.getElementById('startSchulteTest').addEventListener('click', () => {
        console.log('startSchulteTest button clicked');
        displaySchulteTable(); // Показать таблицу Шульте
        startTimer(); // Запустить таймер
        setTimeout(() => {
            hideSchulteTable(); // Скрыть таблицу через 30 секунд для тестирования
            // Замените 30000 на 300000 для 5 минут
            displayEmptyTable(); // Показать пустую таблицу для ввода ответов
        }, 30000); // 30 секунд для тестирования
        // Замените 30000 на 300000 для 5 минут
    });

    // Обработчик для кнопки проверки теста Шульте
    checkTest2Button.addEventListener('click', () => {
        console.log('checkTest2 button clicked');
        validateSchulteTable();
        nextTest2Button.style.display = 'block';
    });

    // Обработчик для кнопки перехода к следующему тесту
    nextTest2Button.addEventListener('click', () => {
        console.log('nextTest2 button clicked');
        goToNextTest(2);
    });
}
// Тест №3: Память на цифры
const test3 = document.getElementById('test3');
if (test3) {
    const numbers = [13, 91, 47, 39, 65, 83, 19, 51, 23, 94, 71, 87];
    const numbersContainer = test3.querySelector('.numbers');
    const checkTest3Button = document.getElementById('checkTest3');
    const nextTest3Button = document.createElement('button'); // Создаем кнопку для перехода к следующему тесту
    nextTest3Button.id = 'nextTest3';
    nextTest3Button.className = 'button';
    nextTest3Button.style.display = 'none'; // Скрываем кнопку по умолчанию
    nextTest3Button.textContent = 'Следующий тест';
    test3.querySelector('.card').appendChild(nextTest3Button);
    let timerInterval;
    let startTime;

    // Функция отображения чисел
    function displayNumbers() {
        console.log('displayNumbers called');
        numbersContainer.innerHTML = ''; // Очистить контейнер
        numbersContainer.style.display = 'flex'; // Добавить display flex для горизонтального отображения
        numbersContainer.style.flexDirection = 'row'; // Установить горизонтальное направление
        numbers.forEach(num => {
            const numberElement = document.createElement('div');
            numberElement.className = 'number';
            numberElement.style.marginRight = '10px'; // Добавим отступ справа для лучшего отображения
            numberElement.textContent = num;
            numbersContainer.appendChild(numberElement);
        });
        console.log('Numbers displayed:', numbers);
    }

    // Функция запуска таймера на 20 секунд
    function startTimer() {
        console.log('startTimer called');
        startTime = Date.now();
        const timerElement = document.getElementById('timer3');
        if (!timerElement) {
            console.error('Timer element not found');
            return;
        }
        timerInterval = setInterval(() => {
            const elapsedTime = Date.now() - startTime;
            const seconds = Math.floor((20000 - elapsedTime) / 1000);
            timerElement.textContent = `${seconds.toString().padStart(2, '0')}`;
            console.log(`Timer updated: ${timerElement.textContent}`);
            if (seconds <= 0) {
                clearInterval(timerInterval);
                numbersContainer.innerHTML = ''; // Очистить контейнер чисел после 20 секунд
                console.log('Numbers container cleared');
                checkTest3Button.style.display = 'block'; // Показать кнопку проверки после окончания таймера
            }
        }, 1000);
    }

    const startTest3Button = document.getElementById('startTest3');
    if (startTest3Button) {
        startTest3Button.addEventListener('click', () => {
            console.log('startTest3 button clicked');
            displayNumbers(); // Показать числа
            startTimer(); // Запустить таймер на 20 секунд
        });
    } else {
        console.log('startTest3Button not found');
    }

    if (checkTest3Button) {
        checkTest3Button.addEventListener('click', () => {
            console.log('checkTest3 button clicked');
            let userNumbers = numbers.map((num, index) => parseInt(prompt(`Введите число №${index + 1}:`)));
            let correctCount = userNumbers.filter((num, index) => num === numbers[index]).length;

            let resultMessage;
            if (correctCount <= 4) {
                resultMessage = "Ничего страшного! В следующий раз результат будет лучше!";
            } else if (correctCount <= 8) {
                resultMessage = "Ты уже делаешь успехи, продолжай в том же духе!";
            } else {
                resultMessage = "У тебя отличная память! Молодец!";
            }

            alert(resultMessage);
            console.log('User numbers:', userNumbers);
            console.log('Correct count:', correctCount);
            nextTest3Button.style.display = 'block'; // Показать кнопку перехода к следующему тесту
        });
    } else {
        console.log('checkTest3Button not found');
    }

    if (nextTest3Button) {
        nextTest3Button.addEventListener('click', () => {
            console.log('nextTest3 button clicked');
            goToNextTest(3); // Переход к следующему тесту
        });
    } else {
        console.log('nextTest3Button not found');
    }
}
  //тест №4
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event fired');

    const screens = document.querySelectorAll('.screen');
    const nextButton = document.getElementById('next-button');
    const startButton = document.getElementById('start-button');
    const testButtons = document.querySelectorAll('.test-button');
    let currentScreen = 0;

    function showScreen(index) {
        console.log(`showScreen called with index: ${index}`);
        screens.forEach((screen, i) => {
            screen.classList.toggle('active', i === index);
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            console.log('nextButton clicked');
            const form = document.getElementById('user-form');
            if (form) {
                if (form.checkValidity()) {
                    console.log('Form is valid');
                    document.querySelector('.card.form').style.display = 'none';
                    document.querySelector('.card.intro-text').style.display = 'block';
                } else {
                    console.log('Form is not valid');
                    form.reportValidity();
                }
            } else {
                console.log('Form not found');
            }
        });
    } else {
        console.log('nextButton not found');
    }

    if (startButton) {
        startButton.addEventListener('click', () => {
            console.log('startButton clicked');
            showScreen(1); // Переход на экран с тестами
        });
    } else {
        console.log('startButton not found');
    }

    testButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const testId = event.target.getAttribute('data-test');
            console.log(`testButton clicked, testId: ${testId}`);
            if (testId) {
                const testElement = document.getElementById(testId);
                if (testElement) {
                    testElement.classList.add('active');
                    const testListScreen = document.getElementById('test-list-screen');
                    if (testListScreen) {
                        testListScreen.classList.remove('active');
                    } else {
                        console.log('test-list-screen not found');
                    }
                    currentScreen = parseInt(testId.replace('test', ''));
                } else {
                    console.log(`Element with id ${testId} not found`);
                }
            } else {
                console.log('data-test attribute not found on button');
            }
        });
    });

    // Initialize the first screen
    showScreen(currentScreen);

    // Тест №4
    const startTest4Button = document.getElementById('startTest4');
    const checkTest4Button = document.getElementById('checkTest4');
    const userInput = document.getElementById('userInput');

    console.log('startTest4Button:', startTest4Button);
    console.log('checkTest4Button:', checkTest4Button);
    console.log('userInput:', userInput);

    const correctOrder = "слово1 слово2 слово3 слово4 слово5 слово6 слово7 слово8 слово9 слово10"; // Пример правильного порядка слов

    if (startTest4Button) {
        startTest4Button.addEventListener('click', () => {
            console.log('startTest4 button clicked');
            startTest4Button.style.display = 'none';
            checkTest4Button.style.display = 'block';
        });
    } else {
        console.error('startTest4Button not found');
    }

    if (checkTest4Button) {
        checkTest4Button.addEventListener('click', () => {
            console.log('checkTest4 button clicked');
            const userWords = userInput.value.trim();

            console.log('User Input:', userWords);
            console.log('Correct Order:', correctOrder);

            let resultMessage;
            if (userWords === correctOrder) {
                resultMessage = "Правильно! Молодец!";
            } else {
                resultMessage = "Неправильно. Попробуй еще раз.";
            }

            alert(resultMessage);
        });
    } else {
        console.error('checkTest4Button not found');
    }
});
// Тест №5: Память на образы
const test5 = document.getElementById('test5');
if (test5) {
    const imagesContainer = test5.querySelector('.images');
    let images = Array.from(imagesContainer.querySelectorAll('img'));
    let dragSrcEl = null;

    const correctOrder = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]; // Пример правильного порядка

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function handleDragStart(e) {
        this.style.opacity = '0.4';
        dragSrcEl = this;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.outerHTML);
    }

    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault(); // Necessary. Allows us to drop.
        }
        e.dataTransfer.dropEffect = 'move'; // See the section on the DataTransfer object.
        return false;
    }

    function handleDragEnter(e) {
        this.classList.add('over');
    }

    function handleDragLeave(e) {
        this.classList.remove('over');
    }

    function handleDrop(e) {
        // this / e.target is current target element.
        if (e.stopPropagation) {
            e.stopPropagation(); // Stops some browsers from redirecting.
        }

        // Don't do anything if dropping the same column we're dragging.
        if (dragSrcEl !== this) {
            // Set the source column's HTML to the HTML of the column we dropped on.
            dragSrcEl.outerHTML = this.outerHTML;
            this.outerHTML = e.dataTransfer.getData('text/html');
            images = Array.from(imagesContainer.querySelectorAll('img')); // Update the images array
            addDnDHandlers(); // Reinitialize the drag and drop handlers
        }

        return false;
    }

    function handleDragEnd(e) {
        // this/e.target is the source node.
        this.style.opacity = '1';
        images.forEach(function (item) {
            item.classList.remove('over');
        });
    }

    function addDnDHandlers() {
        let items = document.querySelectorAll('#test5 .images img');
        items.forEach(function (item) {
            item.addEventListener('dragstart', handleDragStart, false);
            item.addEventListener('dragenter', handleDragEnter, false);
            item.addEventListener('dragover', handleDragOver, false);
            item.addEventListener('dragleave', handleDragLeave, false);
            item.addEventListener('drop', handleDrop, false);
            item.addEventListener('dragend', handleDragEnd, false);
        });
    }

    addDnDHandlers(); // Initialize the drag and drop handlers

    const startTest5Button = document.getElementById('startTest5');
    if (startTest5Button) {
        startTest5Button.addEventListener('click', () => {
            console.log('startTest5 button clicked');
            startMemorizationTimer(() => {
                const shuffledImages = shuffleArray(images);
                imagesContainer.innerHTML = ''; // Очистить контейнер
                shuffledImages.forEach(img => {
                    imagesContainer.appendChild(img); // Добавить перемешанные изображения обратно в контейнер
                });
                imagesContainer.style.display = 'grid'; // Установить отображение в виде таблицы
                addDnDHandlers(); // Перепривязать обработчики событий после перемешивания
                document.getElementById('checkTest5').style.display = 'block'; // Показать кнопку проверки
                startTaskTimer(); // Запустить таймер на выполнение задания
            });
        });
    } else {
        console.log('startTest5Button not found');
    }

    const checkTest5Button = document.createElement('button');
    checkTest5Button.id = 'checkTest5';
    checkTest5Button.className = 'button';
    checkTest5Button.style.display = 'none'; // Скрыть кнопку по умолчанию
    checkTest5Button.textContent = 'Проверить';
    test5.querySelector('.card').appendChild(checkTest5Button);

    checkTest5Button.addEventListener('click', () => {
        console.log('checkTest5 button clicked');
        let userOrder = [];
        imagesContainer.querySelectorAll('img').forEach(img => {
            userOrder.push(parseInt(img.getAttribute('data-order')));
        });

        console.log('User Order:', userOrder);
        console.log('Correct Order:', correctOrder);

        let resultMessage;
        if (arraysEqual(userOrder, correctOrder)) {
            resultMessage = "Ты правильно расставил картинки! Молодец!";
        } else {
            resultMessage = "Попробуй еще раз!";
        }

        alert(resultMessage);
        document.getElementById('nextTest5').style.display = 'block';
    });

    const nextTest5Button = document.getElementById('nextTest5');
    if (nextTest5Button) {
        nextTest5Button.addEventListener('click', () => {
            console.log('nextTest5 button clicked');
            goToNextTest(5);
        });
    } else {
        console.log('nextTest5Button not found');
    }

    function arraysEqual(arr1, arr2) {
        if (arr1.length !== arr2.length) return false;
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) return false;
        }
        return true;
    }

    function startMemorizationTimer(callback) {
        console.log('startMemorizationTimer called');
        const timerElement = document.getElementById('test5-timer');
        if (!timerElement) {
            console.error('Timer element not found');
            return;
        }
        let timeLeft = 20; // 20 секунд для запоминания

        const timerInterval = setInterval(() => {
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                callback(); // Вызвать переданную функцию по окончании времени
            } else {
                timerElement.textContent = `Оставшееся время: ${timeLeft} сек`;
                timeLeft -= 1;
            }
        }, 1000);
    }

    function startTaskTimer() {
        console.log('startTaskTimer called');
        const timerElement = document.getElementById('test5-timer');
        if (!timerElement) {
            console.error('Timer element not found');
            return;
        }
        let timeLeft = 60; // 1 минута для выполнения задания

        const timerInterval = setInterval(() => {
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                alert('Время вышло!');
                checkTest5Button.style.display = 'block'; // Показать кнопку проверки по окончании времени
            } else {
                timerElement.textContent = `Оставшееся время: ${timeLeft} сек`;
                timeLeft -= 1;
            }
        }, 1000);
    }
}
      // Тест №6: Таймер на 1 минуту
    const test6 = document.getElementById('test6');
    if (test6) {
        const startTest6Button = document.getElementById('startTest6');
        const checkTest6Button = document.getElementById('checkTest6');
        const nextTest6Button = document.getElementById('nextTest6');
        const timer6 = document.getElementById('timer6');
        const questions6 = document.getElementById('questions6');

        if (startTest6Button) {
            startTest6Button.addEventListener('click', () => {
                console.log('startTest6 button clicked');
                startTest6Button.style.display = 'none';
                timer6.style.display = 'block';
                startTimer(60, timer6, () => {
                    questions6.style.display = 'block';
                    timer6.style.display = 'none';
                });
            });
        } else {
            console.log('startTest6Button not found');
        }

        if (checkTest6Button) {
            checkTest6Button.addEventListener('click', () => {
                console.log('checkTest6 button clicked');
                const answer1 = parseInt(document.getElementById('answer1Test6').value);
                const answer2 = parseInt(document.getElementById('answer2Test6').value);
                const answer3 = document.getElementById('answer3Test6').value.trim();

                let correctAnswers = 0;

                if (answer1 === 4) correctAnswers++;
                if (answer2 === 9) correctAnswers++;
                if (answer3 === '4, 32, 9, 17, 26, 2, 5, 42, 1') correctAnswers++;

                let resultMessage;
                if (correctAnswers === 1) {
                    resultMessage = "Ничего страшного! В следующий раз результат будет лучше!";
                } else if (correctAnswers === 2) {
                    resultMessage = "Ты уже делаешь успехи, продолжай в том же духе";
                } else if (correctAnswers === 3) {
                    resultMessage = "У тебя отличная память! Молодец!";
                } else {
                    resultMessage = "Попробуй снова!";
                }

                alert(resultMessage);
                nextTest6Button.style.display = 'block'; // Показать кнопку перехода к следующему тесту
            });
        } else {
            console.log('checkTest6Button not found');
        }

        if (nextTest6Button) {
            nextTest6Button.addEventListener('click', () => {
                console.log('nextTest6 button clicked');
                // Переход к следующему тесту
                goToNextTest(6);
            });
        } else {
            console.log('nextTest6Button not found');
        }
    }

    // Тест №7: Слова
    const test7 = document.getElementById('test7');
    if (test7) {
        const words = ["Народ", "шкатулка", "сурок", "дворец", "пробежка", "яблоко"];
        const checkTest7Button = document.getElementById('checkTest7');
        const nextTest7Button = document.createElement('button'); // Создаем кнопку для перехода к следующему тесту
        nextTest7Button.id = 'nextTest7';
        nextTest7Button.className = 'button';
        nextTest7Button.style.display = 'none'; // Скрываем кнопку по умолчанию
        nextTest7Button.textContent = 'Следующий тест';
        test7.querySelector('.card').appendChild(nextTest7Button);

        if (checkTest7Button) {
            checkTest7Button.addEventListener('click', () => {
                console.log('checkTest7 button clicked');
                let userWords = words.map((word, index) => prompt(`Введите слово №${index + 1}:`));
                let correctCount = userWords.filter((word, index) => word === words[index]).length;

                let resultMessage;
                if (correctCount <= 2) {
                    resultMessage = "Ничего страшного! В следующий раз результат будет лучше!";
                } else if (correctCount <= 4) {
                    resultMessage = "Ты уже делаешь успехи, продолжай в том же духе!";
                } else {
                    resultMessage = "У тебя отличная память! Молодец!";
                }

                alert(resultMessage);
                console.log('User words:', userWords);
                console.log('Correct count:', correctCount);
                nextTest7Button.style.display = 'block'; // Показать кнопку перехода к следующему тесту
            });
        } else {
            console.log('checkTest7Button not found');
        }

        if (nextTest7Button) {
            nextTest7Button.addEventListener('click', () => {
                console.log('nextTest7 button clicked');
                goToNextTest(7); // Переход к следующему тесту
            });
        } else {
            console.log('nextTest7Button not found');
        }
    }

    // Тест №8: Смысловые цепочки
    const test8 = document.getElementById('test8');
    if (test8) {
        const words = ["Писатель", "опыт", "роза", "подушка", "ребенок", "остров", "вкус", "ложка", "внимание"];
        const checkTest8Button = document.getElementById('checkTest8');
        const nextTest8Button = document.createElement('button'); // Создаем кнопку для перехода к следующему тесту
        nextTest8Button.id = 'nextTest8';
        nextTest8Button.className = 'button';
        nextTest8Button.style.display = 'none'; // Скрываем кнопку по умолчанию
        nextTest8Button.textContent = 'Следующий тест';
        test8.querySelector('.card').appendChild(nextTest8Button);

        if (checkTest8Button) {
            checkTest8Button.addEventListener('click', () => {
                console.log('checkTest8 button clicked');
                let userWords = words.map((word, index) => prompt(`Введите слово №${index + 1}:`));
                let correctCount = userWords.filter((word, index) => word === words[index]).length;

                let resultMessage;
                if (correctCount <= 3) {
                    resultMessage = "Ничего страшного! В следующий раз результат будет лучше!";
                } else if (correctCount <= 6) {
                    resultMessage = "Ты уже делаешь успехи, продолжай в том же духе!";
                } else {
                    resultMessage = "У тебя отличная память! Молодец!";
                }

                alert(resultMessage);
                console.log('User words:', userWords);
                console.log('Correct count:', correctCount);
                nextTest8Button.style.display = 'block'; // Показать кнопку перехода к следующему тесту
            });
        } else {
            console.log('checkTest8Button not found');
        }

        if (nextTest8Button) {
            nextTest8Button.addEventListener('click', () => {
                console.log('nextTest8 button clicked');
                goToNextTest(8); // Переход к следующему тесту
            });
        } else {
            console.log('nextTest8Button not found');
        }
    }

    // Тест №9: Рассказ
    const test9 = document.getElementById('test9');
    if (test9) {
        const story = "В маленьком городке жила девочка по имени Лена..."; // Пример рассказа
        const checkTest9Button = document.getElementById('checkTest9');
        const nextTest9Button = document.createElement('button'); // Создаем кнопку для перехода к следующему тесту
        nextTest9Button.id = 'nextTest9';
        nextTest9Button.className = 'button';
        nextTest9Button.style.display = 'none'; // Скрываем кнопку по умолчанию
        nextTest9Button.textContent = 'Следующий тест';
        test9.querySelector('.card').appendChild(nextTest9Button);

        if (checkTest9Button) {
            checkTest9Button.addEventListener('click', () => {
                console.log('checkTest9 button clicked');
                let userAnswers = []; // Получите ответы от пользователя
                let correctAnswers = ["Лена", "городок", "девочка"]; // Пример правильных ответов
                let correctCount = userAnswers.filter((answer, index) => answer === correctAnswers[index]).length;

                let resultMessage;
                if (correctCount === 1) {
                    resultMessage = "Ничего страшного! В следующий раз результат будет лучше!";
                } else if (correctCount === 2) {
                    resultMessage = "Ты уже делаешь успехи, продолжай в том же духе!";
                } else {
                    resultMessage = "У тебя отличная память! Молодец!";
                }

                alert(resultMessage);
                console.log('User answers:', userAnswers);
                console.log('Correct count:', correctCount);
                nextTest9Button.style.display = 'block'; // Показать кнопку перехода к следующему тесту
            });
        } else {
            console.log('checkTest9Button not found');
        }

        if (nextTest9Button) {
            nextTest9Button.addEventListener('click', () => {
                console.log('nextTest9 button clicked');
                goToNextTest(9); // Переход к следующему тесту
            });
        } else {
            console.log('nextTest9Button not found');
        }
    }

    // Тест №10: Найди пару для слова
    const test10 = document.getElementById('test10');
    if (test10) {
        const wordPairs = [
            ["Дерево", "дятел"],
            ["Замок", "ключ"],
            ["Яблоко", "сад"],
            ["Рыба", "вода"],
            ["Бумага", "ножницы"],
            ["Грибы", "лес"],
            ["Блокнот", "ручка"],
            ["Коза", "рога"],
            ["Доска", "гвоздь"]
        ];
        const checkTest10Button = document.getElementById('checkTest10');
        const nextTest10Button = document.createElement('button'); // Создаем кнопку для перехода к следующему тесту
        nextTest10Button.id = 'nextTest10';
        nextTest10Button.className = 'button';
        nextTest10Button.style.display = 'none'; // Скрываем кнопку по умолчанию
        nextTest10Button.textContent = 'Следующий тест';
        test10.querySelector('.card').appendChild(nextTest10Button);

        if (checkTest10Button) {
            checkTest10Button.addEventListener('click', () => {
                console.log('checkTest10 button clicked');
                let userPairs = wordPairs.map(pair => [prompt(`Введите слово для пары ${pair[0]}:`), pair[1]]);
                let correctCount = userPairs.filter((pair, index) => pair[0] === wordPairs[index][1]).length;

                let resultMessage;
                if (correctCount <= 3) {
                    resultMessage = "Ничего страшного! В следующий раз результат будет лучше!";
                } else if (correctCount <= 6) {
                    resultMessage = "Ты уже делаешь успехи, продолжай в том же духе!";
                } else {
                    resultMessage = "У тебя отличная память! Молодец!";
                }

                alert(resultMessage);
                console.log('User pairs:', userPairs);
                console.log('Correct count:', correctCount);
                nextTest10Button.style.display = 'block'; // Показать кнопку перехода к следующему тесту
            });
        } else {
            console.log('checkTest10Button not found');
        }

        if (nextTest10Button) {
            nextTest10Button.addEventListener('click', () => {
                console.log('nextTest10 button clicked');
                goToNextTest(10); // Переход к следующему тесту
            });
        } else {
            console.log('nextTest10Button not found');
        }
    }

    // Тест №11: Обратный отсчет
    const test11 = document.getElementById('test11');
    if (test11) {
        const numbers = [27, 8, 19, 6, 38, 1, 54, 2, 79];
        const checkTest11Button = document.getElementById('checkTest11');
        const nextTest11Button = document.createElement('button'); // Создаем кнопку для перехода к следующему тесту
        nextTest11Button.id = 'nextTest11';
        nextTest11Button.className = 'button';
        nextTest11Button.style.display = 'none'; // Скрываем кнопку по умолчанию
        nextTest11Button.textContent = 'Следующий тест';
        test11.querySelector('.card').appendChild(nextTest11Button);

        if (checkTest11Button) {
            checkTest11Button.addEventListener('click', () => {
                console.log('checkTest11 button clicked');
                let userNumbers = numbers.map((num, index) => parseInt(prompt(`Введите число №${index + 1}:`)));
                let correctCount = userNumbers.filter((num, index) => num === numbers[index]).length;

                let resultMessage;
                if (correctCount <= 2) {
                    resultMessage = "Ничего страшного! В следующий раз результат будет лучше!";
                } else if (correctCount <= 4) {
                    resultMessage = "Ты уже делаешь успехи, продолжай в том же духе!";
                } else {
                    resultMessage = "У тебя отличная память! Молодец!";
                }

                alert(resultMessage);
                console.log('User numbers:', userNumbers);
                console.log('Correct count:', correctCount);
                nextTest11Button.style.display = 'block'; // Показать кнопку перехода к следующему тесту
            });
        } else {
            console.log('checkTest11Button not found');
        }

        if (nextTest11Button) {
            nextTest11Button.addEventListener('click', () => {
                console.log('nextTest11 button clicked');
                goToNextTest(11); // Переход к следующему тесту
            });
        } else {
 
            console.log('nextTest11Button not found');
        }
    }

    // Тест №12: Числовая последовательность
    const test12 = document.getElementById('test12');
    if (test12) {
        const sequences = [
            [2, 4, 6, 8, 10],
            [3, 5, 10, 12, 24],
            [4, 8, 9, 18, 19]
        ];
        const answers = [12, 26, 39];
        const checkTest12Button = document.getElementById('checkTest12');
        const nextTest12Button = document.createElement('button'); // Создаем кнопку для перехода к следующему тесту
        nextTest12Button.id = 'nextTest12';
        nextTest12Button.className = 'button';
        nextTest12Button.style.display = 'none'; // Скрываем кнопку по умолчанию
        nextTest12Button.textContent = 'Следующий тест';
        test12.querySelector('.card').appendChild(nextTest12Button);

        if (checkTest12Button) {
            checkTest12Button.addEventListener('click', () => {
                console.log('checkTest12 button clicked');
                let userAnswers = sequences.map((seq, index) => parseInt(prompt(`Введите пропущенное число для последовательности ${seq.join(', ')}:`)));
                let correctCount = userAnswers.filter((num, index) => num === answers[index]).length;

                let resultMessage;
                if (correctCount <= 1) {
                    resultMessage = "Ничего страшного! В следующий раз результат будет лучше!";
                } else if (correctCount <= 2) {
                    resultMessage = "Ты уже делаешь успехи, продолжай в том же духе!";
                } else {
                    resultMessage = "У тебя отличная память! Молодец!";
                }

                alert(resultMessage);
                console.log('User answers:', userAnswers);
                console.log('Correct count:', correctCount);
                nextTest12Button.style.display = 'block'; // Показать кнопку перехода к следующему тесту
            });
        } else {
            console.log('checkTest12Button not found');
        }

        if (nextTest12Button) {
            nextTest12Button.addEventListener('click', () => {
                console.log('nextTest12 button clicked');
                goToNextTest(12); // Переход к следующему тесту
            });
        } else {
            console.log('nextTest12Button not found');
        }
    }

    // Тест №13: Фото друзей
    const test13 = document.getElementById('test13');
    if (test13) {
        const checkTest13Button = document.getElementById('checkTest13');
        const nextTest13Button = document.createElement('button'); // Создаем кнопку для перехода к следующему тесту
        nextTest13Button.id = 'nextTest13';
        nextTest13Button.className = 'button';
        nextTest13Button.style.display = 'none'; // Скрываем кнопку по умолчанию
        nextTest13Button.textContent = 'Следующий тест';
        test13.querySelector('.card').appendChild(nextTest13Button);

        if (checkTest13Button) {
            checkTest13Button.addEventListener('click', () => {
                console.log('checkTest13 button clicked');
                let userAnswers = []; // Получите ответы от пользователя
                let correctAnswers = ["правильный ответ 1", "правильный ответ 2", "правильный ответ 3"]; // Пример правильных ответов
                let correctCount = userAnswers.filter((answer, index) => answer === correctAnswers[index]).length;

                let resultMessage;
                if (correctCount === 1) {
                    resultMessage = "Ничего страшного! В следующий раз результат будет лучше!";
                } else if (correctCount === 2) {
                    resultMessage = "Ты уже делаешь успехи, продолжай в том же духе!";
                } else {
                    resultMessage = "У тебя отличная память! Молодец!";
                }

                alert(resultMessage);
                console.log('User answers:', userAnswers);
                console.log('Correct count:', correctCount);
                nextTest13Button.style.display = 'block'; // Показать кнопку перехода к следующему тесту
            });
        } else {
            console.log('checkTest13Button not found');
        }

        if (nextTest13Button) {
            nextTest13Button.addEventListener('click', () => {
                console.log('nextTest13 button clicked');
                goToNextTest(13); // Переход к следующему тесту
            });
        } else {
            console.log('nextTest13Button not found');
        }
    }

    // Тест №14: Логические задачки
    const test14 = document.getElementById('test14');
    if (test14) {
        const checkTest14Button = document.getElementById('checkTest14');
        const nextTest14Button = document.createElement('button'); // Создаем кнопку для перехода к следующему тесту
        nextTest14Button.id = 'nextTest14';
        nextTest14Button.className = 'button';
        nextTest14Button.style.display = 'none'; // Скрываем кнопку по умолчанию
        nextTest14Button.textContent = 'Следующий тест';
        test14.querySelector('.card').appendChild(nextTest14Button);

        if (checkTest14Button) {
            checkTest14Button.addEventListener('click', () => {
                console.log('checkTest14 button clicked');
                let userAnswers = []; // Получите ответы от пользователя
                let correctAnswers = ["дом", "шапка", "груши"]; // Пример правильных ответов
                let correctCount = userAnswers.filter((answer, index) => answer === correctAnswers[index]).length;

                let resultMessage;
                if (correctCount <= 1) {
                    resultMessage = "Ничего страшного! В следующий раз результат будет лучше!";
                } else if (correctCount <= 2) {
                    resultMessage = "Ты уже делаешь успехи, продолжай в том же духе!";
                } else {
                    resultMessage = "У тебя отличная память! Молодец!";
                }

                alert(resultMessage);
                console.log('User answers:', userAnswers);
                console.log('Correct count:', correctCount);
                nextTest14Button.style.display = 'block'; // Показать кнопку перехода к следующему тесту
            });
        } else {
            console.log('checkTest14Button not found');
        }

        if (nextTest14Button) {
            nextTest14Button.addEventListener('click', () => {
                console.log('nextTest14 button clicked');
                goToNextTest(14); // Переход к следующему тесту
            });
        } else {
            console.log('nextTest14Button not found');
        }
    }

    // Тест №15: Лишнее слово
    const test15 = document.getElementById('test15');
    if (test15) {
        const words = [
            ["Дряхлый", "старый", "изношенный", "маленький", "ветхий"],
            ["Кефир", "колбаса", "сливки", "сыр", "сметана"],
            ["Постепенно", "скоро", "быстро", "поспешно", "торопливо"],
            ["Ненавидеть", "презирать", "негодовать", "возмущаться", "наказывать"],
            ["Темный", "светлый", "голубой", "ясный", "тусклый"],
            ["Береза", "сосна", "дерево", "дуб", "ель"],
            ["Молоток", "гвоздь", "муха", "топор", "шуруп"],
            ["Радость", "успех", "удача", "победа", "выигрыш"],
            ["Минута", "секунда", "час", "вечер", "сутки"]
        ];
        const answers = ["маленький", "колбаса", "постепенно", "наказывать", "голубой", "дерево", "муха", "радость", "вечер"];
        const checkTest15Button = document.getElementById('checkTest15');
        const nextTest15Button = document.createElement('button'); // Создаем кнопку для перехода к следующему тесту
        nextTest15Button.id = 'nextTest15';
        nextTest15Button.className = 'button';
        nextTest15Button.style.display = 'none'; // Скрываем кнопку по умолчанию
        nextTest15Button.textContent = 'Следующий тест';
        test15.querySelector('.card').appendChild(nextTest15Button);

        if (checkTest15Button) {
            checkTest15Button.addEventListener('click', () => {
                console.log('checkTest15 button clicked');
                let userAnswers = words.map((wordList, index) => prompt(`Найдите лишнее слово в ряду: ${wordList.join(', ')}:`));
                let correctCount = userAnswers.filter((word, index) => word === answers[index]).length;

                let resultMessage;
                if (correctCount <= 3) {
                    resultMessage = "Ничего страшного! В следующий раз результат будет лучше!";
                } else if (correctCount <= 6) {
                    resultMessage = "Ты уже делаешь успехи, продолжай в том же духе!";
                } else {
                    resultMessage = "У тебя отличная память! Молодец!";
                }

                alert(resultMessage);
                console.log('User answers:', userAnswers);
                console.log('Correct count:', correctCount);
                nextTest15Button.style.display = 'block'; // Показать кнопку перехода к следующему тесту
            });
        } else {
            console.log('checkTest15Button not found');
        }

        if (nextTest15Button) {
            nextTest15Button.addEventListener('click', () => {
                console.log('nextTest15 button clicked');
                goToNextTest(15); // Переход к следующему тесту
            });
        } else {
            console.log('nextTest15Button not found');
        }
    }

    // Тест №16: Стихи
    const test16 = document.getElementById('test16');
    if (test16) {
        const poem = "Весна пришла, цветы расцвели, Зеленый лист на ветках зашумел. Солнце ярко светит в небесах, Скоро птицы вьют гнезда в лесах.";
        const checkTest16Button = document.getElementById('checkTest16');
        const nextTest16Button = document.createElement('button'); // Создаем кнопку для перехода к следующему тесту
        nextTest16Button.id = 'nextTest16';
        nextTest16Button.className = 'button';
        nextTest16Button.style.display = 'none'; // Скрываем кнопку по умолчанию
        nextTest16Button.textContent = 'Следующий тест';
        test16.querySelector('.card').appendChild(nextTest16Button);

        if (checkTest16Button) {
            checkTest16Button.addEventListener('click', () => {
                console.log('checkTest16 button clicked');
                let userLines = poem.split('. ').map((line, index) => prompt(`Введите строку №${index + 1} стихотворения:`));
                let correctCount = userLines.filter((line, index) => line === poem.split('. ')[index]).length;

                let resultMessage;
                if (correctCount <= 1) {
                    resultMessage = "Ничего страшного! В следующий раз результат будет лучше!";
                } else if (correctCount <= 2) {
                    resultMessage = "Ты уже делаешь успехи, продолжай в том же духе!";
                } else {
                    resultMessage = "У тебя отличная память! Молодец!";
                }

                alert(resultMessage);
                console.log('User lines:', userLines);
                console.log('Correct count:', correctCount);
                nextTest16Button.style.display = 'block'; // Показать кнопку перехода к следующему тесту
            });
        } else {
            console.log('checkTest16Button not found');
        }

        if (nextTest16Button) {
            nextTest16Button.addEventListener('click', () => {
                console.log('nextTest16 button clicked');
                goToNextTest(16); // Переход к следующему тесту
            });
        } else {
            console.log('nextTest16Button not found');
        }
    }

    // Тест №17: Запомни маршрут
    const test17 = document.getElementById('test17');
    if (test17) {
        const route = ["Север", "Юг", "Запад", "Восток", "Северо-Запад", "Юго-Запад", "Северо-Восток", "Юго-Восток"];
        const checkTest17Button = document.getElementById('checkTest17');
        const nextTest17Button = document.createElement('button'); // Создаем кнопку для перехода к следующему тесту
        nextTest17Button.id = 'nextTest17';
        nextTest17Button.className = 'button';
        nextTest17Button.style.display = 'none'; // Скрываем кнопку по умолчанию
        nextTest17Button.textContent = 'Следующий тест';
        test17.querySelector('.card').appendChild(nextTest17Button);

        if (checkTest17Button) {
            checkTest17Button.addEventListener('click', () => {
                console.log('checkTest17 button clicked');
                let userRoute = route.map((direction, index) => prompt(`Введите направление №${index + 1}:`));
                let correctCount = userRoute.filter((direction, index) => direction === route[index]).length;

                let resultMessage;
                if (correctCount <= 3) {
                    resultMessage = "Ничего страшного! В следующий раз результат будет лучше!";
                } else if (correctCount <= 6) {
                    resultMessage = "Ты уже делаешь успехи, продолжай в том же духе!";
                } else {
                    resultMessage = "У тебя отличная память! Молодец!";
                }

                alert(resultMessage);
                console.log('User route:', userRoute);
                console.log('Correct count:', correctCount);
                nextTest17Button.style.display = 'block'; // Показать кнопку перехода к следующему тесту
            });
        } else {
            console.log('checkTest17Button not found');
        }

        if (nextTest17Button) {
            nextTest17Button.addEventListener('click', () => {
                console.log('nextTest17 button clicked');
                alert("Это был последний тест. Спасибо за участие!");
                showScreen(0); // Возвращаемся на главный экран
            });
        } else {
            console.log('nextTest17Button not found');
        }
    }
});

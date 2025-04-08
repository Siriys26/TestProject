document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event fired');

    const screens = document.querySelectorAll('.screen');
    const testButtons = document.querySelectorAll('.test-button');
    const nextButton = document.getElementById('next-button');
    const startButton = document.getElementById('start-button');
    let currentScreen = 0;

    function showScreen(screenId) {
        console.log(`showScreen called with screenId: ${screenId}`);
        screens.forEach(screen => {
            if (screen) {
                screen.classList.remove('active');
            }
        });
        const screenElement = document.getElementById(screenId);
        if (screenElement) {
            screenElement.classList.add('active');
        } else {
            console.log(`Element with id ${screenId} not found`);
        }
    }

    testButtons.forEach(button => {
        button.addEventListener('click', () => {
            const testId = button.getAttribute('data-test');
            showScreen(testId);
        });
    });

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            console.log('nextButton clicked');
            showScreen('test-list-screen'); // Переход на экран с тестами
        });
    } else {
        console.log('nextButton not found');
    }

    if (startButton) {
        startButton.addEventListener('click', () => {
            console.log('startButton clicked');
            showScreen('test-list-screen'); // Переход на экран с тестами
        });
    } else {
        console.log('startButton not found');
    }

    // Initialize the first screen
    showScreen('intro-screen');

    function goToTestList() {
        console.log('goToTestList called');
        screens.forEach(screen => {
            if (screen) {
                screen.classList.remove('active');
            }
        });
        const testListScreen = document.getElementById('test-list-screen');
        if (testListScreen) {
            testListScreen.classList.add('active');
        } else {
            console.log('test-list-screen not found');
        }
    }

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
            const timerElement = document.getElementById('timer1');
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
            if (correctCount <= 2) { 
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
            goToTestList();
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
            console.log(`User numbers: ${userNumbers}`);
            console.log(`Correct count: ${correctCount}`);

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
            goToTestList();
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

        nextTest3Button.addEventListener('click', () => {
            console.log('nextTest3 button clicked');
            goToTestList(); // Переход к списку тестов
        });
    }

// Тест №4: Заучивание 10 слов
const test4 = document.getElementById('test4');
if (test4) {
    // Массив слов для запоминания
    const words4 = ["кубик", "груша", "блокнот", "свеча", "фотография", "заколка", "цирк", "щетка", "кот", "гриб"];
    // Таймер на 1 минуту для теста №4
    const timerDuration4 = 60000; // 1 минута в миллисекундах

    // Функция для начала теста №4
    function startTest4() {
        document.getElementById("questions4").style.display = "none";
        document.getElementById("nextTest4").style.display = "none";
        document.getElementById("retryTest4").style.display = "none";
        document.querySelector("#test4 audio").style.display = "block"; // Показать аудио

        // Таймер отсчета времени для информации
        let timer = timerDuration4 / 1000;
        const timerInterval4 = setInterval(() => {
            document.getElementById("timer4").textContent = `Осталось времени: ${timer} секунд`;
            timer--;
            if (timer < 0) {
                clearInterval(timerInterval4);
                document.getElementById("retryTest4").style.display = "block"; // Показать кнопку "Пройти еще раз"
                document.getElementById("timer4").textContent = "";
                document.querySelector("#test4 audio").style.display = "none"; // Скрыть аудио
            }
        }, 1000);

        setTimeout(() => {
            document.getElementById("questions4").style.display = "block";
        }, timerDuration4);
    }

    // Функция для отправки ответов для теста №4
    function submitAnswers4() {
        const answers = [
            document.getElementById("answer1").value,
            document.getElementById("answer2").value,
            document.getElementById("answer3").value,
            document.getElementById("answer4").value,
            document.getElementById("answer5").value,
            document.getElementById("answer6").value,
            document.getElementById("answer7").value,
            document.getElementById("answer8").value,
            document.getElementById("answer9").value,
            document.getElementById("answer10").value,
        ];

        const correctAnswers = ["кубик", "груша", "блокнот", "свеча", "фотография", "заколка", "цирк", "щетка", "кот", "гриб"];
        let correctAnswersCount = 0;

        // Проверяем ответы пользователя и увеличиваем счетчик правильных ответов
        answers.forEach((answer, index) => {
            if (answer.trim().toLowerCase() === correctAnswers[index].toLowerCase()) {
                correctAnswersCount++;
            }
        });

        displayResult4(correctAnswersCount);
    }

    // Функция для отображения результата на основе количества правильных ответов для теста №4
    function displayResult4(correctAnswersCount) {
        let resultMessage = "";

        if (correctAnswersCount >= 1 && correctAnswersCount <= 3) {
            resultMessage = "Ничего страшного! В следующий раз результат будет лучше!";
        } else if (correctAnswersCount >= 4 && correctAnswersCount <= 6) {
            resultMessage = "Ты уже делаешь успехи, продолжай в том же духе!";
        } else if (correctAnswersCount >= 7 && correctAnswersCount <= 10) {
            resultMessage = "У тебя отличная память! Молодец!";
        } else {
            resultMessage = "Попробуй еще раз!";
        }

        alert(resultMessage);
        document.getElementById("nextTest4").style.display = "block";
    }

    // Функция для возврата к списку тестов
    function goToTestList() {
        document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
        document.getElementById("test-list-screen").classList.add("active");
    }

    // Добавляем обработчики событий к кнопкам для теста №4
    document.getElementById("startTest4").addEventListener("click", startTest4);
    document.getElementById("checkTest4").addEventListener("click", submitAnswers4);
    document.getElementById("retryTest4").addEventListener("click", startTest4);
    document.getElementById("nextTest4").addEventListener("click", goToTestList);
}
  
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
        let items = imagesContainer.querySelectorAll('img');
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

    const checkTest5Button = document.getElementById('checkTest5');
    if (checkTest5Button) {
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
    } else {
        console.log('checkTest5Button not found');
    }

    const nextTest5Button = document.getElementById('nextTest5');
    if (nextTest5Button) {
        nextTest5Button.addEventListener('click', () => {
            console.log('nextTest5 button clicked');
            goToTestList();
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
            } else {
                timerElement.textContent = `Оставшееся время: ${timeLeft} сек`;
                timeLeft -= 1;
            }
        }, 1000);
    }

    // Функция для возврата к списку тестов
    function goToTestList() {
        console.log('goToTestList called');
        document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
        document.getElementById("test-list-screen").classList.add('active');
    }
}
// Тест №6: Таймер на 1 минуту
// Массив чисел для запоминания
const numbers = [4, 32, 9, 17, 26, 2, 5, 42, 1];

// Таймер на 30 секунд для тестирования
const timerDuration = 30000; // Поставьте 60000 для 1 минуты

// Функция для начала теста
function startTest() {
  document.getElementById("numbers").textContent = numbers.join(", ");
  document.getElementById("questions6").style.display = "none";
  document.getElementById("nextTest6").style.display = "none";
  document.getElementById("retryTest6").style.display = "none";
  document.getElementById("checkTest6").style.display = "block"; // Показать кнопку "Проверить"

  // Таймер отсчета времени для информации
  let timer = timerDuration / 1000;
  const timerInterval = setInterval(() => {
    document.getElementById("timer6").textContent = `Осталось времени: ${timer} секунд`;
    timer--;
    if (timer < 0) {
      clearInterval(timerInterval);
      document.getElementById("numbers").textContent = ""; // Скрыть числа
      document.getElementById("retryTest6").style.display = "block"; // Показать кнопку "Пройти еще раз"
      document.getElementById("timer6").textContent = "";
    }
  }, 1000);

  setTimeout(() => {
    document.getElementById("questions6").style.display = "block";
  }, timerDuration);
}

// Функция для отправки ответов
function submitAnswers() {
  const answer1 = document.getElementById("answer1").value;
  const correctAnswer1 = 17;
  const answer2 = document.getElementById("answer2").value;
  const correctAnswer2 = 9;
  const answer3 = document.getElementById("answer3").value;
  const correctAnswer3 = "4, 32, 9, 17, 26, 2, 5, 42, 1";

  let correctAnswersCount = 0;

  // Проверяем ответы пользователя и увеличиваем счетчик правильных ответов
  if (parseInt(answer1) === correctAnswer1) correctAnswersCount++;
  if (parseInt(answer2) === correctAnswer2) correctAnswersCount++;
  if (answer3 === correctAnswer3) correctAnswersCount++;

  displayResult(correctAnswersCount);
}

// Функция для отображения результата на основе количества правильных ответов
function displayResult(correctAnswersCount) {
  let resultMessage = "";

  if (correctAnswersCount === 1) {
    resultMessage = "Ничего страшного! В следующий раз результат будет лучше!";
  } else if (correctAnswersCount === 2) {
    resultMessage = "Ты уже делаешь успехи, продолжай в том же духе!";
  } else if (correctAnswersCount === 3) {
    resultMessage = "У тебя отличная память! Молодец!";
  } else {
    resultMessage = "Попробуй еще раз!";
  }

  alert(resultMessage);
  document.getElementById("nextTest6").style.display = "block";
}

// Функция для возврата к списку тестов
function goToTestList() {
  // Скрываем текущий экран теста и показываем экран списка тестов
  document.getElementById("test6").classList.remove("active");
  document.getElementById("test-list-screen").classList.add("active");
}

// Добавляем обработчики событий к кнопкам
document.getElementById("startTest6").addEventListener("click", startTest);
document.getElementById("checkTest6").addEventListener("click", submitAnswers);
document.getElementById("retryTest6").addEventListener("click", startTest);
document.getElementById("nextTest6").addEventListener("click", goToTestList);


// Тест №7: Слова
// Массив слов для запоминания
const words7 = ["Народ", "шкатулка", "сурок", "дворец", "пробежка", "яблоко"];

// Таймер на 30 секунд для тестирования
const timerDuration7 = 30000; // Поставьте 60000 для 1 минуты

// Функция для начала теста
function startTest7() {
  document.getElementById("words").textContent = words7.join(", ");
  document.getElementById("questions7").style.display = "none";
  document.getElementById("nextTest7").style.display = "none";
  document.getElementById("retryTest7").style.display = "none";
  document.getElementById("checkTest7").style.display = "block"; // Показать кнопку "Проверить"

  // Таймер отсчета времени для информации
  let timer = timerDuration7 / 1000;
  const timerInterval7 = setInterval(() => {
    document.getElementById("timer7").textContent = `Осталось времени: ${timer} секунд`;
    timer--;
    if (timer < 0) {
      clearInterval(timerInterval7);
      document.getElementById("words").textContent = ""; // Скрыть слова
      document.getElementById("retryTest7").style.display = "block"; // Показать кнопку "Пройти еще раз"
      document.getElementById("timer7").textContent = "";
    }
  }, 1000);

  setTimeout(() => {
    document.getElementById("questions7").style.display = "block";
  }, timerDuration7);
}

// Функция для отправки ответов
function submitAnswers7() {
  const answer1 = document.getElementById("answer1").value;
  const correctAnswer1 = 4;
  const answer2 = document.getElementById("answer2").value;
  const correctAnswer2 = 6;
  const answer3 = document.getElementById("answer3").value;
  const correctAnswer3 = "Народ, шкатулка, сурок, дворец, пробежка, яблоко";

  let correctAnswersCount = 0;

  // Проверяем ответы пользователя и увеличиваем счетчик правильных ответов
  if (parseInt(answer1) === correctAnswer1) correctAnswersCount++;
  if (parseInt(answer2) === correctAnswer2) correctAnswersCount++;
  if (answer3 === correctAnswer3) correctAnswersCount++;

  displayResult7(correctAnswersCount);
}

// Функция для отображения результата на основе количества правильных ответов
function displayResult7(correctAnswersCount) {
  let resultMessage = "";

  if (correctAnswersCount === 1) {
    resultMessage = "Ничего страшного! В следующий раз результат будет лучше!";
  } else if (correctAnswersCount === 2) {
    resultMessage = "Ты уже делаешь успехи, продолжай в том же духе!";
  } else if (correctAnswersCount === 3) {
    resultMessage = "У тебя отличная память! Молодец!";
  } else {
    resultMessage = "Попробуй еще раз!";
  }

  alert(resultMessage);
  document.getElementById("nextTest7").style.display = "block";
}

// Функция для возврата к списку тестов
function goToTestList() {
  // Скрываем текущий экран теста и показываем экран списка тестов
  document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
  document.getElementById("test-list-screen").classList.add("active");
}

// Добавляем обработчики событий к кнопкам
document.getElementById("startTest7").addEventListener("click", startTest7);
document.getElementById("checkTest7").addEventListener("click", submitAnswers7);
document.getElementById("retryTest7").addEventListener("click", startTest7);
document.getElementById("nextTest7").addEventListener("click", goToTestList);


// Тест №8: Смысловые цепочки
// Массив слов для запоминания
const words8 = ["Писатель", "опыт", "роза", "подушка", "ребенок", "остров", "вкус", "ложка", "внимание"];

// Таймер на 30 секунд для тестирования
const timerDuration8 = 30000; // Поставьте 60000 для 1 минуты

// Функция для начала теста
function startTest8() {
  document.getElementById("words8").textContent = words8.join(", ");
  document.getElementById("questions8").style.display = "none";
  document.getElementById("nextTest8").style.display = "none";
  document.getElementById("retryTest8").style.display = "none";
  document.getElementById("checkTest8").style.display = "block"; // Показать кнопку "Проверить"

  // Таймер отсчета времени для информации
  let timer = timerDuration8 / 1000;
  const timerInterval8 = setInterval(() => {
    document.getElementById("timer8").textContent = `Осталось времени: ${timer} секунд`;
    timer--;
    if (timer < 0) {
      clearInterval(timerInterval8);
      document.getElementById("words8").textContent = ""; // Скрыть слова
      document.getElementById("retryTest8").style.display = "block"; // Показать кнопку "Пройти еще раз"
      document.getElementById("timer8").textContent = "";
    }
  }, 1000);

  setTimeout(() => {
    document.getElementById("questions8").style.display = "block";
  }, timerDuration8);
}

// Функция для отправки ответов
function submitAnswers8() {
  const answers = [
    document.getElementById("answer1").value,
    document.getElementById("answer2").value,
    document.getElementById("answer3").value,
    document.getElementById("answer4").value,
    document.getElementById("answer5").value,
    document.getElementById("answer6").value,
    document.getElementById("answer7").value,
    document.getElementById("answer8").value,
    document.getElementById("answer9").value,
  ];

  const correctAnswers = ["Писатель", "опыт", "роза", "подушка", "ребенок", "остров", "вкус", "ложка", "внимание"];
  let correctAnswersCount = 0;

  // Проверяем ответы пользователя и увеличиваем счетчик правильных ответов
  answers.forEach((answer, index) => {
    if (answer.trim().toLowerCase() === correctAnswers[index].toLowerCase()) {
      correctAnswersCount++;
    }
  });

  displayResult8(correctAnswersCount);
}

// Функция для отображения результата на основе количества правильных ответов
function displayResult8(correctAnswersCount) {
  let resultMessage = "";

  if (correctAnswersCount >= 1 && correctAnswersCount <= 3) {
    resultMessage = "Ничего страшного! В следующий раз результат будет лучше!";
  } else if (correctAnswersCount >= 4 && correctAnswersCount <= 6) {
    resultMessage = "Ты уже делаешь успехи, продолжай в том же духе!";
  } else if (correctAnswersCount >= 7) {
    resultMessage = "У тебя отличная память! Молодец!";
  } else {
    resultMessage = "Попробуй еще раз!";
  }

  alert(resultMessage);
  document.getElementById("nextTest8").style.display = "block";
}

// Функция для возврата к списку тестов
function goToTestList() {
  // Скрываем текущий экран теста и показываем экран списка тестов
  document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
  document.getElementById("test-list-screen").classList.add("active");
}

// Добавляем обработчики событий к кнопкам
document.getElementById("startTest8").addEventListener("click", startTest8);
document.getElementById("checkTest8").addEventListener("click", submitAnswers8);
document.getElementById("retryTest8").addEventListener("click", startTest8);
document.getElementById("nextTest8").addEventListener("click", goToTestList);
  
// Тест №4: Рассказ
const test9 = document.getElementById('test9');
if (test9) {
    // Функция для начала теста №4
    function startTest9() {
        document.getElementById("story").style.display = "none"; // Скрыть рассказ
        document.getElementById("questions9").style.display = "block";
        document.getElementById("nextTest9").style.display = "none";
        document.getElementById("retryTest9").style.display = "none";
    }

    // Функция для отправки ответов для теста №4
    function submitAnswers9() {
        const answer1 = document.getElementById("answer1").value.toLowerCase().trim();
        const answer2 = document.getElementById("answer2").value.toLowerCase().trim();
        const answer3 = document.getElementById("answer3").value.toLowerCase().trim();

        const correctAnswers1 = ["лена"];
        const correctAnswers2 = ["листья", "красивые листья"];
        const correctAnswers3 = ["камень", "сияющий камень", "странный камень"];

        let correctAnswersCount = 0;

        if (correctAnswers1.includes(answer1)) correctAnswersCount++;
        if (correctAnswers2.includes(answer2)) correctAnswersCount++;
        if (correctAnswers3.includes(answer3)) correctAnswersCount++;

        displayResult9(correctAnswersCount);
    }

    // Функция для отображения результата на основе количества правильных ответов для теста №4
    function displayResult9(correctAnswersCount) {
        let resultMessage = "";

        if (correctAnswersCount === 1) {
            resultMessage = "Ничего страшного! В следующий раз результат будет лучше!";
        } else if (correctAnswersCount === 2) {
            resultMessage = "Ты уже делаешь успехи, продолжай в том же духе!";
        } else if (correctAnswersCount === 3) {
            resultMessage = "У тебя отличная память! Молодец!";
        } else {
            resultMessage = "Попробуй еще раз!";
        }

        alert(resultMessage);
        document.getElementById("nextTest9").style.display = "block";
    }

    // Функция для возврата к списку тестов
    function goToTestList() {
        // Скрываем текущий экран теста и показываем экран списка тестов
        document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
        document.getElementById("test-list-screen").classList.add("active");
    }

    // Добавляем обработчики событий к кнопкам для теста №4
    document.getElementById("startTest9").addEventListener("click", startTest9);
    document.getElementById("checkTest9").addEventListener("click", submitAnswers9);
    document.getElementById("retryTest9").addEventListener("click", startTest9);
    document.getElementById("nextTest9").addEventListener("click", goToTestList);
}

// Тест №5: Найди пару для слова
const test10 = document.getElementById('test10');
if (test10) {
    const wordPairs = [
        { question: "Дерево", answer: "дятел" },
        { question: "Замок", answer: "ключ" },
        { question: "Яблоко", answer: "сад" },
        { question: "Рыба", answer: "вода" },
        { question: "Бумага", answer: "ножницы" },
        { question: "Грибы", answer: "лес" },
        { question: "Блокнот", answer: "ручка" },
        { question: "Коза", answer: "рога" },
        { question: "Доска", answer: "гвоздь" },
    ];

    const timerDuration = 120000; // 2 минуты в миллисекундах

    // Функция для начала теста №5
    function startTest10() {
        document.getElementById("wordPairs").style.display = "none"; // Скрыть слова
        document.getElementById("questions10").style.display = "block";
        document.getElementById("nextTest10").style.display = "none";
        document.getElementById("retryTest10").style.display = "none";

        let timer = timerDuration / 1000;
        const timerInterval = setInterval(() => {
            document.getElementById("timer10").textContent = `Осталось времени: ${timer} секунд`;
            timer--;
            if (timer < 0) {
                clearInterval(timerInterval);
                document.getElementById("timer10").textContent = "";
                document.getElementById("retryTest10").style.display = "block"; // Показать кнопку "Пройти еще раз"
            }
        }, 1000);

        setTimeout(() => {
            document.getElementById("questions10").style.display = "block";
        }, timerDuration);
    }

    // Функция для отправки ответов для теста №5
    function submitAnswers10() {
        const answers = [
            document.getElementById("answer1").value.toLowerCase().trim(),
            document.getElementById("answer2").value.toLowerCase().trim(),
            document.getElementById("answer3").value.toLowerCase().trim(),
            document.getElementById("answer4").value.toLowerCase().trim(),
            document.getElementById("answer5").value.toLowerCase().trim(),
            document.getElementById("answer6").value.toLowerCase().trim(),
            document.getElementById("answer7").value.toLowerCase().trim(),
            document.getElementById("answer8").value.toLowerCase().trim(),
            document.getElementById("answer9").value.toLowerCase().trim(),
        ];

        let correctAnswersCount = 0;
        wordPairs.forEach((pair, index) => {
            if (answers[index] === pair.answer) {
                correctAnswersCount++;
            }
        });

        displayResult10(correctAnswersCount);
    }

    // Функция для отображения результата на основе количества правильных ответов для теста №5
    function displayResult10(correctAnswersCount) {
        let resultMessage = "";

        if (correctAnswersCount >= 1 && correctAnswersCount <= 3) {
            resultMessage = "Ничего страшного! В следующий раз результат будет лучше!";
        } else if (correctAnswersCount >= 4 && correctAnswersCount <= 6) {
            resultMessage = "Ты уже делаешь успехи, продолжай в том же духе!";
        } else if (correctAnswersCount >= 7) {
            resultMessage = "У тебя отличная память! Молодец!";
        } else {
            resultMessage = "Попробуй еще раз!";
        }

        alert(resultMessage);
        document.getElementById("nextTest10").style.display = "block";
    }

    // Функция для возврата к списку тестов
    function goToTestList() {
        // Скрываем текущий экран теста и показываем экран списка тестов
        document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
        document.getElementById("test-list-screen").classList.add("active");
    }

    // Добавляем обработчики событий к кнопкам для теста №5
    document.getElementById("startTest10").addEventListener("click", startTest10);
    document.getElementById("checkTest10").addEventListener("click", submitAnswers10);
    document.getElementById("retryTest10").addEventListener("click", startTest10);
    document.getElementById("nextTest10").addEventListener("click", goToTestList);
}
  
// Тест №6: Обратный отсчет
const test11 = document.getElementById('test11');
if (test11) {
    const numbers = [27, 8, 19, 6, 38, 1, 54, 2, 79];
    const reversedNumbers = [...numbers].reverse();
    const correctAnswer1 = 4;
    const correctAnswer2 = numbers.length;
    const correctAnswer3 = reversedNumbers.join(', ');

    const timerDuration = 60000; // 1 минута в миллисекундах

    // Функция для начала теста №6
    function startTest11() {
        document.getElementById("numbers11").style.display = "none"; // Скрыть числа
        document.getElementById("questions11").style.display = "block";
        document.getElementById("nextTest11").style.display = "none";
        document.getElementById("retryTest11").style.display = "none";

        let timer = timerDuration / 1000;
        const timerInterval = setInterval(() => {
            document.getElementById("timer11").textContent = `Осталось времени: ${timer} секунд`;
            timer--;
            if (timer < 0) {
                clearInterval(timerInterval);
                document.getElementById("timer11").textContent = "";
                document.getElementById("retryTest11").style.display = "block"; // Показать кнопку "Пройти еще раз"
            }
        }, 1000);

        setTimeout(() => {
            document.getElementById("questions11").style.display = "block";
        }, timerDuration);
    }

    // Функция для отправки ответов для теста №6
    function submitAnswers11() {
        const answer1 = parseInt(document.getElementById("answer1").value.trim());
        const answer2 = parseInt(document.getElementById("answer2").value.trim());
        const answer3 = document.getElementById("answer3").value.trim();

        let correctAnswersCount = 0;

        if (answer1 === correctAnswer1) correctAnswersCount++;
        if (answer2 === correctAnswer2) correctAnswersCount++;
        if (answer3 === correctAnswer3) correctAnswersCount++;

        displayResult11(correctAnswersCount);
    }

    // Функция для отображения результата на основе количества правильных ответов для теста №6
    function displayResult11(correctAnswersCount) {
        let resultMessage = "";

        if (correctAnswersCount === 1) {
            resultMessage = "Ничего страшного! В следующий раз результат будет лучше!";
        } else if (correctAnswersCount === 2) {
            resultMessage = "Ты уже делаешь успехи, продолжай в том же духе!";
        } else if (correctAnswersCount === 3) {
            resultMessage = "У тебя отличная память! Молодец!";
        } else {
            resultMessage = "Попробуй еще раз!";
        }

        alert(resultMessage);
        document.getElementById("nextTest11").style.display = "block";
    }

    // Функция для возврата к списку тестов
    function goToTestList() {
        // Скрываем текущий экран теста и показываем экран списка тестов
        document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
        document.getElementById("test-list-screen").classList.add("active");
    }

    // Добавляем обработчики событий к кнопкам для теста №6
    document.getElementById("startTest11").addEventListener("click", startTest11);
    document.getElementById("checkTest11").addEventListener("click", submitAnswers11);
    document.getElementById("retryTest11").addEventListener("click", startTest11);
    document.getElementById("nextTest11").addEventListener("click", goToTestList);
}  
// Тест №7: Числовая последовательность
const test12 = document.getElementById('test12');
if (test12) {
    const correctAnswers = [12, 26, 39];

    // Функция для отправки ответов для теста №7
    function submitAnswers12() {
        const answer1 = parseInt(document.getElementById("answer1").value.trim());
        const answer2 = parseInt(document.getElementById("answer2").value.trim());
        const answer3 = parseInt(document.getElementById("answer3").value.trim());

        let correctAnswersCount = 0;

        if (answer1 === correctAnswers[0]) correctAnswersCount++;
        if (answer2 === correctAnswers[1]) correctAnswersCount++;
        if (answer3 === correctAnswers[2]) correctAnswersCount++;

        displayResult12(correctAnswersCount);
    }

    // Функция для отображения результата на основе количества правильных ответов для теста №7
    function displayResult12(correctAnswersCount) {
        let resultMessage = "";

        if (correctAnswersCount === 1) {
            resultMessage = "Ничего страшного! В следующий раз результат будет лучше!";
        } else if (correctAnswersCount === 2) {
            resultMessage = "Ты уже делаешь успехи, продолжай в том же духе!";
        } else if (correctAnswersCount === 3) {
            resultMessage = "У тебя отличная память! Молодец!";
        } else {
            resultMessage = "Попробуй еще раз!";
        }

        alert(resultMessage);
        document.getElementById("nextTest12").style.display = "block";
    }

    // Функция для возврата к списку тестов
    function goToTestList() {
        // Скрываем текущий экран теста и показываем экран списка тестов
        document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
        document.getElementById("test-list-screen").classList.add("active");
    }

    // Добавляем обработчики событий к кнопкам для теста №7
    document.getElementById("checkTest12").addEventListener("click", submitAnswers12);
    document.getElementById("retryTest12").addEventListener("click", submitAnswers12);
    document.getElementById("nextTest12").addEventListener("click", goToTestList);
}  
  
  
// Тест №8: Фото друзей
const test13 = document.getElementById('test13');
if (test13) {
    const correctAnswers = {
        answer1: "3",
        answer2: "Мужчина, Женщина, Мужчина, Женщина, Женшина",
        answer3: "Красная"
    };

    const timerDuration = 60000; // 1 минута в миллисекундах

    // Функция для начала теста №8
    function startTest13() {
        document.getElementById("photo13").style.display = "block"; // Показать фото
        document.getElementById("questions13").style.display = "none"; // Скрыть вопросы
        document.getElementById("nextTest13").style.display = "none";
        document.getElementById("retryTest13").style.display = "none";

        let timer = timerDuration / 1000;
        const timerInterval = setInterval(() => {
            document.getElementById("timer13").textContent = `Осталось времени: ${timer} секунд`;
            timer--;
            if (timer < 0) {
                clearInterval(timerInterval);
                document.getElementById("timer13").textContent = "";
                document.getElementById("photo13").style.display = "none"; // Скрыть фото
                document.getElementById("questions13").style.display = "block"; // Показать вопросы
            }
        }, 1000);
    }

    // Функция для отправки ответов для теста №8
    function submitAnswers13() {
        const answer1 = document.getElementById("answer1").value.trim();
        const answer2 = document.getElementById("answer2").value.trim();
        const answer3 = document.getElementById("answer3").value.trim();

        let correctAnswersCount = 0;

        if (answer1.toLowerCase() === correctAnswers.answer1.toLowerCase()) correctAnswersCount++;
        if (answer2.toLowerCase() === correctAnswers.answer2.toLowerCase()) correctAnswersCount++;
        if (answer3.toLowerCase() === correctAnswers.answer3.toLowerCase()) correctAnswersCount++;

        displayResult13(correctAnswersCount);
    }

    // Функция для отображения результата на основе количества правильных ответов для теста №8
    function displayResult13(correctAnswersCount) {
        let resultMessage = "";

        if (correctAnswersCount === 1) {
            resultMessage = "Ничего страшного! В следующий раз результат будет лучше!";
        } else if (correctAnswersCount === 2) {
            resultMessage = "Ты уже делаешь успехи, продолжай в том же духе!";
        } else if (correctAnswersCount === 3) {
            resultMessage = "У тебя отличная память! Молодец!";
        } else {
            resultMessage = "Попробуй еще раз!";
        }

        alert(resultMessage);
        document.getElementById("nextTest13").style.display = "block";
    }

    // Функция для возврата к списку тестов
    function goToTestList() {
        // Скрываем текущий экран теста и показываем экран списка тестов
        document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
        document.getElementById("test-list-screen").classList.add("active");
    }

    // Добавляем обработчики событий к кнопкам для теста №8
    document.getElementById("startTest13").addEventListener("click", startTest13);
    document.getElementById("checkTest13").addEventListener("click", submitAnswers13);
    document.getElementById("retryTest13").addEventListener("click", startTest13);
    document.getElementById("nextTest13").addEventListener("click", goToTestList);
}
// Тест №9: Логические задачки
const test14 = document.getElementById('test14');
if (test14) {
    const correctAnswers = {
        answer1: "дом",
        answer2: "шапки",
        answer3: "груши"
    };

    // Функция для отправки ответов для теста №9
    function submitAnswers14() {
        const answer1 = document.getElementById("answer1").value.trim().toLowerCase();
        const answer2 = document.getElementById("answer2").value.trim().toLowerCase();
        const answer3 = document.getElementById("answer3").value.trim().toLowerCase();

        let correctAnswersCount = 0;

        if (answer1 === correctAnswers.answer1) correctAnswersCount++;
        if (answer2 === correctAnswers.answer2) correctAnswersCount++;
        if (answer3 === correctAnswers.answer3) correctAnswersCount++;

        displayResult14(correctAnswersCount);
    }

    // Функция для отображения результата на основе количества правильных ответов для теста №9
    function displayResult14(correctAnswersCount) {
        let resultMessage = "";

        switch (correctAnswersCount) {
            case 1:
                resultMessage = "Ничего страшного! В следующий раз результат будет лучше!";
                break;
            case 2:
                resultMessage = "Ты уже делаешь успехи, продолжай в том же духе!";
                break;
            case 3:
                resultMessage = "У тебя отличная память! Молодец!";
                break;
            default:
                resultMessage = "Попробуй еще раз!";
                break;
        }

        alert(resultMessage);
        document.getElementById("nextTest14").style.display = "block";
        document.getElementById("retryTest14").style.display = "block";
        document.getElementById("questions14").style.display = "none";
    }

    // Функция для возврата к списку тестов
    function goToTestList() {
        // Скрываем текущий экран теста и показываем экран списка тестов
        document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
        document.getElementById("test-list-screen").classList.add("active");
    }

    // Добавляем обработчики событий к кнопкам для теста №9
    document.getElementById("checkTest14").addEventListener("click", submitAnswers14);
    document.getElementById("retryTest14").addEventListener("click", () => {
        document.getElementById("answer1").value = "";
        document.getElementById("answer2").value = "";
        document.getElementById("answer3").value = "";
        document.getElementById("nextTest14").style.display = "none";
        document.getElementById("retryTest14").style.display = "none";
        document.getElementById("questions14").style.display = "block";
    });
    document.getElementById("nextTest14").addEventListener("click", goToTestList);
}
  
// Тест №10: Лишнее слово
const test15 = document.getElementById('test15');
if (test15) {
    const correctAnswers = {
        answer1: "маленький",
        answer2: "колбаса",
        answer3: "постепенно",
        answer4: "наказывать",
        answer5: "голубой",
        answer6: "дерево",
        answer7: "муха",
        answer8: "радость",
        answer9: "вечер"
    };

    // Функция для отправки ответов для теста №10
    function submitAnswers15() {
        const answer1 = document.getElementById("answer1").value.trim().toLowerCase();
        const answer2 = document.getElementById("answer2").value.trim().toLowerCase();
        const answer3 = document.getElementById("answer3").value.trim().toLowerCase();
        const answer4 = document.getElementById("answer4").value.trim().toLowerCase();
        const answer5 = document.getElementById("answer5").value.trim().toLowerCase();
        const answer6 = document.getElementById("answer6").value.trim().toLowerCase();
        const answer7 = document.getElementById("answer7").value.trim().toLowerCase();
        const answer8 = document.getElementById("answer8").value.trim().toLowerCase();
        const answer9 = document.getElementById("answer9").value.trim().toLowerCase();

        let correctAnswersCount = 0;

        if (answer1 === correctAnswers.answer1) correctAnswersCount++;
        if (answer2 === correctAnswers.answer2) correctAnswersCount++;
        if (answer3 === correctAnswers.answer3) correctAnswersCount++;
        if (answer4 === correctAnswers.answer4) correctAnswersCount++;
        if (answer5 === correctAnswers.answer5) correctAnswersCount++;
        if (answer6 === correctAnswers.answer6) correctAnswersCount++;
        if (answer7 === correctAnswers.answer7) correctAnswersCount++;
        if (answer8 === correctAnswers.answer8) correctAnswersCount++;
        if (answer9 === correctAnswers.answer9) correctAnswersCount++;

        displayResult15(correctAnswersCount);
    }

    // Функция для отображения результата на основе количества правильных ответов для теста №10
    function displayResult15(correctAnswersCount) {
        let resultMessage = "";

        if (correctAnswersCount >= 7) {
            resultMessage = "У тебя отличная память! Молодец!";
        } else if (correctAnswersCount >= 4) {
            resultMessage = "Ты уже делаешь успехи, продолжай в том же духе!";
        } else {
            resultMessage = "Ничего страшного! В следующий раз результат будет лучше!";
        }

        alert(resultMessage);
        document.getElementById("nextTest15").style.display = "block";
        document.getElementById("retryTest15").style.display = "block";
        document.getElementById("questions15").style.display = "none";
    }

    // Функция для возврата к списку тестов
    function goToTestList() {
        // Скрываем текущий экран теста и показываем экран списка тестов
        document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
        document.getElementById("test-list-screen").classList.add("active");
    }

    // Добавляем обработчики событий к кнопкам для теста №10
    document.getElementById("checkTest15").addEventListener("click", submitAnswers15);
    document.getElementById("retryTest15").addEventListener("click", () => {
        document.getElementById("answer1").value = "";
        document.getElementById("answer2").value = "";
        document.getElementById("answer3").value = "";
        document.getElementById("answer4").value = "";
        document.getElementById("answer5").value = "";
        document.getElementById("answer6").value = "";
        document.getElementById("answer7").value = "";
        document.getElementById("answer8").value = "";
        document.getElementById("answer9").value = "";
        document.getElementById("nextTest15").style.display = "none";
        document.getElementById("retryTest15").style.display = "none";
        document.getElementById("questions15").style.display = "block";
    });
    document.getElementById("nextTest15").addEventListener("click", goToTestList);
}

// Тест №11: Стихи
const test17 = document.getElementById('test17');
if (test17) {
    const correctAnswers = {
        answer1: "весна пришла, цветы расцвели",
        answer2: "зеленый лист на ветках зашумел",
        answer3: "солнце ярко светит в небесах",
        answer4: "скоро птицы вьют гнезда в лесах"
    };

    const timerDuration = 60000; // 1 минута в миллисекундах

    // Функция для начала теста №11
    function startTest17() {
        document.getElementById("poem").style.display = "block"; // Показать стихотворение
        document.getElementById("questions17").style.display = "none"; // Скрыть вопросы
        document.getElementById("nextTest17").style.display = "none";
        document.getElementById("retryTest17").style.display = "none";

        let timer = timerDuration / 1000;
        const timerInterval = setInterval(() => {
            document.getElementById("timer17").textContent = `Осталось времени: ${timer} секунд`;
            timer--;
            if (timer < 0) {
                clearInterval(timerInterval);
                document.getElementById("timer17").textContent = "";
                document.getElementById("poem").style.display = "none"; // Скрыть стихотворение
                document.getElementById("questions17").style.display = "block"; // Показать вопросы
            }
        }, 1000);
    }

    // Функция для отправки ответов для теста №11
    function submitAnswers17() {
        const answer1 = document.getElementById("answer1").value.trim().toLowerCase();
        const answer2 = document.getElementById("answer2").value.trim().toLowerCase();
        const answer3 = document.getElementById("answer3").value.trim().toLowerCase();
        const answer4 = document.getElementById("answer4").value.trim().toLowerCase();

        let correctAnswersCount = 0;

        if (answer1 === correctAnswers.answer1) correctAnswersCount++;
        if (answer2 === correctAnswers.answer2) correctAnswersCount++;
        if (answer3 === correctAnswers.answer3) correctAnswersCount++;
        if (answer4 === correctAnswers.answer4) correctAnswersCount++;

        displayResult17(correctAnswersCount);
    }

    // Функция для отображения результата на основе количества правильных ответов для теста №11
    function displayResult17(correctAnswersCount) {
        let resultMessage = "";

        if (correctAnswersCount >= 3) {
            resultMessage = "У тебя отличная память! Молодец!";
        } else if (correctAnswersCount >= 2) {
            resultMessage = "Ты уже делаешь успехи, продолжай в том же духе!";
        } else {
            resultMessage = "Ничего страшного! В следующий раз результат будет лучше!";
        }

        alert(resultMessage);
        document.getElementById("nextTest17").style.display = "block";
        document.getElementById("retryTest17").style.display = "block";
        document.getElementById("questions17").style.display = "none";
    }

    // Функция для возврата к списку тестов
    function goToTestList() {
        // Скрываем текущий экран теста и показываем экран списка тестов
        document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
        document.getElementById("test-list-screen").classList.add("active");
    }

    // Добавляем обработчики событий к кнопкам для теста №11
    document.getElementById("startTest17").addEventListener("click", startTest17);
    document.getElementById("checkTest17").addEventListener("click", submitAnswers17);
    document.getElementById("retryTest17").addEventListener("click", () => {
        document.getElementById("answer1").value = "";
        document.getElementById("answer2").value = "";
        document.getElementById("answer3").value = "";
        document.getElementById("answer4").value = "";
        document.getElementById("nextTest17").style.display = "none";
        document.getElementById("retryTest17").style.display = "none";
        document.getElementById("questions17").style.display = "none";
        document.getElementById("poem").style.display = "block";
        startTest17();
    });
    document.getElementById("nextTest17").addEventListener("click", goToTestList);
}
  
// Тест №17: Запомни маршрут
if (typeof test17 === 'undefined') {
    const test17 = document.getElementById('test17');
    if (test17) {
        const correctAnswers = {
            answer1: "7",
            answer2: "магазин",
            answer3: "конфеты",
            answer4: "тюльпан",
            answer5: "шахматы",
            answer6: "в беседке",
            answer7: "книги",
            answer8: "птицу",
            answer9: "дом"
        };

        const timerDuration = 300; // 5 минут в секундах

        function startTest17() {
            const memoryText = document.getElementById("memory-text");
            const questionsElement = document.getElementById("questions17");
            const nextTestButton = document.getElementById("nextTest17");
            if (memoryText && questionsElement && nextTestButton) {
                memoryText.style.display = "block"; // Показать текст для запоминания
                questionsElement.style.display = "none"; // Скрыть вопросы
                nextTestButton.style.display = "none";

                let timer = timerDuration;
                const timerElement = document.getElementById("timer17");
                const timerInterval = setInterval(() => {
                    const minutes = Math.floor(timer / 60);
                    const seconds = timer % 60;
                    if (timerElement) {
                        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                    }
                    timer--;
                    if (timer < 0) {
                        clearInterval(timerInterval);
                        if (timerElement) {
                            timerElement.textContent = "00:00";
                        }
                        memoryText.style.display = "none"; // Скрыть текст для запоминания
                        questionsElement.style.display = "block"; // Показать вопросы
                    }
                }, 1000);
            } else {
                console.log('One or more elements for test 17 not found');
            }
        }

        function submitAnswers17() {
            const answers = [
                document.getElementById("answer1").value.trim(),
                document.getElementById("answer2").value.trim().toLowerCase(),
                document.getElementById("answer3").value.trim().toLowerCase(),
                document.getElementById("answer4").value.trim().toLowerCase(),
                document.getElementById("answer5").value.trim().toLowerCase(),
                document.getElementById("answer6").value.trim().toLowerCase(),
                document.getElementById("answer7").value.trim().toLowerCase(),
                document.getElementById("answer8").value.trim().toLowerCase(),
                document.getElementById("answer9").value.trim().toLowerCase()
            ];

            let correctAnswersCount = 0;

            answers.forEach((answer, index) => {
                if (answer === Object.values(correctAnswers)[index]) {
                    correctAnswersCount++;
                }
            });

            displayResult17(correctAnswersCount);
        }

        function displayResult17(correctAnswersCount) {
            let resultMessage = "";

            if (correctAnswersCount >= 1 && correctAnswersCount <= 3) {
                resultMessage = "Ничего страшного! В следующий раз результат будет лучше!";
            } else if (correctAnswersCount >= 4 && correctAnswersCount <= 6) {
                resultMessage = "Ты уже делаешь успехи, продолжай в том же духе!";
            } else if (correctAnswersCount >= 7) {
                resultMessage = "У тебя отличная память! Молодец!";
            }

            alert(resultMessage);
            document.getElementById("nextTest17").style.display = "block";
        }

        document.getElementById("startTest17").addEventListener("click", startTest17);
        document.getElementById("checkTest17").addEventListener("click", submitAnswers17);
        document.getElementById("nextTest17").addEventListener("click", goToTestList);
    }
}
});

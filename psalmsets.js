let psalmSets = new Map([
    [
        'Все',
        (psalmNumber) => true
    ],
    [
        'Тикун а-Клали',
        (psalmNumber) => [16, 32, 41, 42, 59, 77, 90, 105, 137, 150].indexOf(psalmNumber) !== -1
    ],
    [
        'Сгула Моше',
        (psalmNumber) => psalmNumber >= 90 && psalmNumber <= 100
    ],
    [
        'Алель (Галель)',
        (psalmNumber) => psalmNumber >= 112 && psalmNumber <= 118
    ],
    [
        'Шир а-Маалот',
        (psalmNumber) => psalmNumber >= 120 && psalmNumber <= 134
    ],
    [
        'Любимые псалмы',
        (psalmNumber) => [15, 20, 21, 22, 30, 31, 104, 139].indexOf(psalmNumber) !== -1
    ],
    // https://toldot.com/urava/ask/urava_7036.html
    [
        'Адам',
        (psalmNumber) => [92, 139].indexOf(psalmNumber) !== -1
    ],
    [
        'Малки-Цедек (Шем, сын Ноаха)',
        (psalmNumber) => psalmNumber === 110
    ],
    [
        'Авраам',
        (psalmNumber) => psalmNumber === 89
    ],
    [
        'Эйман',
        (psalmNumber) => psalmNumber === 88
    ],
    [
        'Йедутун',
        (psalmNumber) => [39, 62, 77].indexOf(psalmNumber) !== -1
    ],
    [
        'Сыновья Кораха',
        (psalmNumber) => [42, 44, 45, 46, 47, 48, 49, 84, 85, 87, 88].indexOf(psalmNumber) !== -1
    ],
    [
        'Асаф',
        (psalmNumber) => psalmNumber === 50 || (psalmNumber >= 73 && psalmNumber <= 83)
    ],
    [
        'Шломо',
        (psalmNumber) => [72, 127].indexOf(psalmNumber) !== -1
    ],
]);

export { psalmSets };
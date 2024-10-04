let psalmSets = new Map([
    [
        'Все',
        function(psalmNumber) {
            return true;
        }
    ],
    [
        'Тикун а-Клали',
        function(psalmNumber) {
            return [16, 32, 41, 42, 59, 77, 90, 105, 137, 150].indexOf(psalmNumber) !== -1;
        }
    ],
    [
        'Сгула Моше',
        function(psalmNumber) {
            return psalmNumber >= 90 && psalmNumber <= 100;
        }
    ],
    [
        'Алель (Галель)',
        function(psalmNumber) {
            return psalmNumber >= 112 && psalmNumber <= 118;
        }
    ],
    [
        'Шир а-Маалот',
        function(psalmNumber) {
            return psalmNumber >= 120 && psalmNumber <= 134;
        }
    ],
    [
        'Любимые псалмы',
        function(psalmNumber) {
            return [15, 20, 21, 22, 30, 31, 104, 139].indexOf(psalmNumber) !== -1;
        }
    ],
    // https://toldot.com/urava/ask/urava_7036.html
    [
        'Адам',
        function(psalmNumber) {
            return [92, 139].indexOf(psalmNumber) !== -1;
        }
    ],
    [
        'Малки-Цедек (Шем, сын Ноаха)',
        function(psalmNumber) {
            return psalmNumber === 110;
        }
    ],
    [
        'Авраам',
        function(psalmNumber) {
            return psalmNumber === 89;
        }
    ],
    [
        'Эйман',
        function(psalmNumber) {
            return psalmNumber === 88;
        }
    ],
    [
        'Йедутун',
        function(psalmNumber) {
            return [39, 62, 77].indexOf(psalmNumber) !== -1;
        }
    ],
    [
        'Сыновья Кораха',
        function(psalmNumber) {
            return [42, 44, 45, 46, 47, 48, 49, 84, 85, 87, 88].indexOf(psalmNumber) !== -1;
        }
    ],
    [
        'Асаф',
        function(psalmNumber) {
            return psalmNumber === 50 || (psalmNumber >= 73 && psalmNumber <= 83);
        }
    ],
    [
        'Шломо',
        function(psalmNumber) {
            return [72, 127].indexOf(psalmNumber) !== -1;
        }
    ],
]);

export { psalmSets };
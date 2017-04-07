(function () {
    let arr = [1, 2, 3];
    let foo = (...n) => {
        Array.of(...n, 1, 2, 3, 4, 5);
    };
    class Base {

        constructor(a) {
            this.a = 1;
        }
    }

}())
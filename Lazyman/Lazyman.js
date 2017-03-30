const run = tasks => {
    const task = tasks.shift();
    if (task != null) {
        if (task instanceof Promise) {
            task.then(() => {
                run(tasks);
            });
        }
        else {
            task();
            run(tasks);
        }
    }
};

class Lazyman {
    constructor(name) {
        this.name = name;
        this.tasks = [];

        this.say();
        setTimeout(() => {
            run(this.tasks);
        }, 0);
    }

    execute(task, direction = 1) {
        switch (direction) {
            case 1:
                this.tasks.push(task);
                break;
            case -1:
                this.tasks.unshift(task);
                break;
        }
    }

    say() {
        this.execute(() => {
            console.log(`Hi! This is ${this.name}!`);
        });
        return this;
    }

    eat(toEat) {
        this.execute(() => {
            console.log(`Eat ${toEat}~`);
        });
        return this;
    }

    sleep(seconds = 0) {
        this.execute(new Promise((resolve) => {
            setTimeout(() => {
                console.log(`Wake up after ${seconds}`);
                resolve();
            }, seconds * 1000);
        }));
        return this;
    }

    sleepFirst(seconds = 0) {
        this.execute(new Promise((resolve) => {
            setTimeout(() => {
                console.log(`Wake up after ${seconds}`);
                resolve();
            }, seconds * 1000);
        }), -1);
        return this;
    }
}

const LazymanInitializer = (name) => {
    return new Lazyman(name);
}

export { LazymanInitializer as Lazyman }

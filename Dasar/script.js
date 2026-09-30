// const hello = name => `Hello ${name}`

// console.log(hello("Ipan"))

// const hello = (name, age) => ({
//     status: 'OK',
//     message: `Hello ${name}, age ${age}`
// });

// hello("Ipan", 20);

function sum(...rest) {
    let sum = 0;

    for(let number of rest) sum += number;
    return sum;
}

let x = sum(4, 9, 16, 25, 29, 100, 66, 77); // <-- output "326"

console.log(x)

const obj = {
    name: "Ipan",
    age: 20
};


const {name, age} = obj;

console.log(name);
console.log(age);


const name1 = "Ipan"
const age1 = 21
const obj1 = {name, age};
console.log(obj1)

const arr1 = [1, 2, 3, 4, 5];
const arr2 = [...arr1]

console.log(arr1)
console.log(arr2)

const arr =[1, 2, 3, 4, 5, 6, 7]

const number = arr.map(value => {
    return value;
});

console.log(number);

// Promise

// let done = false

// const task = new Promise((resolve, reject) => {
//     if(done) {
//         resolve('Task berhasil diselesaikan')
//     } else {
//         reject('Task belum diselesaikan')
//     }
// })

// task
//     .then(response => console.log(response))
//     .catch(response => console.log(response))

// console.log(task)

const taskPromise = () => {
    return new Promise(resolve => {
        setTimeout(() => resolve('Selesai'), 3000)
    })
}

const task = async () => {
    const done = await taskPromise();
    console.log(done);
}

console.log('Mulai')
task();
console.log('Akhir')